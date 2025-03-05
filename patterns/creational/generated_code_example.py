```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

class Logger(Singleton):
    def log(self, message):
        print(f"Log: {message}")

logger1 = Logger()
logger2 = Logger()

logger1.log("This is the first log message.")
logger2.log("This is the second log message.")

print(logger1 is logger2)
```