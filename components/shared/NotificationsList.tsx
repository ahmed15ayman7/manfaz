"use client";
import NotificationCard from "@/components/cards/NotificationCard";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { useUser } from "@/hooks/useUser";
import { Notification } from "@/interfaces";
import API_ENDPOINTS from "@/lib/apis";
import axiosInstance from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { BellOff } from "lucide-react";
import { motion } from "framer-motion";
import  useRefetchStore  from "@/store/useRefetchStore";
import { useNotifications } from "@/hooks/useNotifications";
const NotificationsList = ({isWorker}: {isWorker?: boolean}) => {
  const locale = useLocale();
  const { user, status } = useUser();
  const refetchStore = useRefetchStore();
  let {removeNotification} = useNotifications();
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["notifications", user?.id, locale],
    enabled: !!user?.id,
    initialPageParam:1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(
        API_ENDPOINTS.notifications.getAll(
         isWorker ? "worker" : "user",
          user?.id || "",
          { lang: locale, page: pageParam, limit: 10 },
          false
        )
      );
      return res.data.data;
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage?.notifications?.length < 10 ? undefined : pages.length + 1,
  });

  useEffect(() => {
    refetch();
  }, [user, status, refetchStore.refetch]);

  const handleDelete = async (id: string) => {
    let toastId = toast.loading("Deleting...");
    try {
      const res = await axiosInstance.delete(
        API_ENDPOINTS.notifications.delete(id, { lang: locale }, false)
      );
      if (res.data.status) {
        toast.update(toastId, {
          render: res.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        refetch();
        removeNotification(id);
      } else {
        toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to delete!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
 const handleRead = async (id: string) => {
    let toastId = toast.loading("Reading...");
    try {
      const res = await axiosInstance.patch(
        API_ENDPOINTS.notifications.markAsRead(id, { lang: locale }, false)
      );
      if (res.data.status) {
        toast.update(toastId, {
          render: res.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        refetch();
        removeNotification(id);
      } else {
        toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to read!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px", // Smooth loading before reaching the bottom
        threshold: 1.0,
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <SkeletonLoader count={4} type="details" />;

  return (
    <div className="w-full flex flex-col gap-4 p-4">
        {data?.pages.length === 0 || data?.pages.every(page => page.notifications.length === 0) ? (
      <NoNotifications />
    ) : (
      <>
        {data?.pages.map((page) =>
        page.notifications?.map((notification: Notification) => (
          <NotificationCard
            key={notification.id}
            image={
              notification.sender?.imageUrl ||
              "https://randomuser.me/api/portraits/men/1.jpg"
            }
            isRead={notification.isRead}
            title={`${notification.title} - ${notification.sender?.name} (${notification?.order?.service?.name})`}
            description={notification.message}
            highlightedText="Telegram"
            timeAgo={formatDate(notification.createdAt, locale)}
            onDelete={() => handleDelete(notification.id)}
            onRead={() => handleRead(notification.id)}
          />
        ))
      )}

      {isFetchingNextPage && <SkeletonLoader count={2} type="details" />}

      {/* Sentinel div */}
      <div ref={sentinelRef} className="h-1" />
      </>
    )}
    </div>
  );
};





const NoNotifications = () => {
    const t = useTranslations("Notifications");
    
    return (
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 text-center"
        >
      <BellOff className="w-16 h-16  text-gray-600 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700  mb-2">
        {t("noNotifications")}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        {t("noNotificationsDescription")}
      </p>
    </motion.div>
  );
};


export default NotificationsList;