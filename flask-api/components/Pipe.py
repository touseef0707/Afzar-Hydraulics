from .base import Component
from typing import Any

class Pipe(Component):
    """
    A component that connects a source to a destination, managing data flow
    and applying an optional transformation.
    """

    def __init__(self, name: str, source: Component, destination: Component):
        """
        Initializes the Pipe with a name, a source, and a destination component.

        Args:
            name (str): The name of the component instance.
            source (Component): The component that provides data.
            destination (Component): The component that receives data.
        """
        super().__init__(name)
        self.source = source
        self.destination = destination

    def transform(self, data: Any) -> Any:
        """
        A dedicated method for data transformation within the pipe.
        The default behavior is to return the data unchanged.
        This method can be overridden in subclasses for specific transformations.

        Args:
            data (Any): The data to be transformed.

        Returns:
            Any: The transformed data.
        """
        print(f"Pipe '{self.name}' is passing data through without transformation.")
        return data

    def process(self, data=None):
        """
        Orchestrates the data flow from the source, through the pipe's
        transformation logic, to the destination.
        """
        print(f"--- Starting data flow through Pipe '{self.name}' ---")

        # 1. Get data from the source component
        source_data = self.source.process()

        # 2. Transform the data using the pipe's own logic
        transformed_data = self.transform(source_data)

        # 3. Send the transformed data to the destination component
        self.destination.process(transformed_data)

        print(f"--- Data flow through Pipe '{self.name}' complete ---")

    def __repr__(self) -> str:
        """Provides a developer-friendly representation of the Pipe."""
        return f"<Pipe name='{self.name}' source='{self.source.name}' dest='{self.destination.name}'>"
