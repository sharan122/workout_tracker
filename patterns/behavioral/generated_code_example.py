```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

class DatabaseConnection(Singleton):
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.initialized = True
            self.connection_string = "Database Connection Established"

    def get_connection_string(self):
        return self.connection_string

db1 = DatabaseConnection()
db2 = DatabaseConnection()

print(db1.get_connection_string())
print(db2.get_connection_string())
print(db1 is db2)
```