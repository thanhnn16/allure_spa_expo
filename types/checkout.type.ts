import { Media } from "./media.type";

export interface CheckoutItem {
    item_id: number;
    item_type: 'product' | 'service';
    quantity: number;
    price: number;
    service_type?: 'single' | 'combo_5' | 'combo_10';
    product?: {
        id: number;
        name: string;
        media: Media[];
        price: number;
    };
    service?: {
        id: number;
        service_name: string;
        media: Media[];
        price: number;
        service_type?: 'single' | 'combo_5' | 'combo_10';
    };
}

export interface CheckoutData {
    items: CheckoutItem[];
    payment_method_id: number;
    shipping_address_id?: number;
    voucher_id?: number;
    note?: string;
} 