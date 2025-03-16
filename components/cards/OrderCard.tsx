import { Order } from "@/interfaces";
import { Card, Typography, Badge, Skeleton, Avatar, AvatarGroup, Chip, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface OrderCardProps {
  order?: Order;
  loading?: boolean;
}

let orderStatusColors = {
  "pending": "warning",
  "in_progress": "info",
  "completed": "success",
  "canceled": "error",
}

const OrderCard = ({ order, loading }: OrderCardProps) => {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const handleClick = () => {
    if (order) {
      router.push(`/orders/${order.id}`);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-4 mb-4 shadow-md">
          <div className="flex justify-between items-center">
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="circular" width={60} height={24} />
          </div>

          <div className="mt-2">
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </div>

          <div className="flex justify-between items-center mt-4">
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={100} height={20} />
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="p-6 mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Typography variant="h6" className="font-bold text-primary">
              #{order.id.slice(0, 8)}
            </Typography>
            <Chip 
              label={t(`status.${order.status}`)} 
              color={orderStatusColors[order.status as keyof typeof orderStatusColors] as "warning" | "default" | "primary" | "secondary" | "error" | "info" | "success"}
              size="small"
            />
          </div>
          <div className="flex items-center gap-2">
            {order.service && (
              <div className="flex items-center">
                {order.provider && (
                  <Avatar 
                    src={order.provider.user?.imageUrl} 
                    alt={order.provider.user?.name}
                    className="border-2 border-white"
                  />
                )}
                <Typography variant="body2" className="mr-2">
                  {order.service.name}
                </Typography>
              </div>
            )}
            {order.store && order.store.length > 0 && (
              <AvatarGroup max={3} className="ml-2">
                {order.store.map((orderStore, index) => (
                  <Avatar 
                    key={index}
                    src={orderStore.store.logo} 
                    alt={orderStore.store.name}
                    className={`border-2 border-white ${index === 0 ? 'ml-0' : '-ml-2'}`}
                  />
                ))}
              </AvatarGroup>
            )}
          </div>
        </div>

        <Divider className="my-4" />

        <div className="mt-4">
          <Typography variant="body1" className="mb-2 text-gray-800">
            {order.description || t('order_details.no_description')}
          </Typography>
          
          {order.location && (
            <div className="flex items-center gap-2 mt-2">
              <Typography variant="body2" color="textSecondary" className="flex items-center">
                <span className="material-icons text-sm ml-1">location_on</span>
                {order.location.address}
              </Typography>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <Typography variant="h6" color="primary" className="font-bold">
            {order.totalAmount} {t('order_details.price')}
          </Typography>
          <div className="flex flex-col items-end">
            <Typography variant="caption" color="textSecondary">
              {t('order_details.order_date')}
            </Typography>
            <Typography variant="body2" className="font-medium">
              {new Date(order.createdAt|| '').toLocaleDateString('ar-SA')}
            </Typography>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default OrderCard;