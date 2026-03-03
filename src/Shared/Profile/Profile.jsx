import React, { useState } from 'react';
import {
  UserCog,
  Camera,
  Save,
  ArrowLeft,
  Phone,
  Calendar,
  UserCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../Hooks/UseAxiosSecure';
import UseAuth from '../../Hooks/UseAuth';
import Swal from 'sweetalert2';

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user, saveSocialLogin } = UseAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    age: user?.age || '',
    phone: user?.phone || '',
    photo_url: user?.photo_url || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.patch('/users/update-me', formData);
      if (res.data.success) {
        const token = localStorage.getItem('token');
        saveSocialLogin(token, res.data.data);

        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your information has been successfully updated.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while saving your profile.',
      });
    }
  };

  const inputStyle =
    'w-full h-14 px-6 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-sm transition-all';

  return (
    <div className="min-h-screen p-4 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-8 hover:text-primary transition-all"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 border border-white overflow-hidden">
          {/* Form Header */}
          <div className="bg-neutral p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center justify-center gap-3 relative z-10">
              <UserCog size={32} className="text-primary" /> Edit{' '}
              <span className="text-primary">Profile.</span>
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 relative z-10">
              Manage your account identity
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 lg:p-16 space-y-8">
            {/* Avatar URL Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">
                Profile Photo URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste your image URL"
                  value={formData.photo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, photo_url: e.target.value })
                  }
                  className={inputStyle}
                />
                <Camera
                  className="absolute right-5 top-4 text-gray-300"
                  size={20}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputStyle}
                    required
                  />
                  <UserCircle2
                    className="absolute right-5 top-4 text-gray-300"
                    size={20}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={inputStyle}
                  />
                  <Phone
                    className="absolute right-5 top-4 text-gray-300"
                    size={20}
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">
                  Age
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className={inputStyle}
                  />
                  <Calendar
                    className="absolute right-5 top-4 text-gray-300"
                    size={20}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className={`${inputStyle} appearance-none cursor-pointer`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-neutral hover:shadow-none transition-all duration-300 active:scale-95"
            >
              <Save size={20} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
