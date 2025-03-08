"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Calendar } from '@/components/ui/calendar'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import useStore from '@/store/useLanguageStore'
import { Order } from '@/interfaces'
import { formatDate } from '@/lib/utils'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'
import ScheduleSkeleton from '@/components/skeletons/ScheduleSkeleton'
import { io } from 'socket.io-client'

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

export default function WorkerSchedulePage() {
  const { locale } = useStore()
  const t = useTranslations('worker_schedule')
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

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

  const orders: Order[] = data?.data?.orders || []

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const orderId = result.draggableId
    const newTime = result.destination.droppableId

    updateTimeMutation.mutate({
      orderId,
      scheduledTime: newTime,
    })
  }

  if (isLoading) {
    return <ScheduleSkeleton />
  }

  // Group orders by time
  const timeSlots = orders.reduce((acc: Record<string, Order[]>, order) => {
    const time = new Date(order.scheduledTime).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    })
    if (!acc[time]) {
      acc[time] = []
    }
    acc[time].push(order)
    return acc
  }, {})

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md"
          />
        </div>

        {/* Schedule */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            {t('schedule_for')} {formatDate(selectedDate, locale)}
          </h2>

          {Object.keys(timeSlots).length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg">
              <p className="text-gray-500">{t('no_appointments')}</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="space-y-4">
                {Object.entries(timeSlots).map(([time, timeOrders]) => (
                  <Droppable key={time} droppableId={time}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-white rounded-lg p-4"
                      >
                        <h3 className="font-medium mb-3">{time}</h3>
                        <div className="space-y-2">
                          {timeOrders.map((order, index) => (
                            <Draggable
                              key={order.id}
                              draggableId={order.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-50 p-3 rounded-lg"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">
                                        {order.service?.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {order.user?.name}
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
                                    <p className="text-sm text-gray-600 mt-2">
                                      {order.notes}
                                    </p>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          )}

          <p className="text-sm text-gray-500 mt-4">
            {t('drag_to_reschedule')}
          </p>
        </div>
      </div>
    </div>
  )
}
