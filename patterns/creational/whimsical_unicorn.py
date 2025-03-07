# patterns/creational/singleton.py

class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class Singleton(metaclass=SingletonMeta):
    def __init__(self, value=None):
        if not hasattr(self, 'initialized'):
            self.value = value
            self.initialized = True

    def set_value(self, value):
        self.value = value

    def get_value(self):
        return self.value


if __name__ == "__main__":
    singleton1 = Singleton(10)
    singleton2 = Singleton(20)

    print(singleton1.get_value())  # Output: 10
    print(singleton2.get_value())  # Output: 10
    singleton1.set_value(30)
    print(singleton2.get_value())  # Output: 30