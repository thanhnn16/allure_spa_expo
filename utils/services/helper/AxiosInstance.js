import axios from "axios";

const AxiosInstance = (contentType = 'application/json') => {
    const axiosInstance = axios.create({
        baseURL: `https://allurespa.io.vn/api/`
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            const token = ''; // Add logic to retrieve token if needed
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': contentType
            };
            return config;
        },
        err => Promise.reject(err)
    );

    axiosInstance.interceptors.response.use(
        res => res,
        err => {
            if (err.response) {
                // Return error data from response
                return Promise.reject({
                    status: err.response.status,
                    data: err.response.data
                });
            } else if (err.request) {
                // Request was made but no response received
                return Promise.reject({
                    status: 'REQUEST_ERROR',
                    data: err.request
                });
            } else {
                // Error setting up the request
                return Promise.reject({
                    status: 'ERROR',
                    data: err.message
                });
            }
        }
    );

    return axiosInstance;
};

export default AxiosInstance;