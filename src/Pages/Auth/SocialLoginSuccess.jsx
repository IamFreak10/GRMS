import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import UseAuth from '../../Hooks/UseAuth';
import Swal from 'sweetalert2';

const SocialLoginSuccess = () => {
  const { saveSocialLogin } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // SocialLoginSuccess.jsx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userJson = params.get('user');

    if (token && userJson) {
      try {
        // ডেটা ডিকোড করে অবজেক্ট বানানো
        const userData = JSON.parse(decodeURIComponent(userJson));

        // AuthContext এর ফাংশন কল করা
        saveSocialLogin(token, userData);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          timer: 1500,
          showConfirmButton: false,
        });

        navigate('/');
      } catch (error) {
        console.error('Error parsing user data', error);
        navigate('/login');
      }
    }
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default SocialLoginSuccess;
