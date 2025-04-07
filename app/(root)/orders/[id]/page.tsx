"use client"
import { Order } from "@/interfaces";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Card,
  Typography,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Skeleton,
  Avatar,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from '@/lib/axios';
import API_ENDPOINTS from "@/lib/apis";
import { useLocale } from "next-intl";
import { formatDate } from "@/lib/utils";

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("orders");
  const [cancelDialog, setCancelDialog] = useState(false);
  const router = useRouter();
  let locale = useLocale();

  // استخدام useQuery لجلب بيانات الطلب
  const { data: order, isLoading: loadingOrder, refetch } = useQuery<Order>({
    queryKey: ["order", params.id],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.orders.getById(params.id, { lang: locale }, false));
      return response.data.data;
    },
  });
  useEffect(() => {
    refetch();
  }, [locale]);
  // استخدام useMutation لإلغاء الطلب
  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      await axios.put(API_ENDPOINTS.orders.getById(params.id, { lang: locale }, false), {
        status: "canceled",
      });
    },
    onSuccess: () => {
      setCancelDialog(false);
      router.push("/orders");
    },
  });

  const handleCancelOrder = () => {
    cancelOrder();
  };

  // Generate timeline items based on order status
  const getTimelineItems = () => {
    const items = [
      {
        status: "order_placed",
        date: order?.createdAt,
        completed: true,
      },
      {
        status: "order_confirmed",
        date: order?.updatedAt,
        completed: order?.status !== "pending",
      },
      {
        status: "order_processing",
        date: order?.updatedAt,
        completed: order?.status === "in_progress" || order?.status === "completed",
      },
      {
        status: "order_delivered",
        date: order?.updatedAt,
        completed: order?.status === "completed",
      },
    ];

    if (order?.status === "canceled") {
      items.push({
        status: "order_cancelled",
        date: order.updatedAt,
        completed: true,
      });
    }

    return items;
  };

  if (loadingOrder) {
    return (
      <div className="w-full mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="text" width={150} height={24} />
              </div>
              <Skeleton variant="rectangular" width={120} height={36} />
            </div>
            <Divider className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
              <div>
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="rectangular" width="100%" height={100} />
              </div>
            </div>
            <Divider className="my-6" />
            <div className="flex justify-between items-center">
              <Skeleton variant="text" width={100} height={32} />
              <Skeleton variant="rectangular" width={120} height={36} />
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <Typography variant="h4" className="font-bold mb-2">
                {t("order_details.order_number")} #{params.id.slice(0, 8)}
              </Typography>
              <Chip
                label={t(`status.${order?.status}`)}
                color={
                  (order?.status === "pending" && "warning") ||
                  (order?.status === "in_progress" && "info") ||
                  (order?.status === "completed" && "success") ||
                  "error"
                }
              />
            </div>
            {order?.status === "pending" && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setCancelDialog(true)}
              >
                {t("order_details.cancel_order")}
              </Button>
            )}
          </div>

          <Divider className="my-6" />

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {order?.service && <Typography variant="h6" className="mb-4">
                {t("order_details.service_provider")}
              </Typography>}
              {order?.service ? (
                <div className="flex items-center gap-4">
                  <Avatar
                    src={order.provider?.user?.imageUrl}
                    alt={order.provider?.user?.name}
                    sx={{ width: 64, height: 64 }}
                  />
                  <div>
                    <Typography variant="subtitle1" className="font-bold">
                      {order.provider?.user?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.service.name}
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {order?.store?.map((orderStore) => (
                    <Card key={orderStore?.store?.id} className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={orderStore?.store?.logo}
                          alt={orderStore?.store?.name}
                        />
                        <Typography variant="subtitle2">
                          {orderStore?.store?.name}
                        </Typography>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Typography variant="h6" className="mb-4">
                {t("order_details.delivery_address")}
              </Typography>
              <Card className="p-4 bg-gray-50">
                <Typography variant="body1">
                  {order?.address}
                </Typography>
                {order?.notes && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mt-2"
                  >
                    {t("order_details.notes")}: {order.notes}
                  </Typography>
                )}
              </Card>
            </div>
          </div>

          <Divider className="my-6" />

          {/* Order Timeline */}
          <Typography variant="h6" className="mb-4">
            {t("order_details.order_status")}
          </Typography>
          <Timeline>
            {getTimelineItems().map((item, index) => (
              <TimelineItem key={item.status}>
                <TimelineSeparator>
                  <TimelineDot
                    color={item.completed ? "success" : "grey"}
                    variant={item.completed ? "filled" : "outlined"}
                  />
                  {index < getTimelineItems().length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="subtitle2">
                    {t(`order_details.${item.status}`)}
                  </Typography>
                  {item.date && (
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(item.date, locale)}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>

          <Divider className="my-6" />

          {/* Payment Details */}
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h6" className="mb-2">
                {t("order_details.total_amount")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("order_details.payment_method")}: {order?.paymentStatus}
              </Typography>
            </div>
            <Typography variant="h4" color="primary" className="font-bold">
              {order?.totalAmount} {t("order_details.price")}
            </Typography>
          </div>
        </Card>
      </motion.div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>{t("order_details.confirm_cancel")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("order_details.cancel_confirmation_message")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>
            {t("common.no")}
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
            disabled={isCancelling}
          >
            {isCancelling ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("common.yes")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetailsPage;