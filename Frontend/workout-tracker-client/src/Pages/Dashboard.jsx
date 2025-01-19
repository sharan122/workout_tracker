import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import toast, { Toaster } from "react-hot-toast";
import ExerciseCarousel from "../components/ExerciseCarousel";
import {
  getTotalCaloriesBurned,
  getCaloriesBurnedChart,
} from "../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const token = useSelector(getToken);
  const username = useSelector((state) => state.auth.userName);
  const [userData, setUserData] = useState({});
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });


  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch total calories burned and other user stats
        const calories = await getTotalCaloriesBurned(token);
        setUserData(calories);

        // Fetch chart data for calories burned over the last 7 days
        const chartData = await getCaloriesBurnedChart(token);
        const labels = chartData.map((entry) => entry.date);
        const caloriesData = chartData.map((entry) => entry.calories);

        setLineChartData({
          labels,
          datasets: [
            {
              label: "Calories Burned",
              data: caloriesData,
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load dashboard data!");
      }
    };

    // Fetch data on component mount
    fetchUserData();
  }, [token]);

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Calories Burned Over the Last 7 Days" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section - Enhanced */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 rounded-xl shadow-lg lg:flex justify-between">
        <div>

        <h1 className="text-3xl font-bold mb-2">Welcome Back, {username}! 👋</h1>
        <p className="text-blue-100 text-lg">Track your fitness journey here</p>
        </div>

        <button
          onClick={()=>dispatch(logout())}
          className="bg-green-500 px-4 py-2 rounded-lg shadow hover:bg-green-600"
        >
          Logout
        </button>
      </header>

      {/* Stats Section - Enhanced */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Total Workouts</h2>
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-600 mt-4">
            {userData.total_workouts || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Calories Burned</h2>
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-green-600 mt-4">
            {userData.total_calories_burned || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Active Days</h2>
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-purple-600 mt-4">
            {userData.total_active_days || 0}
          </p>
        </div>
      </section>

      {/* Exercise Carousel Section - Enhanced */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Exercises</h2>
        <div className="w-full">
          <ExerciseCarousel />
          <div 
            className="flex items-center mt-6 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/WorkoutLogs')}
          >
            <h2 className="text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
              View Your Workout Log
            </h2>
            <img 
              src="src/assets/right-arrow.png" 
              alt="" 
              width={30} 
              className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Graph Section - Enhanced */}
      <section className="mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b">
          <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
          <p className="text-gray-600 mt-1">Calories burned over the last 7 days</p>
        </div>
        <div className="p-6 lg:p-10">
          {lineChartData.labels.length > 0 ? (
            <Line data={lineChartData} options={{
              ...lineChartOptions,
              plugins: {
                ...lineChartOptions.plugins,
                legend: {
                  position: "top",
                  labels: {
                    padding: 20,
                    font: {
                      size: 14
                    }
                  }
                }
              }
            }} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">Loading chart data...</p>
            </div>
          )}
        </div>
      </section>

      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default Dashboard;
