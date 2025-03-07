class Shape:
    def draw(self):
        raise NotImplementedError("You should implement this method!")

class Circle(Shape):
    def draw(self):
        return "Drawing a Circle"

class Rectangle(Shape):
    def draw(self):
        return "Drawing a Rectangle"

class ShapeDecorator(Shape):
    def __init__(self, shape):
        self._shape = shape

class ColorFillDecorator(ShapeDecorator):
    def __init__(self, shape, color):
        super().__init__(shape)
        self._color = color

    def draw(self):
        return f"{self._shape.draw()} with {self._color} color"

class BorderDecorator(ShapeDecorator):
    def __init__(self, shape, border_style):
        super().__init__(shape)
        self._border_style = border_style

    def draw(self):
        return f"{self._shape.draw()} with {self._border_style} border"

circle = Circle()
rectangle = Rectangle()

red_circle = ColorFillDecorator(circle, "red")
dotted_rectangle = BorderDecorator(rectangle, "dotted")

shapes = [red_circle, dotted_rectangle]

for shape in shapes:
    print(shape.draw())