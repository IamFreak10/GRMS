import axios from 'axios';
import { useNavigate } from 'react-router'; // Corrected import
import UseAuth from './UseAuth';

const axiosSecure = axios.create({
  baseURL: 'https://grmsapi.vercel.app',
});

const useAxiosSecure = () => {
  const { logOut } = UseAuth();
  const navigate = useNavigate();

  // 1. Request Interceptor (Adding the token)
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (token) {
        config.headers.authorization = `${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 2. Response Interceptor (Handling 401/403 errors)
  axiosSecure.interceptors.response.use(
    (response) => response, // If response is good, just return it
    async (error) => {
      const status = error.response ? error.response.status : null;

      if (status === 401 || status === 403) {
        // Token expired or invalid!
        await logOut();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
