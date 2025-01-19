from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile, Exercise, WorkoutLog
from .serializers import UserProfileSerializer, ExerciseSerializer, WorkoutLogSerializer,UserRegistrationSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import F, Sum
from django.shortcuts import get_object_or_404
from django.db.models.functions import TruncDate
from datetime import timedelta
from django.utils.timezone import now


class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            UserProfile.objects.create(user=user)
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
       
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class Profile(APIView):

    def get(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
   
    def put(self, request):
        user_profile = UserProfile.objects.get(user=request.user.id)
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
       
        user = User.objects.filter(username=username).first()
  
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            user_data = UserRegistrationSerializer(user).data
            try:
                user_profile = UserProfile.objects.get(user=user)
                user_profile_data = UserProfileSerializer(user_profile).data
                height = user_profile.height
                weight = user_profile.weight
            except UserProfile.DoesNotExist:
                user_profile_data = None
                height = None
                weight = None
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data,
                'user_profile': user_profile_data,
                'height': height,
                'weight': weight,
            }, status=status.HTTP_200_OK)
        
        return Response({"detail": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

class ExerciseListView(APIView):
    def get(self, request, *args, **kwargs):
        exercises = Exercise.objects.all()
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        # Create a new exercise
        serializer = ExerciseSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the new exercise to the database
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 

class WorkoutLogView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        user_profile = request.user.userprofile
        workout_logs = WorkoutLog.objects.filter(user=user_profile)
        serializer = WorkoutLogSerializer(workout_logs, many=True)
        return Response(serializer.data)
   
    def post(self, request, *args, **kwargs):
        print(request.data,'------------------------------')
        user = request.user
        # Ensure the user field is added to the request data
        request.data['user'] = user.userprofile.id

        serializer = WorkoutLogSerializer(data=request.data)
        if serializer.is_valid():
            # Pass the user explicitly
            serializer.save(user=user.userprofile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
    def put(self, request, *args, **kwargs):
        print('hi')
        workout_log = self.get_object(kwargs['pk'])
        user = request.user
        
        # Pass updated data to serializer
        serializer = WorkoutLogSerializer(workout_log, data=request.data, partial=False)
        
        if serializer.is_valid():
            serializer.save(user=user.userprofile)  # Update the log with the current user
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
    def patch(self, request, *args, **kwargs):
        print('hi')
 
        workout_log = self.get_object(kwargs['pk'])
        user = request.user
        
        # Pass updated data to serializer (partial=True allows partial updates)
        serializer = WorkoutLogSerializer(workout_log, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(user=user.userprofile)  # Update the log with the current user
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def delete(self, request, *args, **kwargs):

        workout_log = self.get_object(kwargs['pk'])
        workout_log.delete()  # Delete the workout log
        
        return Response({"detail": "Workout log deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        
        print('hi')
        try:
            return WorkoutLog.objects.get(pk=pk)
        except WorkoutLog.DoesNotExist:
            raise Response({"detail": "Workout log not found."}, status=status.HTTP_404_NOT_FOUND)



class WorkoutLogDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user_profile):
        try:
            return WorkoutLog.objects.get(pk=pk, user=user_profile)
        except WorkoutLog.DoesNotExist:
            return None

    def get(self, request, pk, *args, **kwargs):
        user_profile = request.user.userprofile
        workout_log = self.get_object(pk, user_profile)
        if workout_log:
            serializer = WorkoutLogSerializer(workout_log)
            return Response(serializer.data)
        return Response({"detail": "Workout log not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, *args, **kwargs):
        user_profile = request.user.userprofile
        workout_log = self.get_object(pk, user_profile)

        if workout_log:
            
            validated_data = request.data.copy() 
            validated_data['user'] = request.user.id  

            serializer = WorkoutLogSerializer(workout_log, data=validated_data)

            if serializer.is_valid():
                serializer.save() 
                return Response(serializer.data)
            else:
                print("Serializer Errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Workout log not found."}, status=status.HTTP_404_NOT_FOUND)




    def delete(self, request, pk, *args, **kwargs):
        user_profile = request.user.userprofile
        workout_log = self.get_object(pk, user_profile)
        if workout_log:
            workout_log.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Workout log not found."}, status=status.HTTP_404_NOT_FOUND)
    
    
    
    
class TotalCaloriesBurnedAPIView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):

        user_profile = get_object_or_404(UserProfile, user=request.user)
        total_calories = (
            WorkoutLog.objects.filter(user=user_profile)
            .annotate(calories_burned=F('duration_minutes') * F('exercise__calories_burned_per_minute'))
            .aggregate(total_calories_burned=Sum('calories_burned'))
        )

       
        total_workouts = WorkoutLog.objects.filter(user=user_profile).count()


        total_active_days = (
            WorkoutLog.objects.filter(user=user_profile)
            .annotate(workout_day=TruncDate('timestamp'))
            .values('workout_day')
            .distinct()
            .count()
        )

        return Response({
            "user_id": request.user.id,
            "total_calories_burned": total_calories.get('total_calories_burned') or 0,
            "total_workouts": total_workouts,
            "total_active_days": total_active_days,
        })
        
        
        
        
class CaloriesBurnedChartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
  

        user_profile = UserProfile.objects.get(user=request.user)
        

        end_date = now().date()
        start_date = end_date - timedelta(days=6)
        

        daily_calories = (
            WorkoutLog.objects.filter(user=user_profile, timestamp__date__range=(start_date, end_date))
            .annotate(calories_burned=F('duration_minutes') * F('exercise__calories_burned_per_minute'))
            .annotate(workout_day=TruncDate('timestamp'))
            .values('workout_day')
            .annotate(total_calories=Sum('calories_burned'))
            .order_by('workout_day')
        )
        

        data = {entry['workout_day']: entry['total_calories'] for entry in daily_calories}
        
  
        chart_data = []
        for i in range(7):
            day = start_date + timedelta(days=i)
            chart_data.append({
                'date': day,
                'calories': data.get(day, 0)
            })

        return Response(chart_data)