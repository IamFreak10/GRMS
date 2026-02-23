import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxios from '../../Hooks/UseAxios';

const Register = () => {
  const axiosInstance = useAxios();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'male',
    age: '',
    phone: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // API Config

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photo_url = '';

      // ১. ইমেজ আপলোড লজিক
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('images', selectedFile);

        // Axios এ সরাসরি রিকোয়েস্ট পাঠান
        const uploadRes = await axiosInstance.post('/upload', uploadData);

        // Axios এ ডাটা সরাসরি uploadRes.data এর ভেতর থাকে
        if (uploadRes.data.success) {
          photo_url = uploadRes.data.urls?.[0] || '';
          console.log('Image URL received:', photo_url);
        } else {
          throw new Error(uploadRes.data.message || 'Upload failed');
        }
      }

      // ২. ইউজার ক্রিয়েশন লজিক
      const userRes = await axiosInstance.post('/users', {
        ...formData,
        age: Number(formData.age), // বয়স নাম্বার হিসেবে পাঠানো জরুরি
        photo_url,
      });

      // Axios এ স্ট্যাটাস চেক করা হয় status দিয়ে
      if (userRes.status === 200 || userRes.status === 201) {
        Swal.fire('Success', 'User created!', 'success');
        
        // ফর্ম ক্লিয়ার
        setFormData({ name: '', email: '', password: '', gender: 'male', age: '', phone: '' });
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      // Axios এর এরর মেসেজ ধরার সঠিক উপায়
      const errorMessage = err.response?.data?.message || err.message;
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-primary p-8 text-center text-white">
          <h2 className="text-3xl font-extrabold uppercase tracking-widest">
            Join Us
          </h2>
          <p className="opacity-90 mt-2">Create your profile</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-primary overflow-hidden flex items-center justify-center shadow-inner">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </label>
            </div>
            <p className="text-xs text-gray-400 font-bold">Profile Picture</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            />

            <div className="flex gap-3">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 ${loading ? 'bg-gray-400' : 'bg-primary hover:opacity-90'}`}
          >
            {loading ? 'Processing...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
