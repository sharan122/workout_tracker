```python
class WorkoutBehavior:
    def __init__(self):
        self.workout_history = []

    def log_workout(self, workout_type, duration):
        self.workout_history.append({"type": workout_type, "duration": duration})

    def get_most_frequent_workout(self):
        frequency = {}
        for workout in self.workout_history:
            frequency[workout['type']] = frequency.get(workout['type'], 0) + 1
        return max(frequency, key=frequency.get) if frequency else None
```