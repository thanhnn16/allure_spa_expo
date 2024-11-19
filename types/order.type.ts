import { Product } from "./product.type";
import { ServiceResponeModel } from "./service.type";

export interface OrderItem {
    id: number;
    order_id: number;
    item_type: string;
    item_id: number;
    service_type: string;
    quantity: number;
    price: number;
    discount_amount: string;
    discount_type: string | null;
    created_at: string;
    updated_at: string;
    item_name: string;
    product?: Product;
    service?: ServiceResponeModel;
}

export interface Orders {
    id: number;
    user_id: string;
    total_amount: string;
    shipping_address_id: number | null;
    payment_method_id: number;
    voucher_id: number | null;
    discount_amount: string;
    status: string;
    note: string;
    created_at: string;
    updated_at: string;
    order_items: OrderItem[];
    invoice: any | null;
}

export interface OrderResponse {
    message: string;
    status_code: number;
    success: boolean;
    data: {
        current_page: number;
        data: Orders[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}
