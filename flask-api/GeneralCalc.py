import math
from typing import Literal, Optional

FlowType = Literal['laminar', 'transitional', 'turbulent']
FrictionMethod = Literal['auto', 'swamee_jain', 'churchill']

def calculate_pipe_area(inner_diameter: float) -> float:
    """Calculate the cross-sectional area of a circular pipe.
    
    Args:
        inner_diameter: Inner diameter of pipe [m]
    
    Returns:
        Cross-sectional area [m²]
    """
    radius = inner_diameter / 2
    return math.pi * (radius ** 2)

def calculate_flow_velocity(volumetric_flow_rate: float, pipe_area: float) -> float:
    """Calculate fluid velocity in a pipe.
    
    Args:
        volumetric_flow_rate: Flow rate [m³/hr]
        pipe_area: Cross-sectional area [m²]
        
    Returns:
        Flow velocity [m/s]
        
    Raises:
        ValueError: If pipe area is not positive
    """
    if pipe_area <= 0:
        raise ValueError("Pipe area must be positive")
    
    # Convert m³/hr to m³/s
    flow_rate_m3s = volumetric_flow_rate / 3600
    return flow_rate_m3s / pipe_area

def calculate_relative_roughness(roughness: float, diameter: float) -> float:
    """Calculate pipe relative roughness (ε/D).
    
    Args:
        roughness: Absolute roughness [m]
        diameter: Inner diameter [m]
    
    Returns:
        Relative roughness (dimensionless)
    """
    if diameter == 0:
        raise ValueError("Diameter cannot be zero")
    return roughness / diameter

def calculate_reynolds_number(
    density: float, 
    velocity: float, 
    diameter: float, 
    viscosity_cp: float
) -> float:
    """Calculate Reynolds number for pipe flow.
    
    Args:
        density: Fluid density [kg/m³]
        velocity: Flow velocity [m/s]
        diameter: Pipe diameter [m]
        viscosity_cp: Dynamic viscosity [cP]
        
    Returns:
        Reynolds number (dimensionless)
    """
    viscosity_pas = viscosity_cp * 0.001  # Convert cP to Pa·s
    return (density * velocity * diameter) / viscosity_pas

def classify_flow_regime(reynolds_number: float) -> FlowType:
    """Classify flow regime based on Reynolds number.
    
    Args:
        reynolds_number: Calculated Reynolds number
        
    Returns:
        Flow regime classification
    """
    if reynolds_number < 2000:
        return 'laminar'
    elif 2000 <= reynolds_number <= 4000:
        return 'transitional'
    return 'turbulent'

def _calculate_turbulent_friction_swamee_jain(
    reynolds_number: float, 
    roughness: float, 
    diameter: float
) -> float:
    """Calculate turbulent flow friction factor using Swamee-Jain equation."""
    relative_roughness = roughness / (3.7 * diameter)
    term = 5.74 / (reynolds_number ** 0.9)
    return (0.25 / (math.log10(relative_roughness + term) ** 2))

def _calculate_universal_friction_churchill(
    reynolds_number: float, 
    roughness: float, 
    diameter: float
) -> float:
    """Calculate friction factor using Churchill's all-regime equation."""
    term1 = (7 / reynolds_number) ** 0.9 + 0.27 * (roughness / diameter)
    A = (2.457 * math.log(term1)) ** 16
    B = (37530 / reynolds_number) ** 16
    return 8 * ((8 / reynolds_number) ** 12 + 1 / (A + B) ** 1.5) ** (1 / 12)

def calculate_friction_factor(
    reynolds_number: float,
    roughness: Optional[float] = None,
    diameter: Optional[float] = None,
    method: FrictionMethod = 'auto'
) -> float:
    """Calculate Darcy friction factor for pipe flow.
    
    Args:
        reynolds_number: Calculated Reynolds number
        roughness: Pipe roughness [m] (required for turbulent/transitional)
        diameter: Pipe diameter [m] (required for turbulent/transitional)
        method: Calculation method
        
    Returns:
        Darcy friction factor
        
    Raises:
        ValueError: For invalid inputs or missing parameters
    """
    if method == 'auto':
        regime = classify_flow_regime(reynolds_number)
        if regime == 'laminar':
            return 64 / reynolds_number
        if roughness is None or diameter is None:
            raise ValueError("Roughness and diameter required for turbulent/transitional flow")
        return _calculate_turbulent_friction_swamee_jain(reynolds_number, roughness, diameter)
    
    if method == 'swamee_jain':
        if roughness is None or diameter is None:
            raise ValueError("Roughness and diameter required for Swamee-Jain method")
        return _calculate_turbulent_friction_swamee_jain(reynolds_number, roughness, diameter)
    
    if method == 'churchill':
        if roughness is None or diameter is None:
            raise ValueError("Roughness and diameter required for Churchill method")
        return _calculate_universal_friction_churchill(reynolds_number, roughness, diameter)
    
    raise ValueError("Invalid method. Choose 'auto', 'swamee_jain', or 'churchill'")

