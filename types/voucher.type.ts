export interface Voucher {
    "id": number,
    "code": string,
    "description": string,
    "discount_type": string,
    "discount_value": number,
    "min_order_value": number,
    "max_discount_amount": number,
    "formatted_discount": string,
    "min_order_value_formatted": string,
    "max_discount_amount_formatted": string,
    "start_date": string,
    "end_date": string,
    "start_date_formatted": string,
    "end_date_formatted": string,
    "is_active": boolean,
    "remaining_uses": number,
    "total_uses": number
}

export interface VoucherResponseParams {
    message: string;
    success: boolean;
    data: Voucher;
}