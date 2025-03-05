python
class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

    def __init__(self, value=None):
        if not hasattr(self, 'initialized'):
            self.value = value
            self.initialized = True

# Usage example
singleton1 = Singleton(10)
singleton2 = Singleton(20)

print(singleton1.value)  # Output: 10
print(singleton2.value)  # Output: 10
print(singleton1 is singleton2)  # Output: True