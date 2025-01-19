Workout Tracker with Django, React, and JWT Authentication

Overview 🌟
This project is a modern Workout Tracker built with Django, React, and JWT (JSON Web Token). 
It allows users to track their workouts, monitor calories burned, and visualize progress through an intuitive dashboard. 
The app features secure user authentication, workout logging, and graphical data representation to help users stay on top of their fitness journey.

Key Features 🎯

JWT Authentication 🔐:

Secure user login and registration using JWT for authentication.
Stateless API interactions between frontend and backend.
REST API 🌐:

Built with Django REST Framework (DRF) to manage workout data and user authentication.
Workout Management 🏋️:

Users can add workouts by logging details such as exercise type, duration, and calories burned.
View a list of previous workouts


User Dashboard 📊:

Displays key statistics such as:
Total workouts completed 📅
Total calories burned 🔥
Total workout days 📅
An interactive graph to visualize progress over time.

Responsive Design 📱:

The app is optimized for both desktop and mobile devices.
Clean and user-friendly interface with easy navigation.

Data Visualization 📈:

Use of charts to display users' workout trends, calories burned, and other fitness metrics.

Technologies Used ⚙️
Frontend: React.js
Backend: Django Rest Framework (DRF)
Authentication: JWT (JSON Web Tokens)
Database: Sqlite3
Graphing Library: Chart.js (or another library for data visualization)


Installation 🔧

Backend Setup

• Clone the repository:
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker/backend
• Create and activate a virtual environment:
python -m venv env
source env/bin/activate 
• Install the required dependencies:
pip install -r requirements.txt
• Apply database migrations:
python manage.py migrate
• Create a superuser to access the admin panel:
python manage.py createsuperuser
• Run the backend server:
python manage.py runserver

Frontend Setup
• Navigate to the frontend directory:
cd frontend
• Install the required dependencies:
npm install
• Start the frontend server:
npm run dev



YOU ARE GOOD TO GO NOW...
