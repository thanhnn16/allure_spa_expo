import AxiosInstance from '@/utils/services/helper/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from '@/types/address.type';

export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_: any, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            const response = await AxiosInstance().get('/user/my-addresses');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải địa chỉ');
        }
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (addressData: Omit<Address, 'id'>, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            const response = await AxiosInstance().post('/user/addresses', addressData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể thêm địa chỉ');
        }
    }
);

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async ({ id, data }: { id: string; data: Partial<Address> }, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            const response = await AxiosInstance().put(`/user/addresses/${id}`, data);
            return response.data.data;
        } catch (error: any) {
            console.log("error", error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật địa chỉ');
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (id: string, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            await AxiosInstance().delete(`/user/addresses/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể xóa địa chỉ');
        }
    }
);