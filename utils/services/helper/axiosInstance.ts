import axios, { AxiosInstance as AxiosInstanceType, AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosInstance = (contentType: string = 'application/json'): AxiosInstanceType => {
    const axiosInstance = axios.create({
        baseURL: `https://allurespa.io.vn/api/`
    });

    axiosInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const token = await AsyncStorage.getItem('userToken');
            console.log(token);
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
        res => res,
        err => Promise.reject(err)
    );

    return axiosInstance;
};

export default AxiosInstance;