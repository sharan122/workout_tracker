import React, { useState } from "react";
import { profile } from "../services/auth";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getRefreshToken, getToken, persistor } from "../redux/store";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {

  const token = useSelector(getToken);
  // Sample user data, initialize with empty values to be filled in by user
  const [userData, setUserData] = useState({
    height: 0.00,
    weight: 0.00,
    age: 0,
  });
  const navigate = useNavigate()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save - Make an API call to update user profile
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      
      const response = await profile(token,userData.height, userData.weight, userData.age);
      if (response.status === 200) {
          console.log(response.status);
            toast.success("You Are Good TO GO");
            navigate("/dashboard");
        } else {
            toast.error(response.error || "Unexpected error occurred.");
        }
        console.log(response);
        
    } catch (error) {
        toast.error("Failed to update profile. Please try again.");
    }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center py-6">
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-lg text-gray-600">Please provide your details.</p>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
        <div className="space-y-4">
          {/* Display User Data Input Fields */}
          <div>
            <label className="block text-gray-700">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={userData.height}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your height"
            />
          </div>

          <div>
            <label className="block text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={userData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your weight"
            />
          </div>

          <div>
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={userData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your age"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </section>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ProfilePage;
