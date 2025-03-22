import React, { useEffect } from 'react';
import { useSocket } from '@/lib/socket';
import { toast } from 'react-toastify';

export const OrderNotifications: React.FC = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // استقبال إشعارات الطلبات
    socket.on('newNotification', (notification: any) => {
      // عرض الإشعار باستخدام react-toastify
      toast.info(notification.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        rtl: true // للغة العربية
      });
    });

    return () => {
      socket.off('newNotification');
    };
  }, [socket]);

  return null;
};