from .base import Component
from typing import Any, Iterable

class Feed(Component):
    """
    A component that acts as a data source for a pipeline.
    It can wrap an iterable data source like a list or generator.
    """

    def __init__(self, name: str, data_source: Iterable[Any]):
        """
        Initializes the Feed with a name and a data source.

        Args:
            name (str): The name of the component instance.
            data_source (Iterable[Any]): An iterable object (e.g., list, generator)
                                         that provides the data.
        """
        super().__init__(name)
        self.data_source = data_source

    def process(self, data=None) -> Iterable[Any]:
        """
        The process for a Feed is to yield its data.
        This allows it to be used as the starting point in a processing chain.

        Returns:
            Iterable[Any]: The data from the source.
        """
        print(f"Feed '{self.name}' is providing data.")
        # In a real-world scenario, this could be fetching data from a database,
        # an API, or reading from a file.
        return self.data_source

    def __repr__(self) -> str:
        """Provides a developer-friendly representation of the Feed."""
        return f"<Feed name='{self.name}'>"
