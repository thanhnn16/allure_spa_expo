import AxiosInstance from "@/utils/services/helper/axiosInstance";

interface PaymentLinkResponse {
    success: boolean;
    data?: {
        checkoutUrl: string;
        qrCode?: string;
        orderCode: string;
        invoice_id: string;
        amount: number;
        payment_method: string;
    };
    message?: string;
    error_details?: any;
}

class OrderService {
    async createOrder(data: any): Promise<any> {
        const response = await AxiosInstance().post("/orders", data);
        return response.data;
    }

    async processPayment(orderId: string, paymentData: { 
        returnUrl: string; 
        cancelUrl: string; 
    }): Promise<PaymentLinkResponse> {
        try {
            const response = await AxiosInstance().post(`/orders/${orderId}/payment`, paymentData);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Không thể tạo link thanh toán');
            }

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Không thể tạo link thanh toán');
        }
    }
}

export default new OrderService();
