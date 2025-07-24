from typing import Any, Iterable
from .base import Component

class Product(Component):
    """
    A component that acts as the final destination in a pipeline system.
    It receives data and has a specified outlet pressure condition.
    """

    def __init__(
        self,
        id: str,
        outlet_pressure: float,  # Pa
    ):
        """
        Initializes the Product with a id and outlet pressure.

        Args:
            id (str): The id of the component instance.
            outlet_pressure (float): Outlet pressure in Pascals (Pa).
        """
        self.id=id
        self.outlet_pressure = outlet_pressure  # Pa

    def process(self, data: Iterable[Any]) -> None:
        """
        Receives data from upstream components.
        In a real system, this might handle final pressure conditions or data collection.

        Args:
            data (Iterable[Any]): The incoming data stream.
        """
        print(f"Product '{self.id}' received data at outlet pressure {self.outlet_pressure} Pa.")
        # Typically would store or process the final data here

    def get_outlet_pressure(self) -> float:
        return self.outlet_pressure

    def set_outlet_pressure(self, outlet_pressure: float) -> None:
        self.outlet_pressure = outlet_pressure

    def calculate_outlet_pressure(self, inlet_pressure, pressure_drop: float) -> None:
        self.set_outlet_pressure(inlet_pressure - pressure_drop)

    def __repr__(self) -> str:
        """Provides a developer-friendly representation of the Product."""
        return f"<Product id='{self.id}', outlet_pressure={self.outlet_pressure} Pa>"