'use client';

import { useEffect } from 'react';
import { useSocket } from '@/lib/socket';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { toast as toast2 } from 'react-toastify';
import { UserEvents } from '@/types/socket';

export const UserSocketHandler = () => {
  const { socket, userId, userType } = useSocket();
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (!socket || !userId || !userType) return;

    // الطلبات - مشتركة بين جميع الأنواع
    socket.on('orderUpdated', (order) => {
      let message = '';
      
      switch (userType) {
        case 'user':
          if (order.userId === userId) {
            message = `تم تحديث حالة طلبك رقم ${order.id} إلى ${order.status}`;
          }
          break;
        case 'worker':
          if (order.providerId === userId) {
            message = `تم تحديث حالة الطلب ${order.id} إلى ${order.status}`;
          }
          break;
        case 'store':
          if (order.store?.some((store: any) => store.id === userId)) {
            message = `تم تحديث حالة الطلب ${order.id} إلى ${order.status}`;
          }
          break;
        case 'admin':
          message = `تم تحديث حالة الطلب ${order.id} إلى ${order.status}`;
          break;
      }

      if (message) {
        toast.info(message);
        showNotification('تحديث الطلب', { body: message });
      }
    });
    socket.on('newNotification', (notification: any) => {
      // عرض الإشعار باستخدام react-toastify
      if (notification.relatedId=== userId) {
      showNotification('إشعار جديد', { body: notification.message });
      toast2.info(notification.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        rtl: true // للغة العربية
      });}
    });

    // إشعارات خاصة بالمستخدم العادي
    if (userType === 'user') {
      // المحفظة
      socket.on('walletUpdated', (data: UserEvents['walletUpdated']) => {
        showNotification('تحديث المحفظة', {
          body: `تم تحديث رصيد محفظتك: ${data.balance} ريال`,
        });
        toast.success(`تم تحديث رصيد محفظتك: ${data.balance} ريال`);
      });

      // المكافآت
      socket.on('newReward', (reward: UserEvents['newReward']) => {
        showNotification('مكافأة جديدة!', {
          body: `لقد حصلت على مكافأة جديدة: ${reward.title}`,
        });
        toast.success('مكافأة جديدة!', {
          description: `لقد حصلت على مكافأة جديدة: ${reward.title}`,
        });
      });
    }

    // إشعارات خاصة بالعامل
    if (userType === 'worker') {
      socket.on('newOrder', (data) => {
        if (data.type === 'service'&&data.providerId===userId) {
          showNotification('طلب خدمة جديد', {
            body: `لديك طلب خدمة جديد برقم: ${data.order.id}`,
          });
          toast.info('لديك طلب خدمة جديد');
        }
      });

      socket.on('earningsUpdated', (data) => {
        toast.success(`تم تحديث أرباحك: ${data.totalEarned} ريال`);
      });
    }
    socket.on('walletUpdated', ({ balance, transaction }) => {
        showNotification('تحديث المحفظة', {
          body: `تم تحديث رصيد محفظتك: ${balance} ريال`,
        });
        toast.success(`تم تحديث رصيد محفظتك: ${balance} ريال`);
      });

    socket.on('orderUpdated', (order) => {
      toast.info('تحديث الطلب', {
        description: `تم تحديث حالة الطلب ${order.id} إلى ${order.status}`
      });
    });

    socket.on('orderCompleted', (order) => {
      showNotification('اكتمال الطلب', {
        body: `تم اكتمال طلبك رقم: ${order.id}. يرجى تقييم الخدمة`,
      });
      toast.success('اكتمال الطلب', {
        description: `تم اكتمال طلبك رقم: ${order.id}. يرجى تقييم الخدمة`
      });
    });

    // المواقع
    socket.on('newLocation', (location) => {
      toast.success('تم إضافة موقع جديد بنجاح');
    });

    socket.on('defaultLocationChanged', (location) => {
      toast.info('تم تغيير الموقع الافتراضي');
    });

    // الحساب
    socket.on('passwordChanged', () => {
      toast.success('تم تغيير كلمة المرور بنجاح');
    });

    socket.on('verificationCodeResent', () => {
      toast.info('تم إرسال رمز التحقق الجديد');
    });

    socket.on('accountVerified', () => {
      toast.success('تم التحقق من حسابك بنجاح');
    });
    if (userType === 'store') {
        socket.on('newOrder', (data) => {
          if (data.store?.some((store: any) => store.id === userId)) {
            showNotification('طلب جديد', {
              body: `لديك طلب جديد برقم: ${data.order.id}`,
            });
            toast.info('لديك طلب جديد');
          }
        });
    }

    return () => {
      socket.off('walletUpdated');
      socket.off('newReward');
      socket.off('rewardRedeemed');
      socket.off('rewardDeleted');
      socket.off('orderCreated');
      socket.off('orderUpdated');
      socket.off('orderCompleted');
      socket.off('newLocation');
      socket.off('defaultLocationChanged');
      socket.off('passwordChanged');
      socket.off('verificationCodeResent');
      socket.off('accountVerified');
      socket.off('orderUpdated');
      socket.off('newNotification');
      if (userType === 'user') {
        socket.off('walletUpdated');
        socket.off('newReward');
      }
      if (userType === 'worker') {
        socket.off('newOrder');
        socket.off('earningsUpdated');
      }
      if (userType === 'store') {
        socket.off('newOrder');
      }
    };
  }, [socket, userId, userType, showNotification]);

  return null;
}; 