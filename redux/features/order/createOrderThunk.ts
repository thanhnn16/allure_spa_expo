import { CheckoutData, CheckoutItem } from "@/types/checkout.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (checkoutData: CheckoutData, { rejectWithValue }: any) => {
        try {
            const formattedItems = checkoutData.items.map((item: CheckoutItem) => {
                const baseItem = {
                    item_id: item.item_id,
                    item_type: item.item_type,
                    quantity: item.quantity,
                    price: item.price,
                };

                // Handle service specific fields
                if (item.item_type === 'service' && item.service_type) {
                    return {
                        ...baseItem,
                        service_type: item.service_type,
                        service: {
                            id: item.item_id,
                            service_name: item.service?.service_name,
                            media: item.service?.media || [],
                            price: item.price
                        }
                    };
                }

                // Handle product fields
                return {
                    ...baseItem,
                    product: {
                        id: item.item_id,
                        name: item.product?.name,
                        media: item.product?.media || [],
                        price: item.price
                    }
                };
            });

            const response = await AxiosInstance().post('/orders', {
                ...checkoutData,
                items: formattedItems
            });

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to create order');
        }
    }
);