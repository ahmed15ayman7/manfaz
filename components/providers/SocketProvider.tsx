'use client';

import { useEffect } from 'react';
import { useSocket } from '@/lib/socket';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'react-toastify';
import useStore  from '@/store/useLanguageStore';
import  useRefetchStore  from "@/store/useRefetchStore";
import CustomToast from '../cards/CustomToast';
import { Notification,NotificationType } from '@/interfaces';
import { useRouter } from 'next/navigation';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session } = useSession();
  const { socket, connect, disconnect } = useSocket();
  const { locale } = useStore();
  const refetchStore = useRefetchStore();
  const { showNotification,permission } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    if ( session?.user?.id && !socket) {
      // تحديد نوع المستخدم من الجلسة
      const userType = session.user.role as 'user' | 'worker' | 'store' | 'admin';
      connect(session.user.token||"", session.user.id, userType);
    }

    if (!session?.user?.id && socket) {
      disconnect();
    }
  }, [session, socket, connect, disconnect]);

  useEffect(() => {

    if (!socket) return;
    console.log('socket', socket);
    // الاستماع للأحداث العامة
    socket.on('error', (error) => {
      toast.error(error.message);
    });
    const handleNewNotification = (notification: Notification) => {
      console.log('notification', notification);
      if (notification.relatedId === session?.user.id) {
        showNotification(notification,permission);
        toast.info( <CustomToast image={notification.sender?.imageUrl||"https://res.cloudinary.com/dixa9yvlz/image/upload/v1741264530/Manfaz/default-profile.jpg"} name={notification.sender?.name||""} title={notification.title} message={notification.message} />, {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClick: () => notification.type === NotificationType.worker && notification.orderId ? router.push(`/worker/orders/${notification.orderId}`):notification.type === NotificationType.user && notification.orderId ? router.push(`/orders/${notification.orderId}`):null,
          rtl: locale === "ar" || locale === "ur",
        });
        refetchStore.setRefetch(refetchStore.refetch + 1);
      }
    };
    if (socket) {
      socket.onAny((event, ...args) => {
        console.log('📥 Event received:', event, args);
        if(event==="newNotification"){
          console.log('data', args[0]);
      console.log('userId', session?.user?.id,args[0].relatedId);
       handleNewNotification(args[0])
        }
      });
    }
    // socket.on("newNotification", (data) =>{
    //   console.log('data', data);
    //   console.log('userId', session?.user?.id,data.relatedId);
    //    handleNewNotification(data)});
    // المحفظة
    socket.on('walletUpdated', ({ balance, transaction }) => {
      toast.success(`تم تحديث رصيد محفظتك: ${balance}`);
    });

    // المكافآت
    // socket.on('newReward', (reward) => {
    //   showNotification('مكافأة جديدة!', {
    //     body: `لقد حصلت على مكافأة جديدة: ${reward.title}`,
    //   },
    //     permission
    // );
    // });

    // الطلبات
    // socket.on('orderCreated', (order) => {
    //   showNotification('طلب جديد', {
    //     body: `تم إنشاء طلب جديد برقم: ${order.id}`,
    //   },
    //     permission
    // );
    // });

    // socket.on('orderUpdated', (order) => {
    //   toast.info(`تم تحديث حالة الطلب ${order.id} إلى ${order.status}`);
    //   showNotification('طلب تحديث', {
    //     body: `تم تحديث حالة الطلب ${order.id} إلى ${order.status}`,
    //   },
    //   permission
    // );
    // });

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