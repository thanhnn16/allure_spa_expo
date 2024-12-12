import axios, { AxiosInstance as AxiosInstanceType, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosInstance = (contentType: string = 'application/json'): AxiosInstanceType => {
    const axiosInstance = axios.create({
        baseURL: 'https://allurespa.io.vn/api',
        headers: {
            'Content-Type': contentType,
            'Accept': 'application/json'
        }
    });

    axiosInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const token = await AsyncStorage.getItem('userToken');
            if (config.headers) {
                config.headers.set('Authorization', token ? `Bearer ${token}` : '');
                config.headers.set('Accept', 'application/json');
                config.headers.set('Content-Type', contentType);
            }
            return config;
        },
        (err: AxiosError) => Promise.reject(err)
    );
    axiosInstance.interceptors.response.use(
        (res: AxiosResponse) => res,
        (err: AxiosError) => Promise.reject(err)
    );

    return axiosInstance;
};

export default AxiosInstance;