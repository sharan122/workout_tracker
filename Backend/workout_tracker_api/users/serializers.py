# users/serializers.py
from rest_framework import serializers
from .models import UserProfile, Exercise, WorkoutLog
from django.contrib.auth.models import User



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        # Create the user and set the password securely
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'height', 'weight', 'age']

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id','name', 'category', 'calories_burned_per_minute']

class WorkoutLogSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = WorkoutLog
        fields = ['id', 'exercise','exercise_name', 'duration_minutes', 'timestamp', 'user']

    def create(self, validated_data):
        # Assign the user from the request context
        user = validated_data.pop('user', None)
        return WorkoutLog.objects.create(user=user, **validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('user', None)  
        return super().update(instance, validated_data)

