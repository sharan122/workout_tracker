class Observer:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def notify(self, message):
        for observer in self._observers:
            observer.update(message)

class ConcreteObserver:
    def __init__(self, name):
        self._name = name

    def update(self, message):
        print(f'{self._name} received message: {message}')

if __name__ == '__main__':
    observer = Observer()
    observer1 = ConcreteObserver('Observer 1')
    observer2 = ConcreteObserver('Observer 2')

    observer.attach(observer1)
    observer.attach(observer2)

    observer.notify('Hello Observers!')