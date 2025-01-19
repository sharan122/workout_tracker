import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import { userSignin } from "../services/auth";
import { useDispatch } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Track error message
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before submitting

    try {
      const response = await userSignin(username, password);

      if (response.status === 200) {
        toast.success("Successfully Logged In", {
          style: {
            border: "1px solid #0d9488",
            padding: "16px",
            color: "#0d9488",
          },
          iconTheme: {
            primary: "#0d9488",
            secondary: "#f0fdfa",
          },
        });

        dispatch(login(response.data));

        if (!response.data.user_profile?.height || !response.data.user_profile?.weight) {
          navigate('/profile');
        } else {
          navigate('/Dashboard');
        }
      } else {
        // Handle error responses
        console.log(response);
        
        setErrorMessage(response.detail || "Login failed. Please try again.");
        toast.error(response.detail || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-sm border border-gray-100 mx-4">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-gray-800 text-center tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-center text-gray-500">
            Please enter your credentials to continue
          </p>
        </div>

        {errorMessage && (
          <div className="text-red-600 text-center mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors placeholder:text-gray-400 text-gray-700"
              placeholder="Enter your username"
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors placeholder:text-gray-400 text-gray-700"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-teal-500 hover:bg-teal-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
            Create account
          </a>
        </p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Login;
