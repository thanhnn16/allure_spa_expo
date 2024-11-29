import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from '@/utils/services/helper/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from '@/types/address.type';

// Async thunks
export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_: any, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            const response = await AxiosInstance().get('/user/my-addresses', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

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
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            const response = await AxiosInstance().post('/user/addresses', addressData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

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
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            const response = await AxiosInstance().put(`/user/addresses/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật địa chỉ');
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (id: string, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            await AxiosInstance().delete(`/user/addresses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể xóa địa chỉ');
        }
    }
);