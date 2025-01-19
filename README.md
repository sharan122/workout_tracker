# Workout Tracker with Django, React, and JWT Authentication

## Overview
🌟 A modern Workout Tracker built with Django, React, and JWT (JSON Web Token) authentication. This application enables users to track their workouts, monitor calories burned, and visualize their progress through an intuitive dashboard. With secure user authentication, comprehensive workout logging, and graphical data representation, users can effectively monitor and maintain their fitness journey.

## Key Features

### Authentication 🔐
- Secure user login and registration system powered by JWT
- Stateless API interactions between frontend and backend

### REST API 🌐
- Built with Django REST Framework (DRF) for robust workout data and user authentication management

### Workout Management 🏋️
- Add detailed workout entries including exercise type, duration, and calories burned
- Access comprehensive history of previous workouts

### User Dashboard 📊
- Track essential metrics:
  - Total workouts completed 📅
  - Total calories burned 🔥
  - Total workout days 📅
- Interactive graphical representation of progress over time

### Responsive Design 📱
- Optimized for both desktop and mobile devices
- Intuitive user interface with streamlined navigation

### Data Visualization 📈
- Dynamic charts displaying workout trends, calories burned, and fitness metrics

## Technologies Used ⚙️

- **Frontend:** React.js
- **Backend:** Django Rest Framework (DRF)
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** Sqlite3
- **Visualization:** Chart.js

## Installation Guide 🔧

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/sharan122/workout_tracker.git
cd workout-tracker/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv env
source env/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply database migrations:
```bash
python manage.py migrate
```

5. Create an admin superuser:
```bash
python manage.py createsuperuser
```

6. Launch the backend server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

## Ready to Use! 🚀
Your Workout Tracker should now be up and running locally. Open your browser and start tracking your fitness journey!
