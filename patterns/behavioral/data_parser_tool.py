class Observer:
    def update(self, message):
        raise NotImplementedError("You should implement this method!")

class ConcreteObserverA(Observer):
    def update(self, message):
        print(f"ConcreteObserverA received: {message}")

class ConcreteObserverB(Observer):
    def update(self, message):
        print(f"ConcreteObserverB received: {message}")

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

class ConcreteSubject(Subject):
    def change_state(self, new_state):
        self.notify(f'State has changed to: {new_state}')

if __name__ == "__main__":
    subject = ConcreteSubject()
    observer_a = ConcreteObserverA()
    observer_b = ConcreteObserverB()

    subject.attach(observer_a)
    subject.attach(observer_b)

    subject.change_state("Active")
    subject.detach(observer_a)
    subject.change_state("Inactive")