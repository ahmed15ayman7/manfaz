'use client';

import { useEffect } from 'react';
import { useSocket } from '@/lib/socket';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session } = useSession();
  const { socket, connect, disconnect } = useSocket();

  useEffect(() => {
    if (session?.user?.token && session?.user?.id && !socket) {
      // تحديد نوع المستخدم من الجلسة
      const userType = session.user.role as 'user' | 'worker' | 'store' | 'admin';
      connect(session.user.token, session.user.id, userType);
    }

    if (!session?.user?.token && socket) {
      disconnect();
    }
  }, [session, socket, connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    // إعداد الإشعارات
    const initNotifications = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    };

    const showNotification = (title: string, options = {}) => {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          icon: '/notification-icon.png',
          ...options,
        });

        notification.onclick = function() {
          window.focus();
          this.close();
        };
      }
    };

    initNotifications();

    // الاستماع للأحداث العامة
    socket.on('error', (error) => {
      toast.error(error.message);
    });

    // المحفظة
    socket.on('walletUpdated', ({ balance, transaction }) => {
      toast.success(`تم تحديث رصيد محفظتك: ${balance}`);
    });

    // المكافآت
    socket.on('newReward', (reward) => {
      showNotification('مكافأة جديدة!', {
        body: `لقد حصلت على مكافأة جديدة: ${reward.title}`,
      });
    });

    // الطلبات
    socket.on('orderCreated', (order) => {
      showNotification('طلب جديد', {
        body: `تم إنشاء طلب جديد برقم: ${order.id}`,
      });
    });

    socket.on('orderUpdated', (order) => {
      toast.info(`تم تحديث حالة الطلب ${order.id} إلى ${order.status}`);
    });

    // تنظيف المستمعين
    return () => {
      socket.off('error');
      socket.off('walletUpdated');
      socket.off('newReward');
      socket.off('orderCreated');
      socket.off('orderUpdated');
    };
  }, [socket]);

  return <>{children}</>;
}; 