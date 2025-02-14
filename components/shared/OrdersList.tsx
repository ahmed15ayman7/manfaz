import { useState } from "react";
import { Tabs, Tab, Card, Typography, Badge } from "@mui/material";
import { motion } from "framer-motion";
import OrderCard from "../cards/OrderCard";
import TabsComponent from '../ui/TabsComponent';

const orders = [
  {
    id: "#F025E15",
    seller: "Shaidul Islam",
    date: "24 Jun 2023",
    title: "Mobile UI UX design or app design",
    messages: 3,
    notifications: 12,
    status: "All",
  },
  {
    id: "#A982K44",
    seller: "John Doe",
    date: "12 Feb 2024",
    title: "Website development project",
    messages: 5,
    notifications: 8,
    status: "Completed",
  },
  {
    id: "#C893K10",
    seller: "Emily Smith",
    date: "01 Jan 2024",
    title: "Brand identity design",
    messages: 2,
    notifications: 6,
    status: "Canceled",
  },
];
let PreviousOrders = orders.filter((order) => order.status === "Previous");
let CompletedOrders = orders.filter((order) => order.status === "Completed");
let CanceledOrders = orders.filter((order) => order.status === "Canceled");
let NoOrder = (
  <div className="flex flex-col items-center justify-center p-4">
    <Typography variant="h6" className="font-semibold mt-6">
      No orders yet
    </Typography>
  </div>
);
const tabs = [
  { title: "All", content: orders.map((order) => <OrderCard key={order.id} order={order} />) },
  { title: "Previous", content:PreviousOrders.length > 0 ? PreviousOrders.map((order) => <OrderCard key={order.id} order={order} />) : NoOrder },
  { title: "Completed", content: CompletedOrders.map((order) => <OrderCard key={order.id} order={order} />) },
  { title: "Canceled", content: CanceledOrders.map((order) => <OrderCard key={order.id} order={order} />) },
];

const OrdersList = () => {
  const [selectedTab, setSelectedTab] = useState("All");

  return (
    <div className="w-full   p-4">
      {/* Tabs Section */}
      <TabsComponent
      items={tabs}
      />
    </div>
  );
};

export default OrdersList;
