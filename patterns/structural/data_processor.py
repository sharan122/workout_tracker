# patterns/structural/facade.py

class ComplexSystem:
    def operation_1(self):
        return "Operation 1 completed."

    def operation_2(self):
        return "Operation 2 completed."

    def operation_3(self):
        return "Operation 3 completed."


class Facade:
    def __init__(self):
        self.system = ComplexSystem()

    def perform_operations(self):
        results = []
        results.append(self.system.operation_1())
        results.append(self.system.operation_2())
        results.append(self.system.operation_3())
        return results


if __name__ == "__main__":
    facade = Facade()
    output = facade.perform_operations()
    for result in output:
        print(result)