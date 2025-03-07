class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self):
        self.connection_string = "Database Connection Established"

    def query(self, sql):
        return f"Executing query: {sql}"


class App:
    def __init__(self):
        self.database_connection = DatabaseConnection()

    def run_query(self, sql):
        result = self.database_connection.query(sql)
        return result


if __name__ == "__main__":
    app1 = App()
    app2 = App()
    
    print(app1.database_connection is app2.database_connection)
    print(app1.run_query("SELECT * FROM users;"))