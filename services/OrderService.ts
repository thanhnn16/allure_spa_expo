import { Order, OrderItem } from '@/types';
import AxiosInstance from '@/utils/services/helper/axiosInstance';
import Constants from 'expo-constants';


interface CreateOrderData {
    user_id: string;
    payment_method_id: number;
    total_amount: number;
    discount_amount: number;
    voucher_id?: number | null;
    order_items: OrderItem[];
}

interface PaymentLinkData {
    invoice_id: string;
    returnUrl: string;
    cancelUrl: string;
}

interface PaymentResponse {
    success: boolean;
    checkoutUrl?: string;
    message?: string;
}

class OrderService {
    async createOrder(orderData: CreateOrderData): Promise<{
        id: string;
        order: Order;
        status: string;
    }> {
        try {
            const response = await AxiosInstance().post('/invoices', orderData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Không thể tạo đơn hàng");
        }
    }

    async createPaymentLink(data: PaymentLinkData): Promise<PaymentResponse> {
        try {
            const response = await AxiosInstance().post(`/invoices/${data.invoice_id}/pay-with-payos`, {
                returnUrl: data.returnUrl,
                cancelUrl: data.cancelUrl,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Không thể tạo link thanh toán");
        }
    }

    async verifyPayment(orderCode: string) {
        try {
            const response = await AxiosInstance().post("/payos/verify", { orderCode });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Không thể xác thực thanh toán");
        }
    }
}

export default new OrderService(); 