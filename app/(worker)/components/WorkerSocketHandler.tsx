'use client';

import { useEffect } from 'react';
import { useSocket } from '@/lib/socket';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

export const WorkerSocketHandler = () => {
  const { socket } = useSocket();
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (!socket) return;

    // طلب جديد
    socket.on('newOrder', ({ type, order }) => {
      if (type === 'service') {
        showNotification('طلب خدمة جديد', {
          body: `لديك طلب خدمة جديد برقم: ${order.id}`,
        });
        toast.info('لديك طلب خدمة جديد');
      }
    });

    // تحديث طلب
    socket.on('orderUpdated', (order) => {
      toast.info(`تم تحديث حالة الطلب ${order.id} إلى ${order.status}`);
    });

    // تقييم جديد
    socket.on('newReview', (review) => {
      showNotification('تقييم جديد', {
        body: `لقد تلقيت تقييماً جديداً: ${review.rating} نجوم`,
      });
    });

    // تحديث الأرباح
    socket.on('earningsUpdated', ({ totalEarned }) => {
      toast.success(`تم تحديث أرباحك: ${totalEarned} ريال`);
    });

    // تحديث الملف الشخصي
    socket.on('profileUpdated', (worker) => {
      toast.success('تم تحديث بياناتك الشخصية بنجاح');
    });

    // تحديث الجدول
    socket.on('scheduleUpdated', (schedule) => {
      toast.info('تم تحديث جدول مواعيدك');
    });

    return () => {
      socket.off('newOrder');
      socket.off('orderUpdated');
      socket.off('newReview');
      socket.off('earningsUpdated');
      socket.off('profileUpdated');
      socket.off('scheduleUpdated');
    };
  }, [socket, showNotification]);

  return null;
}; 