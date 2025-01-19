import React, { useState, useEffect } from "react";
import {
  getWorkoutLogs,
  addWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
  getExercises,
} from "../services/auth";
import { useSelector } from "react-redux";
import { getToken } from "../redux/store"; 

const WorkoutLogs = () => {
  const token = useSelector(getToken);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);

  // Fetch workout logs when component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      const logs = await getWorkoutLogs(token);
      if (!logs.error) {
        setWorkoutLogs(logs);
      } else {
        console.error(logs.error);
      }
    };

    fetchLogs();
  }, [token]);

  const handleAdd = () => {
    setCurrentLog(null); // Reset current log for new entry
    setIsModalOpen(true);
  };

  const handleEdit = (log) => {
    setCurrentLog(log); // Set the log to be edited
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentLog(null);
  };

  const handleSaveLog = async (log) => {
    const formattedLog = {
      exercise: parseInt(log.exercise, 10), // Convert exercise ID to an integer
      duration_minutes: parseInt(log.duration_minutes, 10), // Convert duration to an integer
      timestamp: log.date, // Ensure date is in the correct ISO format (already valid here)
    };
  
    if (log.id) {
      // Update existing log
      const updatedLog = await updateWorkoutLog(token, log.id, formattedLog);
      if (!updatedLog.error) {
        setWorkoutLogs((prev) =>
          prev.map((item) => (item.id === log.id ? updatedLog : item))
        );
      } else {
        console.error(updatedLog.error);
      }
    } else {
      // Add new log
      const newLog = await addWorkoutLog(formattedLog, token);
      if (!newLog.error) {
        setWorkoutLogs((prev) => [...prev, newLog]);
      } else {
        console.error(newLog.error);
      }
    }
    handleCloseModal();
  };

  const handleDelete = async (logId) => {
    try {
      await deleteWorkoutLog(token, logId);  // Delete the log
      setWorkoutLogs((prev) => prev.filter((item) => item.id !== logId));  // Update the state to remove the deleted log
    } catch (error) {
      console.error("Error deleting the log:", error);  // Handle any errors if deletion fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-blue-600 text-white py-4 px-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">Workout Logs</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          + Add Log
        </button>
      </header>

      {/* Logs Table */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Workouts</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-6 border text-left">#</th>
                <th className="py-3 px-6 border text-left">Exercise</th>
                <th className="py-3 px-6 border text-center">Duration (mins)</th>
                <th className="py-3 px-6 border text-center">Date</th>
                <th className="py-3 px-6 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workoutLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-300">
                  <td className="py-3 px-6 border text-center">{index + 1}</td>
                  <td className="py-3 px-6 border">{log.exercise_name}</td>
                  <td className="py-3 px-6 border text-center">{log.duration_minutes}</td>
                  <td className="py-3 px-6 border text-center">
                    {new Date(log.timestamp).toLocaleDateString('en-CA')}
                  </td>
                  <td className="py-3 px-6 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(log)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          log={currentLog}
          onClose={handleCloseModal}
          onSave={handleSaveLog}
        />
      )}
    </div>
  );
};

const Modal = ({ log, onClose, onSave }) => {
  const token = useSelector(getToken);
  const [formData, setFormData] = useState(
    log || { exercise: "", duration_minutes: "", date: "" }
  );
  const [exercises, setExercises] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch exercises when modal opens
  useEffect(() => {
    const fetchExercises = async () => {
      const fetchedExercises = await getExercises(token);
      
      if (!fetchedExercises.error) {
        setExercises(fetchedExercises);
      } else {
        console.error(fetchedExercises.error);
      }
    };

    fetchExercises();
  }, [token]);

  useEffect(() => {
    if (log && log.timestamp) {
      const date = new Date(log.timestamp).toISOString().split('T')[0]; 
      setFormData((prev) => ({ ...prev, date }));
    }
  }, [log]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { exercise, duration_minutes, date } = formData;
    const today = new Date().toISOString().split('T')[0];
    let newErrors = {};
    
    if (!exercise || !duration_minutes || !date) {
      newErrors.fields = "All fields are required!";
    }
    if (duration_minutes <= 0) {
      newErrors.duration = "Duration must be greater than zero!";
    }
    if (date < today) {
      newErrors.date = "Date cannot be in the past!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
      <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {log ? "Edit Log" : "Add Log"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.fields && <div className="text-red-600">{errors.fields}</div>}
          <div>
            <label className="block text-gray-700">Exercise</label>
            <select
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Duration (mins)</label>
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.duration && <div className="text-red-600">{errors.duration}</div>}
          </div>

          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.date && <div className="text-red-600">{errors.date}</div>}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutLogs;
