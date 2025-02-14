import { Card, Typography } from "@mui/material";
import ServicesCard from "../cards/ServicesCard";

const services = [
  { name: "Plumbing", category: "Plumbing Services", price: "$20.00 - $50.00" },
  { name: "Grocery", category: "Supermarket Delivery", price: "$20.00 - $50.00" },
];

const PopularServices = () => {
  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold">Popular Services</h2>
      <div className="flex overflow-x-auto space-x-4 mt-2">
        {services.map((service, index) => (
         <ServicesCard key={index} service={service}  />
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
