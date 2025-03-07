# patterns/behavioral/observer.py

class Subject:
    def __init__(self):
        self._observers = set()

    def attach(self, observer):
        self._observers.add(observer)

    def detach(self, observer):
        self._observers.discard(observer)

    def notify(self, message):
        for observer in self._observers:
            observer.update(message)


class Observer:
    def update(self, message):
        pass


class ConcreteObserver(Observer):
    def __init__(self, name):
        self.name = name

    def update(self, message):
        print(f"{self.name} received message: {message}")


if __name__ == "__main__":
    subject = Subject()

    observer1 = ConcreteObserver("Observer 1")
    observer2 = ConcreteObserver("Observer 2")

    subject.attach(observer1)
    subject.attach(observer2)

    subject.notify("Hello Observers!")

    subject.detach(observer1)

    subject.notify("Observer 1 has been detached.")