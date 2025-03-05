import axios from "axios";
import { apiUrl } from "@/constant";
import { Order, OrderStatus, PaymentStatus } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";

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
    paymentStatus: PaymentStatus
): Promise<OrdersResponse> => {
    try {
        const response = await axios.get(
            `${apiUrl}/orders?userId=${userId}&role=${role}&limit=${limit}&page=${page}&search=${search}&status=${status}&paymentStatus=${paymentStatus}`
        );
        return response.data;
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
    paymentStatus: PaymentStatus
) => {
    return useQuery<OrdersResponse, Error>({
        queryKey: ['orders', userId, role, limit, page, search, status, paymentStatus],
        queryFn: () => getOrders(userId, role, limit, page, search, status, paymentStatus),
    });
};