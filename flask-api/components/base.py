class Component:
    """A base class for all components in the system."""
    def __init__(self, name: str):
        self.name = name

    def process(self, data):
        """
        A placeholder method for components to process data.
        Raising NotImplementedError encourages developers to implement it in subclasses.
        """
        raise NotImplementedError("Each component must implement the 'process' method.")

    def __repr__(self):
        """Provides a developer-friendly representation of the component."""
        return f"<Component name='{self.name}'>"