import { Order } from "@/interfaces";
import { Card, Typography, Badge, Skeleton } from "@mui/material";

interface OrderCardProps {
  order?: Order;
  loading?: boolean;
}

const OrderCard = ({ order, loading }: OrderCardProps) => {
  if (loading) {
    return (
      <Card className="p-4 mb-4">
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
    );
  }

  if (!order) return null;

  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-center">
        <Typography variant="subtitle1" className="font-bold">
          {order.id}
        </Typography>
        <Badge color="primary" badgeContent={order.status}>
          <span></span>
        </Badge>
      </div>

      <Typography variant="body1" className="mt-2">
        {order.description || 'لا يوجد وصف'}
      </Typography>

      <div className="flex justify-between items-center mt-4">
        <Typography variant="body2" color="textSecondary">
          السعر: {order.totalAmount} ريال
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
        </Typography>
      </div>
    </Card>
  );
};

export default OrderCard;