"use client"

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from 'react-beautiful-dnd'
import { Calendar } from '@/components/ui/calendar'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import { Order } from '@/interfaces'
import ScheduleSkeleton from '@/components/skeletons/ScheduleSkeleton'
import { io } from 'socket.io-client'

interface ScheduleData {
  date: Date
  orders: Order[]
}

const getWorkerSchedule = async ({ locale }: { locale: string }) => {
  const res = await axios.get(`${apiUrl}/workers/schedule?lang=${locale}`)
  return res.data
}

export default function WorkerSchedulePage() {
  const { locale } = useStore()
  const t = useTranslations('worker_schedule')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['worker-schedule'],
    queryFn: () => getWorkerSchedule({ locale }),
  })

  const updateOrderTimeMutation = useMutation({
    mutationFn: ({ orderId, newTime }: { orderId: string; newTime: string }) =>
      axios.patch(`${apiUrl}/orders/${orderId}/time`, { time: newTime }),
    onSuccess: () => {
      toast.success(t('schedule_updated'))
      refetch()
    },
    onError: () => {
      toast.error(t('schedule_update_error'))
    },
  })

  useEffect(() => {
    if (data?.data) {
      setScheduleData(data.data)
    }
  }, [data])

  useEffect(() => {
    // Socket.io setup for real-time updates
    const socket = io(apiUrl)

    socket.on('scheduleUpdated', () => {
      refetch()
      toast.info(t('schedule_changed'))
    })

    return () => {
      socket.disconnect()
    }
  }, [refetch, t])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    const sourceTime = source.droppableId
    const destinationTime = destination.droppableId

    if (sourceTime === destinationTime) return

    updateOrderTimeMutation.mutate({
      orderId: draggableId,
      newTime: destinationTime,
    })
  }

  if (isLoading) {
    return <ScheduleSkeleton />
  }

  const selectedDateData = scheduleData.find(
    (data) => data.date.toDateString() === selectedDate.toDateString()
  )

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>

        {/* Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('schedule_for')} {selectedDate.toLocaleDateString(locale)}
            </h2>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="space-y-4">
                {timeSlots.map((time) => {
                  const orders = selectedDateData?.orders.filter(
                    (order) => order.scheduledTime === time
                  )

                  return (
                    <Droppable key={time} droppableId={time}>
                      {(provided: DroppableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="border rounded-lg p-4"
                        >
                          <div className="text-sm text-gray-600 mb-2">{time}</div>
                          <div className="min-h-[50px]">
                            {orders?.map((order, index) => (
                              <Draggable
                                key={order.id}
                                draggableId={order.id}
                                index={index}
                              >
                                {(provided: DraggableProvided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-blue-50 p-3 rounded-lg mb-2"
                                  >
                                    <div className="font-medium">{order.service?.name}</div>
                                    <div className="text-sm text-gray-600">{order.user?.name}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  )
                })}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  )
}
