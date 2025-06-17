class ControlValve:
    """Advanced class for hydraulic control valve modeling with physical characteristics."""

    def __init__(self, 
                 valve_type="globe", 
                 Cv=1.0, 
                 stroke=100.0, 
                 max_pressure=100.0,
                 response_time=2.0):
        """
        Initialize control valve with engineering parameters.
        
        Args:
            valve_type (str): Type of valve (globe/ball/butterfly/etc.)
            Cv (float): Flow coefficient [US gpm/sqrt(psi)]
            stroke (float): Full stroke travel [mm]
            max_pressure (float): Maximum operating pressure [bar]
            response_time (float): Time for 0-100% movement [seconds]
        """
        self.valve_type = valve_type
        self.Cv = Cv  # Flow coefficient
        self.stroke = stroke
        self.max_pressure = max_pressure
        self.response_time = response_time
        
        # Dynamic state variables
        self._position = 0.0  # 0-100% open
        self._target_position = 0.0
        self._flow_rate = 0.0  # m³/s
        self._pressure_drop = 0.0  # bar

    # --------------------------
    # Core Hydraulic Calculations
    # --------------------------
    def calculate_flow(self, pressure_upstream, pressure_downstream, fluid_density=1000.0):
        """
        Calculate flow rate using ISA standard control valve equation.
        
        Args:
            pressure_upstream (float): Upstream pressure [bar]
            pressure_downstream (float): Downstream pressure [bar]
            fluid_density (float): Fluid density [kg/m³]
            
        Returns:
            float: Volumetric flow rate [m³/s]
        """
        self._pressure_drop = pressure_upstream - pressure_downstream
        if self._pressure_drop <= 0:
            return 0.0
            
        # Convert Cv to SI units (m³/s/sqrt(Pa))
        Kv = self.Cv * 0.865  # Conversion factor
        
        # Effective flow area based on position (linear characteristic)
        effective_Cv = self.Cv * (self._position/100.0)
        
        # ISA standard flow equation
        self._flow_rate = effective_Cv * (self._pressure_drop/fluid_density)**0.5 * 1.156e-5
        return self._flow_rate

    def calculate_pressure_drop(self, flow_rate, fluid_density=1000.0):
        """
        Calculate required pressure drop for given flow rate.
        
        Args:
            flow_rate (float): Desired flow rate [m³/s]
            fluid_density (float): Fluid density [kg/m³]
            
        Returns:
            float: Required pressure drop [bar]
        """
        if flow_rate <= 0 or self._position == 0:
            return float('inf')
            
        effective_Cv = self.Cv * (self._position/100.0)
        self._pressure_drop = (flow_rate / (effective_Cv * 1.156e-5))**2 * fluid_density
        return self._pressure_drop

    # --------------------------
    # Valve Characteristics
    # --------------------------
    def set_valve_characteristic(self, characteristic="linear"):
        """
        Set flow vs position characteristic.
        
        Args:
            characteristic (str): Type of characteristic 
                ('linear', 'equal_percentage', 'quick_open')
        """
        self.characteristic = characteristic
        
    def _apply_characteristic(self, position):
        """Internal method to apply flow characteristic curve."""
        if self.characteristic == "linear":
            return position
        elif self.characteristic == "equal_percentage":
            return 50.0 * (math.exp(position/100.0 * math.log(2)) - 50.0)
        elif self.characteristic == "quick_open":
            return 100.0 * math.sqrt(position/100.0)
        return position

    # --------------------------
    # Dynamic Simulation
    # --------------------------
    def set_target_position(self, position, timestamp=None):
        """
        Command valve to new position (for dynamic simulation).
        
        Args:
            position (float): Target position (0-100%)
            timestamp (float): Simulation time for tracking movement
        """
        self._target_position = max(0.0, min(100.0, position))
        
    def update_dynamics(self, dt):
        """
        Update valve position based on response time.
        
        Args:
            dt (float): Time step [seconds]
        """
        max_movement = dt / self.response_time * 100.0
        position_error = self._target_position - self._position
        
        if abs(position_error) <= max_movement:
            self._position = self._target_position
        else:
            self._position += math.copysign(max_movement, position_error)

    # --------------------------
    # Safety and Diagnostics
    # --------------------------
    def check_cavitation(self, pressure_downstream, fluid_vapor_pressure):
        """
        Check for cavitation conditions.
        
        Args:
            pressure_downstream (float): Downstream pressure [bar]
            fluid_vapor_pressure (float): Fluid vapor pressure [bar]
            
        Returns:
            bool: True if cavitation is likely
        """
        return pressure_downstream <= fluid_vapor_pressure
        
    def get_flow_gain(self):
        """Return current flow gain (Kv) based on position."""
        return self.Cv * (self._position/100.0)