import axios from 'axios';

const API = 'http://127.0.0.1:8000/'


export const userSignup = async (username, email,password) => {

    try {

        const response = await axios.post(
            `${API}auth/register/`,{username,email,password}
        )
        if (response.status === 201) {
            
            return response; // success response
        } else {
              console.log(response);
            return { error: "Unexpected status code received from the server." };
          }
        
    } catch (error) {

        return error.response ? error.response.data : { error: 'Server error' };
        
    }

    
}


export const userSignin = async (username,password) => {

    try {
        const response = await axios.post( `${API}auth/login/`,{username,password})
        if (response.status === 200) {
            
            return response; // success response
        } else {

            return { error: "Unexpected status code received from the server." };
          }
        
    } catch (error) {
        return error.response ? error.response.data : { error: 'Server error' };
    }
    
}



export const profile = async (token,height, weight, age) => {
    try {
        const response = await axios.put(
            `${API}profile/`,
            { height, weight, age },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        );
        if (response.status === 200) {
            return response; // Success response
        } else {
            console.log(response);
            return { error: "Unexpected status code received from the server." };
        }
    } catch (error) {
        return error.response ? error.response.data : { error: "Server error" };
    }
};


export const getExercises = async (token) => {
    try {
        const response = await axios.get(
            `${API}exercises/`,  // The API endpoint
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Include token in the headers
                },
            }
        );

        if (response.status === 200) {
            console.log(response.data);
            
            return response.data;  // Return the list of exercises
        } else {
            console.log(response);
            return { error: "Unexpected status code received from the server." };
        }
    } catch (error) {
        return error.response ? error.response.data : { error: "Server error" };
    }
};




export const getWorkoutLogs = async (token) => {
    try {
      const response = await axios.get(`${API}/workout-logs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; 
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      throw error; 
    }
  };
  

  export const addWorkoutLog = async ( logData,token) => {
    console.log("Sending data:", logData);

    try {
      const response = await axios.post(
        `${API}/workout-logs/`,
        logData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data; 
    } catch (error) {
      console.error('Error adding workout log:', error);
      throw error;
    }
  };
  

  export const updateWorkoutLog = async (token, logId, logData) => {
    try {
      const response = await axios.put(
        `${API}/workout-logs/${logId}/`,
        logData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; 
    } catch (error) {
      console.error('Error updating workout log:', error);
      throw error;
    }
  };
  
  // Function to delete a workout log
  export const deleteWorkoutLog = async (token, logId) => {
    try {
      await axios.delete(`${API}/workout-logs/${logId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error deleting workout log:', error);
      throw error;
    }
  };


  export const getTotalCaloriesBurned = async (token) => {
    try {
      const response = await axios.get(`${API}total-calories-burned/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the total calories burned from the response
    } catch (err) {
      console.error('Error fetching total calories:', err);
      throw new Error('Failed to fetch calories burned');
    }
  };





  export const getCaloriesBurnedChart = async (token) => {
  try {
    const response = await axios.get(`${API}calories-burned-chart/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching calories burned chart data:", error);
    throw error;
  }
};