from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Exercise),
admin.site.register(UserProfile),
admin.site.register(WorkoutLog),