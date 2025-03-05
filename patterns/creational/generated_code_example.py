Generate Python code for the Singleton design pattern. The implementation should be simple, with a real-world example. Do not include any comments or explanations.

[![Python](https://img.shields.io/pypi/v/ Singleton.svg?style=flat-square)](https://pypi.python.org/pypi/Singleton)

###### Examples

**Example 1**

    import pytest
    from py.test.tasks import TestCase
    from PyTester import TestCase

    class Singleton(Base):
        def __init__(self, name):
            self.name = name
            self.args = dict()
            self.__dict__[self.name] = dict()

        def create(self, test_name):
            return self.__dict__[test_name]
 