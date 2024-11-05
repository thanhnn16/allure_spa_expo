import AxiosInstance from "@/utils/services/helper/axiosInstance";

class OrderService {
    async createInvoice(data: any) {
        const response = await AxiosInstance().post("/invoices", data);
        return response.data;
    }

    async createPaymentLink(data: any) {
        const response = await AxiosInstance().post(`/invoices/${data.invoice_id}/payos`, {
            returnUrl: data.returnUrl,
            cancelUrl: data.cancelUrl,
        });
        return response.data;
    }

    async verifyPayment(orderCode: string) {
        try {
            const response = await AxiosInstance().post("/payos/verify", {
                orderCode,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Không thể xác thực thanh toán");
        }
    }
}

export default new OrderService();
