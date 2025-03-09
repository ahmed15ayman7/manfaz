import { useEffect, useState } from 'react';
import { create } from 'zustand';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
}

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

  useEffect(() => {
    const checkPermission = async () => {
      if ('Notification' in window) {
        const status = await Notification.requestPermission();
        setPermission(status);
      }
    };

    checkPermission();
  }, []);

  const showNotification = async (
    title: string,
    options: { body?: string; icon?: string; badge?: string } = {}
  ) => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/notification-icon.png',
        badge: '/notification-badge.png',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      store.addNotification({
        id: Date.now().toString(),
        title,
        message: options.body || '',
        type: 'info',
        timestamp: Date.now(),
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