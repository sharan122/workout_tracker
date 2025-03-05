python
class Component:
    def operation(self):
        pass


class Leaf(Component):
    def operation(self):
        return "Leaf"


class Composite(Component):
    def __init__(self):
        self.children = []

    def add(self, component):
        self.children.append(component)

    def remove(self, component):
        self.children.remove(component)

    def operation(self):
        results = [child.operation() for child in self.children]
        return f"Composite({', '.join(results)})"


def client_code(component: Component):
    print(component.operation())


if __name__ == "__main__":
    leaf1 = Leaf()
    leaf2 = Leaf()
    composite = Composite()
    composite.add(leaf1)
    composite.add(leaf2)
    client_code(composite)