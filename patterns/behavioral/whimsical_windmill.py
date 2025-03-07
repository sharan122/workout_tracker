# patterns/behavioral/observer.py

class Observer:
    def update(self, message):
        raise NotImplementedError("You should implement this method.")

class Subject:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def detach(self, observer):
        self._observers.remove(observer)

    def notify(self, message):
        for observer in self._observers:
            observer.update(message)

class ConcreteObserverA(Observer):
    def update(self, message):
        print(f"ConcreteObserverA: Received message: {message}")

class ConcreteObserverB(Observer):
    def update(self, message):
        print(f"ConcreteObserverB: Received message: {message}")

if __name__ == "__main__":
    subject = Subject()
    
    observer_a = ConcreteObserverA()
    observer_b = ConcreteObserverB()
    
    subject.attach(observer_a)
    subject.attach(observer_b)
    
    subject.notify("Hello Observers!")
    
    subject.detach(observer_a)
    
    subject.notify("Goodbye Observer A!")