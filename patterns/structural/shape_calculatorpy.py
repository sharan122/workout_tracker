class Shape:
    def area(self):
        raise NotImplementedError("Subclasses should implement this!")

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * (self.radius ** 2)

shapes = [Rectangle(10, 5), Circle(7)]
areas = [shape.area() for shape in shapes]
print(areas)