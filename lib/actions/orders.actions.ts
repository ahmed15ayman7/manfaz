import axios from "axios";
import { BASE_URL } from '@/lib/config';
import { Order, OrderStatus, PaymentStatus } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../apis";
import axiosInstance from "../axios";

interface OrdersResponse {
    orders: Order[];
    totalPages: number;
    currentPage: number;
    totalOrders: number;
}

export const getOrders = async (
    userId: string,
    role: string,
    limit: number,
    page: number,
    search: string,
    status: OrderStatus | "",
    paymentStatus: PaymentStatus,
    date?: string
): Promise<OrdersResponse> => {
    try {
        const response = await axiosInstance.get(
            API_ENDPOINTS.orders.getAll({ userId, role, limit, page, search, status, paymentStatus, date }, false)
        );
        return response.data.data;
    } catch (error) {
        console.log(error);
        return {
            orders: [],
            totalPages: 0,
            currentPage: 1,
            totalOrders: 0
        };
    }
};

export const useOrders = (
    userId: string,
    role: string,
    limit: number = 10,
    page: number = 1,
    search: string = '',
    status: OrderStatus | "",
    paymentStatus: PaymentStatus,
    date?: string
) => {
    return useQuery<OrdersResponse, Error>({
        queryKey: ['orders', userId, role, limit, page, search, status, paymentStatus, date],
        queryFn: () => getOrders(userId, role, limit, page, search, status, paymentStatus, date),
    });
};

export const getOrder = async (orderId: string): Promise<Order> => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/${orderId}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return {} as Order;
    }
};
export const useOrder = (orderId: string) => {
    return useQuery<Order, Error>({
        queryKey: ['order', orderId],
        queryFn: () => getOrder(orderId),
    });
};

export const createOrder = async (order: Order, type: string): Promise<Order> => {
    let toastId = toast.loading("Creating order...");
    try {

        const response = await axiosInstance.post(API_ENDPOINTS.orders.create({}, false), { ...order, type });
        response.data.status ? toast.update(toastId, { render: response.data.message || "Order created successfully", type: "success", isLoading: false, autoClose: 2000 }) : toast.update(toastId, { render: response.data.message || "Something went wrong", type: "error", isLoading: false, autoClose: 2000 });
        return response.data;
    }
    catch (error: any) {
        toast.update(toastId, { render: error.message || "Something went wrong", type: "error", isLoading: false, autoClose: 2000 });
        console.log(error);
        return {} as Order;
    }
};

export const updateOrder = async (orderId: string, order: Order): Promise<Order> => {
    let toastId = toast.loading("Updating order...");
    try {
        const response = await axios.put(`${BASE_URL}/orders/${orderId}`, order);
        response.data ? toast.update(toastId, { render: response.data.message || "Order updated successfully", type: "success", isLoading: false, autoClose: 2000 }) : toast.update(toastId, { render: response.data.message || "Something went wrong", type: "error", isLoading: false, autoClose: 2000 });
        return response.data;
    }
    catch (error: any) {
        toast.update(toastId, { render: error.message || "Something went wrong", type: "error", isLoading: false, autoClose: 2000 });
        console.log(error);
        return {} as Order;
    }
}