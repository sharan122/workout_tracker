class Observer:
    def update(self, message):
        pass


class ConcreteObserver(Observer):
    def __init__(self, name):
        self.name = name

    def update(self, message):
        print(f"{self.name} received message: {message}")


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
    def send_message(self, message):
        self.notify(message)


if __name__ == "__main__":
    subject = ConcreteSubject()
    observer1 = ConcreteObserver("Observer 1")
    observer2 = ConcreteObserver("Observer 2")
    
    subject.attach(observer1)
    subject.attach(observer2)

    subject.send_message("Hello Observers!")
    subject.detach(observer1)
    subject.send_message("Observer 1 has unsubscribed.")