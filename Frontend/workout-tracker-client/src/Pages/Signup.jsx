import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userSignup } from "../services/auth";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword } = formData;
    let formErrors = {};
    let isValid = true;

    // Email validation (Regex check)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      formErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation (at least 8 characters, including uppercase, number, special char)
    if (password.length < 8) {
      formErrors.password = "Password should be at least 8 characters long";
      isValid = false;
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      formErrors.password = "Password must contain uppercase, number, and special character";
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!validateForm()) return;

    try {
      const response = await userSignup(name, email, password);
      if (response.status === 201) {
        toast.success("Signup Complete", {
          style: {
            border: "1px solid #4CAF50",
            padding: "16px",
            color: "#4CAF50",
          },
          iconTheme: {
            primary: "#4CAF50",
            secondary: "#FFFAEE",
          },
        });
        navigate("/login");
      } else {
        if (response.status === "error") {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-sm border border-gray-100 mx-4">
        <h2 className="text-3xl font-semibold text-gray-800 text-center tracking-tight">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors placeholder:text-gray-400 text-gray-700"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors placeholder:text-gray-400 text-gray-700"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors placeholder:text-gray-400 text-gray-700"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors placeholder:text-gray-400 text-gray-700"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-teal-500 hover:bg-teal-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
            Log in
          </a>
        </p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Signup;
