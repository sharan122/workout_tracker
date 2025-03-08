class Component:
    def operation(self):
        return 'Component'

class Decorator(Component):
    def __init__(self, component):
        self._component = component

    def operation(self):
        return f'Decorated {self._component.operation()}'

if __name__ == '__main__':
    simple = Component()
    decorated = Decorator(simple)
    print(decorated.operation())