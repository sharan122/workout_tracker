class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

    def some_business_logic(self):
        return 'Executing business logic...'

singleton1 = Singleton()
singleton2 = Singleton()

assert singleton1 is singleton2
assert singleton1.some_business_logic() == 'Executing business logic...'