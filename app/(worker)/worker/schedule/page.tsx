"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import useStore from '@/store/useLanguageStore'
import { Order, OrderStatus } from '@/interfaces'
import { formatDate } from '@/lib/utils'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'
import ScheduleSkeleton from '@/components/skeletons/ScheduleSkeleton'
import { io } from 'socket.io-client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Transition } from '@headlessui/react'

interface DayStats {
  total: number;
  completed: number;
  pending: number;
  in_progress: number;
  canceled: number;
}

const getWorkerSchedule = async ({ locale, date }: { locale: string; date: string }) => {
  const url = API_ENDPOINTS.workers.getById('me', { lang: locale, include: 'schedule', date }, false)
  const res = await axiosInstance.get(url)
  return res.data
}

const updateOrderTime = async ({ orderId, scheduledTime }: { orderId: string; scheduledTime: string }) => {
  const url = API_ENDPOINTS.orders.update(orderId, {}, false)
  const res = await axiosInstance.patch(url, { scheduledTime })
  return res.data
}

const updateOrderStatus = async ({ orderId, status }: { orderId: string; status: 'accepted' | 'rejected' }) => {
  const url = API_ENDPOINTS.orders.update(orderId, {}, false)
  const res = await axiosInstance.patch(url, { status: status === 'accepted' ? 'in_progress' : 'canceled' })
  return res.data
}

export default function WorkerSchedulePage() {
  const { locale } = useStore()
  const t = useTranslations('worker_schedule')
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDayOrders, setSelectedDayOrders] = useState<Order[]>([])

  // Socket.io connection
  useState(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '')
    socket.on('schedule-updated', () => {
      queryClient.invalidateQueries({ queryKey: ['worker-schedule'] })
      toast.info(t('schedule_changed'))
    })

    return () => {
      socket.disconnect()
    }
  })

  const { data, isLoading } = useQuery({
    queryKey: ['worker-schedule', selectedDate],
    queryFn: () => getWorkerSchedule({
      locale, 
      date: selectedDate.toISOString().split('T')[0] 
    }),
  })

  const updateTimeMutation = useMutation({
    mutationFn: updateOrderTime,
    onSuccess: () => {
      toast.success(t('schedule_updated'))
      queryClient.invalidateQueries({ queryKey: ['worker-schedule'] })
    },
    onError: () => {
      toast.error(t('schedule_update_error'))
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (_, variables) => {
      toast.success(variables.status === 'accepted' ? t('order_accepted') : t('order_rejected'))
      queryClient.invalidateQueries({ queryKey: ['worker-schedule'] })
    },
    onError: () => {
      toast.error(t('status_update_error'))
    },
  })

  const orders: Order[] = data?.data?.orders || []

  // تجميع إحصائيات الطلبات حسب اليوم
  const getDayStats = (date: Date): DayStats => {
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.scheduleOrder?.schedule.scheduledTime || new Date())
      return orderDate.toDateString() === date.toDateString()
    })

    return {
      total: dayOrders.length,
      completed: dayOrders.filter(o => o.status === 'completed').length,
      pending: dayOrders.filter(o => o.status === 'pending').length,
      in_progress: dayOrders.filter(o => o.status === 'in_progress').length,
      canceled: dayOrders.filter(o => o.status === 'canceled').length,
    }
  }

  const handleDayClick = (date: Date) => {
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.scheduleOrder?.schedule.scheduledTime || new Date())
      return orderDate.toDateString() === date.toDateString()
    })
    setSelectedDayOrders(dayOrders)
    setIsDialogOpen(true)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const orderId = result.draggableId
    const newTime = result.destination.droppableId

    updateTimeMutation.mutate({
      orderId,
      scheduledTime: newTime,
    })
  }

  const handleAcceptOrder = (orderId: string) => {
    updateStatusMutation.mutate({ orderId, status: 'accepted' })
  }

  const handleRejectOrder = (orderId: string) => {
    updateStatusMutation.mutate({ orderId, status: 'rejected' })
  }

  if (isLoading) {
    return <ScheduleSkeleton />
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        {t('title')}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date)
                handleDayClick(date)
              }
            }}
            modifiers={{
              hasOrders: (date) => {
                const stats = getDayStats(date)
                return stats.total > 0
              }
            }}
            modifiersStyles={{
              hasOrders: {
                position: 'relative'
              }
            }}
            components={{
              DayContent: ({ date }) => {
                const stats = getDayStats(date)
                return (
                  <div className="relative w-full h-full">
                    <div>{date.getDate()}</div>
                    {stats.total > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
                        <AnimatePresence>
                          {stats.completed > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-full bg-green-500 animate-pulse" 
                            />
                          )}
                          {stats.in_progress > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" 
                            />
                          )}
                          {stats.pending > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" 
                            />
                          )}
                          {stats.canceled > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-full bg-red-500 animate-pulse" 
                            />
                          )}
                        </AnimatePresence>
              </div>
                    )}
            </div>
                )
              }
            }}
            className="rounded-md"
          />
        </motion.div>

        {/* إحصائيات اليوم المحدد */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="md:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-4">
            {t('schedule_for')} {formatDate(selectedDate, locale)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm text-gray-500">{t('total_orders')}</div>
              <div className="text-2xl font-bold">{getDayStats(selectedDate).total}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm text-green-500">{t('completed_orders')}</div>
              <div className="text-2xl font-bold">{getDayStats(selectedDate).completed}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm text-blue-500">{t('in_progress_orders')}</div>
              <div className="text-2xl font-bold">{getDayStats(selectedDate).in_progress}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm text-yellow-500">{t('pending_orders')}</div>
              <div className="text-2xl font-bold">{getDayStats(selectedDate).pending}</div>
            </motion.div>
          </div>
        </motion.div>
        </div>

      {/* Dialog لعرض طلبات اليوم */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <Transition
          show={isDialogOpen}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <DialogContent className="max-w-4xl">
            <DialogTitle className="text-xl font-semibold">
              {t('orders_for_date')} {formatDate(selectedDate, locale)}
            </DialogTitle>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <AnimatePresence>
                {selectedDayOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/worker/orders/${order.id}`}
                      className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{order.service?.name}</h3>
                          <p className="text-sm text-gray-500">{order.user?.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.scheduleOrder?.schedule.scheduledTime || '').toLocaleTimeString(locale)}
                          </p>
                    </div>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'canceled'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {t(`status.${order.status}`)}
                        </span>
                    </div>
                      {order.notes && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {order.notes}
                        </p>
                      )}
                      {order.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault()
                              handleAcceptOrder(order.id)
                            }}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                          >
                            {t('accept')}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault()
                              handleRejectOrder(order.id)
                            }}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                          >
                            {t('reject')}
                          </motion.button>
                  </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </DialogContent>
        </Transition>
      </Dialog>
    </div>
  )
}
