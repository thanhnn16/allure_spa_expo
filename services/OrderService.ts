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

interface CreateInvoiceResponse {
    success: boolean;
    data: {
        id: string;
        created_at: string;
        updated_at: string;
        user_id: string;
        order_id: number;
        total_amount: string;
        paid_amount: string;
        status: string;
        note: string | null;
        created_by_user_id: string;
        staff_user_id: string;
        order: {
            id: number;
            user_id: string;
            total_amount: string;
            discount_amount: string;
            status: string;
            payment_method_id: number;
            shipping_address_id: number | null;
            voucher_id: number | null;
            created_at: string;
            updated_at: string;
            items: any[];
        };
        user: {
            id: string;
            full_name: string;
            email: string | null;
            phone_number: string;
            gender: string;
            date_of_birth: string | null;
            avatar_url: string | null;
            note: string | null;
            loyalty_points: number;
            purchase_count: number;
            role: string;
            media_id: string | null;
            media: any | null;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
            skin_condition: string | null;
        };
    };
    message: string;
    status_code: number;
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
