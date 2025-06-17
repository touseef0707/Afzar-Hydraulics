class Pump:
    """Class representing a hydraulic pump with common hydraulic operations."""
    
    def __init__(self, displacement_volume=None, efficiency=0.85, max_pressure=None, speed=1500):
        """Initialize a hydraulic pump with key parameters.
        
        Args:
            displacement_volume (float): Pump displacement volume in cm³/rev
            efficiency (float): Overall pump efficiency (0-1, default 0.85)
            max_pressure (float): Maximum operating pressure in bar
            speed (int): Operating speed in RPM (default 1500)
        """
        self.displacement_volume = displacement_volume  # cm³/rev
        self.efficiency = efficiency  # dimensionless (0-1)
        self.max_pressure = max_pressure  # bar
        self.speed = speed  # RPM
        self.fluid_density = 870  # kg/m³ (typical hydraulic oil)
        
    def calculate_flow_rate(self, speed=None):
        """Calculate theoretical flow rate of the pump.
        
        Args:
            speed (int, optional): Operating speed in RPM. Uses instance speed if None.
            
        Returns:
            float: Flow rate in liters per minute (L/min)
        """
        operating_speed = speed if speed is not None else self.speed
        if self.displacement_volume is None:
            raise ValueError("Displacement volume not set")
        # Q = n * V / 1000 (conversion from cm³ to liters)
        return (operating_speed * self.displacement_volume) / 1000
    
    def calculate_power(self, pressure, flow_rate=None):
        """Calculate required input power for given pressure.
        
        Args:
            pressure (float): System pressure in bar
            flow_rate (float, optional): Flow rate in L/min. Calculated if None.
            
        Returns:
            float: Power in kilowatts (kW)
        """
        if flow_rate is None:
            flow_rate = self.calculate_flow_rate()
        
        # P = (p * Q) / (600 * η)
        # where p in bar, Q in L/min, η is efficiency
        return (pressure * flow_rate) / (600 * self.efficiency)
    
    def calculate_pressure(self, torque):
        """Calculate pressure from input torque.
        
        Args:
            torque (float): Input torque in Nm
            
        Returns:
            float: Pressure in bar
        """
        if self.displacement_volume is None:
            raise ValueError("Displacement volume not set")
        # p = (20 * π * T * η) / V
        # where p in bar, T in Nm, V in cm³/rev
        return (20 * 3.1416 * torque * self.efficiency) / self.displacement_volume
    
    def calculate_torque(self, pressure):
        """Calculate required input torque for given pressure.
        
        Args:
            pressure (float): System pressure in bar
            
        Returns:
            float: Torque in Newton-meters (Nm)
        """
        if self.displacement_volume is None:
            raise ValueError("Displacement volume not set")
        # T = (V * p) / (20 * π * η)
        return (self.displacement_volume * pressure) / (20 * 3.1416 * self.efficiency)
    
    def set_fluid_density(self, density):
        """Set the fluid density for calculations.
        
        Args:
            density (float): Fluid density in kg/m³
        """
        self.fluid_density = density
    
    def __str__(self):
        return (f"Pump: {self.displacement_volume} cm³/rev, "
                f"{self.efficiency*100:.1f}% efficiency, "
                f"max {self.max_pressure} bar")