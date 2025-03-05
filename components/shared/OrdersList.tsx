import { useState } from "react";
import { Typography, TextField, Pagination, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import OrderCard from "../cards/OrderCard";
import TabsComponent from '../ui/TabsComponent';
import { useOrders } from "@/lib/actions/orders.actions";
import { Order, OrderStatus, PaymentStatus } from "@/interfaces";
import { useUser } from "@/hooks/useUser";
import { useTranslations } from "next-intl";

const OrdersList = () => {
  const [selectedTab, setSelectedTab] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { user } = useUser();
  const t = useTranslations("orders");

  const { data, isLoading, error } = useOrders(
    user?.id || '',
    user?.role || '',
    limit,
    page,
    '',
    selectedTab === "all" ? "" : selectedTab as OrderStatus,
    'pending' as PaymentStatus
  );

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(Number(event.target.value));
    setPage(1); // إعادة تعيين الصفحة إلى 1 عند تغيير عدد العناصر
  };

  if (error) {
    return <div>{t("error")}</div>;
  }

  const NoOrder = (
    <div className="flex flex-col items-center justify-center p-4">
      <Typography variant="h6" className="font-semibold mt-6">
        {t("no_orders")}
      </Typography>
    </div>
  );

  const handleTabChange = (newTab: string) => {
    setSelectedTab(newTab.toLowerCase() as OrderStatus);
    setPage(1); // إعادة تعيين الصفحة إلى 1 عند تغيير التبويب
  };

  let loading = [...Array(limit)].map((_, index) => (
    <OrderCard key={index} loading />
  ));

  const tabs = [
    {
      title: "All",
      key: "all",
      content: data?.orders?.length ? data.orders.map((order: Order) => (
        <OrderCard key={order.id} order={order} />
      )) : NoOrder,
      loading: loading
    },
    {
      title: "Pending",
      key: "pending",
      content: data?.orders?.length ?
        data.orders.map((order: Order) => (
          <OrderCard key={order.id} order={order} />
        )) : NoOrder,
      loading: loading
    },

    {
      title: "In Progress",
      key: "in_progress",
      content: data?.orders?.length ?
        data.orders.map((order: Order) => (
          <OrderCard key={order.id} order={order} />
        )) : NoOrder,
      loading: loading
    },
    {
      title: "Completed",
      key: "completed",
      content: data?.orders?.length ?
        data.orders.map((order: Order) => (
          <OrderCard key={order.id} order={order} />
        )) : NoOrder,
      loading: loading
    },
    {
      title: "Canceled",
      key: "canceled",
      content: data?.orders?.length ?
        data.orders.map((order: Order) => (
          <OrderCard key={order.id} order={order} />
        )) : NoOrder,
      loading: loading
    },
  ];

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-semibold mt-6">
          {t("title")}
        </Typography>
        <FormControl variant="outlined" size="small" style={{ width: 100 }}>
          <InputLabel>{t("per_page")}</InputLabel>
          <Select
            value={limit}
            onChange={(e) => handleLimitChange(e as any)}
            label={t("per_page")}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TabsComponent
        items={tabs}
        selectedTab={selectedTab}
        isLoading={isLoading}
        onTabChange={handleTabChange}
      />

      {!isLoading && data?.orders && data?.orders?.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={data?.totalPages || 0}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </div>
      )}
    </div>
  );
};

export default OrdersList;
