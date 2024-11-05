export interface OrderItem {
  item_type: 'product' | 'service';
  item_id: number;
  service_type?: 'single' | 'combo_5' | 'combo_10';
  quantity: number;
  price: number;
  discount_amount?: number;
  discount_type?: 'percentage' | 'fixed_amount';
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

export interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  shipping_address_id?: number;
  payment_method_id: number;
  voucher_id?: number;
  discount_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface DialogConfig {
  visible: boolean;
  title: string;
  description: string;
  severity: 'success' | 'error' | 'info' | 'warning';
} 