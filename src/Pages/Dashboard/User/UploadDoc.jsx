import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

const UploadDoc = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      return Swal.fire({
        title: 'Wait!',
        text: 'Please select a file first.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37', // Your Primary Golden
      });
    }

    const formData = new FormData();
    formData.append('document', file);

    setIsUploading(true);
    try {
      const res = await axiosSecure.post('/upload-doc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Document uploaded to Drive and saved to profile.',
          icon: 'success',
          confirmButtonColor: '#D4AF37',
          footer: `<a href="${res.data.data}" target="_blank" style="color: #1E40AF; font-weight: bold;">View Drive Link</a>`,
        });
        setFile(null);
        e.target.reset();
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Upload failed!',
        icon: 'error',
        confirmButtonColor: '#1E40AF', // Your Secondary Blue
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-4">
      {/* Card with Primary Top Border */}
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border-t-8 border-primary">
        <div className="card-body">
          {/* Title in Golden */}
          <h2 className="card-title text-3xl font-black text-primary uppercase tracking-tighter">
            Secure Vault
          </h2>
          <p className="text-xs text-neutral opacity-60 font-semibold mb-6">
            Upload your documents directly to our secure Google Drive storage.
          </p>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-secondary">Supported: PDF, JPG, PNG</span>
              </label>
              {/* File input styled with your primary color */}
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered border-primary/20 file-input-primary w-full bg-white"
                accept=".pdf,.jpg,.png,.jpeg"
              />
            </div>

            {/* Submit Button: Golden (Primary) with Black Text */}
            <button
              type="submit"
              disabled={isUploading}
              className={`btn btn-primary w-full text-lg font-bold shadow-xl transition-all duration-300 ${
                isUploading ? 'loading' : ''
              }`}
            >
              {isUploading ? 'Transferring...' : 'Upload Now'}
            </button>
          </form>

          {/* Luxury Theme Divider */}
          <div className="mt-8 flex items-center justify-center gap-2">
             <div className="h-[2px] w-12 bg-primary/30"></div>
             <div className="h-2 w-2 rounded-full bg-secondary"></div>
             <div className="h-[2px] w-12 bg-primary/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDoc;