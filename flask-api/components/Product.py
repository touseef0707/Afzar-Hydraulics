# We assume a base.py file exists in this directory for the Component class
from .base import Component

class Product(Component):
    """
    Basic boilerplate class for a Product.
    This component can represent a data object in your system.
    """

    def __init__(self, name: str, product_id: str, details: dict = None):
        """
        Initialize the Product with specific parameters.

        Args:
            name (str): The name of the component instance.
            product_id (str): The unique identifier for the product.
            details (dict, optional): A dictionary of product attributes. Defaults to None.
        """
        super().__init__(name)
        self.product_id = product_id
        self.details = details or {}

    def get_details(self) -> dict:
        """
        Retrieve the product's details.

        Returns:
            dict: Placeholder for product details.
        """
        return self.details

    def process(self, data=None):
        """
        A method to process or validate the product data.
        This overrides the base component's process method.

        For example, this could be used to validate the product's schema.
        """
        print(f"Processing product '{self.name}' with ID '{self.product_id}'.")
        # In a real application, you would add validation or transformation logic here.
        pass

    def __repr__(self):
        """Provides a developer-friendly representation of the product."""
        return f"<Product name='{self.name}' product_id='{self.product_id}'>"
