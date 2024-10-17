import axios from "axios";

// baseURL: `https://allurespa.io.vn/`

const AxiosInstance = (contentType = 'application/json') => {
    
    const axiosInstance = axios.create({
        baseURL: `https://allure-spa-1139e6106faa.herokuapp.com/api/`
    });



    axiosInstance.interceptors.request.use(
        async (config) => {
            const token = '';
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': contentType
            }
            return config;
        },
        err => Promise.reject(err)
    );

    axiosInstance.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err)
    );
    return axiosInstance;
};

export default AxiosInstance;