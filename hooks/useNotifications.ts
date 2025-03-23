'use client';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { Notification as NotificationT,NotificationType
 } from '@/interfaces';
 import {useRouter} from 'next/navigation';

interface NotificationStore {
  notifications: NotificationT[];
  addNotification: (notification: NotificationT) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'success' | 'error' | 'info' | 'warning';
//   timestamp: number;
// }

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const store = useNotificationStore();
  const router = useRouter();
  const checkPermission = async () => {
    if ('Notification' in window) {
      const status = await Notification.requestPermission();
      console.log('Notification permission status:', status);
      setPermission(status);
    }
  };
  useEffect(() => {
    checkPermission();
  }, []);

  const showNotification = async (
    notificationT: NotificationT,
    permission : NotificationPermission,
  ) => {
    console.log("permission",permission);
    if (permission === 'granted') {
      console.log("permission is granted");
      const notification = new Notification(notificationT.title, {
        icon:notificationT?.sender?.imageUrl|| 'https://res.cloudinary.com/dixa9yvlz/image/upload/v1741264530/Manfaz/default-profile.jpg',
        badge: '/assets/images/manfaz_logo.png',
        body: notificationT.message,
        data: notificationT,
        ...notificationT,
      });

      notification.onclick = () => {
        
        window.focus();
        notificationT.type === NotificationType.worker && notificationT.orderId ? router.push(`/worker/orders/${notificationT.orderId}`):notificationT.type === NotificationType.user && notificationT.orderId ? router.push(`/orders/${notificationT.orderId}`):null
        notification.close();
      };

      store.addNotification({
       ...notificationT
      });
    }
  };

  return {
    showNotification,
    notifications: store.notifications,
    removeNotification: store.removeNotification,
    clearNotifications: store.clearNotifications,
    permission,
  };
}; 