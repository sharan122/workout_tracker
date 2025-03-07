# patterns/structural/composite.py

class Component:
    def operation(self) -> str:
        pass


class Leaf(Component):
    def operation(self) -> str:
        return "Leaf"


class Composite(Component):
    def __init__(self) -> None:
        self._children = []

    def add(self, component: Component) -> None:
        self._children.append(component)

    def remove(self, component: Component) -> None:
        self._children.remove(component)

    def operation(self) -> str:
        results = [child.operation() for child in self._children]
        return f"Composite: [{', '.join(results)}]"


def client_code(component: Component) -> None:
    print(component.operation())


if __name__ == "__main__":
    leaf1 = Leaf()
    leaf2 = Leaf()
    
    composite = Composite()
    composite.add(leaf1)
    composite.add(leaf2)
    
    client_code(composite)