from typing import Any, Iterable
from .base import Component

class Feed(Component):
    """
    A component that acts as a pressurized data source for a pipeline system.
    It provides both the data stream and the initial pressure condition.
    """

    def __init__(
        self,
        id: str,
        fluid_type: str,
        pressure: float,  # Pa
    ):
        """
        Initializes the Feed with a id, data source, and initial pressure.

        Args:
            id (str): The id of the component instance.
            data_source (Iterable[Any]): An iterable object providing the data.
            pressure (float): Initial pressure in Pascals (kPa).
        """
        self.id=id
        self.fluid_type = fluid_type
        self.pressure = (pressure * 1000) if pressure is not None else None

    def process(self, data=None):
        print(f"Feed '{self.id}' is providing data at {self.pressure} Pa.")
        return data

    def __repr__(self) -> str:
        """Provides a developer-friendly representation of the Feed."""
        return f"<Feed id='{self.id}', pressure={self.pressure} KPa , fluid_type={self.fluid_type}>"