import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import Swal from 'sweetalert2';
import UseAuth from '../../Hooks/UseAuth';

const Login = () => {
  const { signIn, setLoading, loading } = UseAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // ইউজার যে পেজ থেকে এসেছে সেখানে ফেরত পাঠানোর জন্য (যেমন: Private Route)
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    setLoading(true);

    Swal.fire({
      title: 'Authenticating...',
      didOpen: () => Swal.showLoading(),
    });

    try {
      const loggedUser = await signIn(email, password);

      if (loggedUser) {
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: `Logged in as ${loggedUser.name}`,
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid email or password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4 font-sans text-neutral">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-primary p-10 text-center text-white">
          <h2 className="text-4xl font-extrabold uppercase tracking-widest">
            Login
          </h2>
          <p className="opacity-90 mt-2">Welcome back to the community</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                required
                className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:opacity-95'
            }`}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
          <div className="mt-4">
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  'https://grmsapi.vercel.app/auth/google')
              }
              className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
                className="w-6 h-6"
              />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline"
            >
              Create one now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
