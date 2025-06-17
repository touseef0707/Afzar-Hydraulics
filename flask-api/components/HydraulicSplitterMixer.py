class HydraulicSplitterMixer:
    """Basic boilerplate class for hydraulic splitter/mixer operations."""

    def __init__(self, num_ports=3, split_ratio=None, max_pressure=100.0):
        """Initialize splitter/mixer with default parameters.
        
        Args:
            num_ports (int): Number of ports (default: 3, typical for T-junction)
            split_ratio (list, optional): Default flow distribution ratio for splitting
            max_pressure (float): Maximum pressure rating in bar (default: 100.0)
        """
        self.num_ports = num_ports
        self.split_ratio = split_ratio or [1.0] * num_ports  # Equal flow by default
        self.max_pressure = max_pressure
        self.current_flows = [0.0] * num_ports
        self.current_pressures = [0.0] * num_ports

    def set_split_ratio(self, ratios):
        """Set flow distribution ratios for splitting operation.
        
        Args:
            ratios (list): List of ratios for each output port (sum will be normalized)
            
        Example:
            For 3 ports: [2, 1, 1] means 50% flow to port 1, 25% to port 2 and 3
        """
        total = sum(ratios)
        self.split_ratio = [r/total for r in ratios]

    def calculate_split_flows(self, inlet_flow):
        """Calculate outlet flows based on current split ratio.
        
        Args:
            inlet_flow (float): Inlet flow rate in m³/s
            
        Returns:
            list: Flow rates for each outlet port
        """
        return [inlet_flow * ratio for ratio in self.split_ratio]

    def calculate_mixed_pressure(self, inlet_pressures):
        """Calculate resulting pressure when mixing multiple flows.
        
        Args:
            inlet_pressures (list): Pressures from each inlet port
            
        Returns:
            float: Mixed outlet pressure
        """
        # Simple average pressure (can be replaced with more complex models)
        return sum(inlet_pressures) / len(inlet_pressures)

    def energy_loss_splitter(self, inlet_pressure, outlet_pressures):
        """Calculate energy loss in splitting operation.
        
        Args:
            inlet_pressure (float): Inlet pressure
            outlet_pressures (list): Outlet pressures
            
        Returns:
            float: Energy loss in Watts
        """
        # Placeholder for actual energy loss calculation
        return sum(max(0, inlet_pressure - p) for p in outlet_pressures)

    def check_flow_balance(self, flows):
        """Verify flow balance for mixing operation.
        
        Args:
            flows (list): List of flow rates at all ports
            
        Returns:
            bool: True if flows balance (sum in ≈ sum out)
        """
        return abs(sum(flows)) < 1e-6  # Allow for small numerical errors