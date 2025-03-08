class Observer:
    def __init__(self):
        self.subscribers = []

    def subscribe(self, subscriber):
        self.subscribers.append(subscriber)

    def notify(self, message):
        for subscriber in self.subscribers:
            subscriber.update(message)

class Subscriber:
    def __init__(self, name):
        self.name = name

    def update(self, message):
        print(f'{self.name} received message: {message}')

if __name__ == '__main__':
    observer = Observer()
    subscriber1 = Subscriber('Subscriber 1')
    subscriber2 = Subscriber('Subscriber 2')
    observer.subscribe(subscriber1)
    observer.subscribe(subscriber2)
    observer.notify('Hello Subscribers!')