def calculate_head_loss(
    friction_factor: float,
    pipe_length: float,
    diameter: float,
    velocity: float,
    gravity: float = 9.81
) -> float:
    """Calculate head loss using Darcy-Weisbach equation.
    
    Args:
        friction_factor: Darcy friction factor
        pipe_length: Pipe length [m]
        diameter: Pipe diameter [m]
        velocity: Flow velocity [m/s]
        gravity: Gravitational acceleration [m/s²]
        
    Returns:
        Head loss [m]
    """
    return friction_factor * (pipe_length / diameter) * (velocity ** 2) / (2 * gravity)

def calculate_pressure_drop(
    friction_factor: float,
    density: float,
    pipe_length: float,
    diameter: float,
    velocity: float
) -> float:
    """Calculate pressure drop using Darcy-Weisbach equation.
    
    Args:
        friction_factor: Darcy friction factor
        density: Fluid density [kg/m³]
        pipe_length: Pipe length [m]
        diameter: Pipe diameter [m]
        velocity: Flow velocity [m/s]
        
    Returns:
        Pressure drop [Pa]
    """
    return friction_factor * (pipe_length / diameter) * (density * velocity ** 2) / 2

def analyze_pipe_flow(
    diameter: float,
    length: float,
    roughness: float,
    flow_rate: float,
    density: float,
    viscosity_cp: float,
    method: FrictionMethod = 'auto'
) -> dict:
    """Complete pipe flow analysis.
    
    Args:
        diameter: Pipe inner diameter [m]
        length: Pipe length [m]
        roughness: Pipe roughness [m]
        flow_rate: Volumetric flow rate [m³/hr]
        density: Fluid density [kg/m³]
        viscosity_cp: Dynamic viscosity [cP]
        method: Friction factor calculation method
        
    Returns:
        Dictionary containing all calculated parameters
    """
    area = calculate_pipe_area(diameter)
    velocity = calculate_flow_velocity(flow_rate, area)
    reynolds = calculate_reynolds_number(density, velocity, diameter, viscosity_cp)
    regime = classify_flow_regime(reynolds)
    friction = calculate_friction_factor(reynolds, roughness, diameter, method)
    head_loss = calculate_head_loss(friction, length, diameter, velocity)
    pressure_drop = calculate_pressure_drop(friction, density, length, diameter, velocity)
    
    return {
        'cross_sectional_area_m2': area,
        'flow_velocity_mps': velocity,
        'reynolds_number': reynolds,
        'flow_regime': regime,
        'friction_factor': friction,
        'head_loss_m': head_loss,
        'pressure_drop_pa': pressure_drop,
        'relative_roughness': calculate_relative_roughness(roughness, diameter)
    }

# if __name__ == "__main__":
#     # Example usage
#     results = analyze_pipe_flow(
#         diameter=0.05,
#         length=10.0,
#         roughness=0.0001,
#         flow_rate=10.0,
#         density=1000,
#         viscosity_cp=1.0
#     )
    
#     for param, value in results.items():
#         print(f"{param.replace('_', ' ').title()}: {value:.4f}" if isinstance(value, float) else f"{param.replace('_', ' ').title()}: {value}")

#     density = 1000       # kg/m³ (water)
#     velocity = 1.5       # m/s
#     diameter = 0.05      # m
#     viscosity_cp = 1.0   # cP (water)
#     roughness = 0.0001   # m (PVC pipe)
#     length = 10.0  

#     re = calculate_reynolds_number(density, velocity, diameter, viscosity_cp)
#     print(f"Reynolds number: {re:.2f}")
    
#     # Determine flow type
#     flow_type = classify_flow_regime(re)
#     print(f"Flow type: {flow_type}")
    
#     # Calculate friction factor (auto method)
#     f = calculate_friction_factor(re, roughness, diameter)
#     print(f"Friction factor: {f:.4f}")
    
#     # Calculate head loss
#     h_loss = calculate_head_loss(f, length, diameter, velocity)
#     print(f"Head loss: {h_loss:.4f} m")
    
#     # Calculate pressure drop
#     p_drop = calculate_pressure_drop(f, density, length, diameter, velocity)
#     print(f"Pressure drop: {p_drop:.2f} Pa")