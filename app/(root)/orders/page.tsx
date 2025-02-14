"use client";
import { Typography } from "@mui/material";
import Image from "next/image";
import OrdersList from "@/components/shared/OrdersList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Typography variant="h5" className="font-semibold mt-6">
        Requests
      </Typography>
      <OrdersList />
    </div>
  );
}
