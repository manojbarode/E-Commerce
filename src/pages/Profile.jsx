import React, { useState } from "react";
<<<<<<< HEAD
=======
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> main

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

<<<<<<< HEAD
=======
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow alphabets and spaces
    const onlyAlphabets = value.replace(/[^a-zA-Z\s]/g, '');
    setName(onlyAlphabets);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    const onlyNumbers = value.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    if (onlyNumbers.length <= 10) {
      setPhone(onlyNumbers);
    }
  };

>>>>>>> main
  const handleSubmit = () => {
    console.log("Profile saved:", { name, email, phone, image });
    alert("Profile saved successfully!");
  };

  return (
<<<<<<< HEAD
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center">User Profile</h2>

      {/* Profile Image Preview */}
      <div className="flex justify-center mb-6">
        <label className="cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">
                Upload
              </span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="tel"
          placeholder="Enter your phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
=======
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">User Profile</h2>

              {/* Profile Image Preview */}
              <div className="text-center mb-4">
                <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                  <div 
                    className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center overflow-hidden"
                    style={{ width: '128px', height: '128px' }}
                  >
                    {image ? (
                      <img 
                        src={image} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="text-muted">Upload</span>
                    )}
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none"
                  />
                </label>
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-primary w-100"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
>>>>>>> main
      </div>
    </div>
  );
};

export default Profile;