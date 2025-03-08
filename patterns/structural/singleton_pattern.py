class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

    def some_business_logic(self):
        return 'Performing some business logic...'

singleton1 = Singleton()
singleton2 = Singleton()

assert singleton1 is singleton2
result = singleton1.some_business_logic()