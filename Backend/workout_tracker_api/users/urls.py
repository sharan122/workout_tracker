# users/urls.py
from django.urls import path
from .views import RegisterView, LoginView, ExerciseListView, WorkoutLogView, WorkoutLogDetailView,Profile,TotalCaloriesBurnedAPIView,CaloriesBurnedChartAPIView
urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),
    path('workout-logs/', WorkoutLogView.as_view(), name='workout-logs'),
    path('workout-logs/<int:pk>/', WorkoutLogDetailView.as_view(), name='workout-log-detail'),
    path('profile/', Profile.as_view(), name='profile'),
    path('total-calories-burned/', TotalCaloriesBurnedAPIView.as_view(), name='total_calories_burned'),
    path('calories-burned-chart/', CaloriesBurnedChartAPIView.as_view(), name='calories-burned-chart'),
    
]
