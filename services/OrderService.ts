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
    async createInvoice(data: any) {
        const response = await AxiosInstance().post("/invoices", data);
        console.log("OrderService createInvoice", response.data);
        return response.data;
    }

    async createPaymentLink(data: { invoice_id: string; returnUrl: string; cancelUrl: string }): Promise<PaymentLinkResponse> {
        try {
            const response = await AxiosInstance().post(`/invoices/${data.invoice_id}/payos`, {
                returnUrl: data.returnUrl,
                cancelUrl: data.cancelUrl,
            });

            console.log("OrderService createPaymentLink response:", response.data);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Không thể tạo link thanh toán');
            }

            return response.data;
        } catch (error: any) {
            console.error("OrderService createPaymentLink error:", error);
            throw new Error(error.response?.data?.message || 'Không thể tạo link thanh toán');
        }
    }

    async verifyPayment(orderCode: string) {
        try {
            const response = await AxiosInstance().post("/payos/verify", {
                orderCode,
            });
            console.log("OrderService verifyPayment", response.data);
            return response.data;
        } catch (error: any) {
            console.log("OrderService verifyPayment", error.response?.data);
            throw new Error(error.response?.data?.message || "Không thể xác thực thanh toán");
        }
    }
}

export default new OrderService();
