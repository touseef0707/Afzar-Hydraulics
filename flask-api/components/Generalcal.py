import math

def calculate_cross_sectional_area(inner_diameter):
    """
    Calculate the cross-sectional area of a circular pipe.
    
    Args:
        inner_diameter (float): Inner diameter of the pipe in meters (m).
    
    Returns:
        float: Cross-sectional area in square meters (m²).
    """
    radius = inner_diameter / 2.0
    area = math.pi * (radius ** 2)
    return area


def calculate_velocity(flow_rate_m3hr, cross_sectional_area_m2):
    """
    Calculate the velocity of fluid in a pipe.
    
    Args:
        flow_rate_m3hr (float): Flow rate in cubic meters per hour (m³/hr)
        cross_sectional_area_m2 (float): Cross-sectional area in square meters (m²)
        
    Returns:
        float: Velocity in meters per second (m/s)
        
    Raises:
        ValueError: If cross_sectional_area_m2 is zero or negative
    """
    if cross_sectional_area_m2 <= 0:
        raise ValueError("Cross-sectional area must be greater than zero")
    
    # Convert flow rate from m³/hr to m³/s (divide by 3600 seconds in an hour)
    flow_rate_m3s = flow_rate_m3hr / 3600.0
    
    # Calculate velocity: V = Q / A
    velocity = flow_rate_m3s / cross_sectional_area_m2
    
    return velocity

def calculate_relative_roughness(roughness, inner_diameter):
    """
    Calculate the relative roughness of a pipe.
    
    Args:
        roughness (float): Absolute roughness of the pipe material (ε) in meters.
        inner_diameter (float): Inner diameter of the pipe (Di) in meters.
    
    Returns:
        float: Relative roughness (dimensionless).
    
    Raises:
        ValueError: If inner_diameter is zero.
    """
    if inner_diameter == 0:
        raise ValueError("Inner diameter must be greater than zero")
    return roughness / inner_diameter



def calculate_reynolds_number(density, velocity, diameter, viscosity_cp):
    """
    Calculate Reynolds number for pipe flow.
    
    Args:
        density (float): Fluid density (kg/m³)
        velocity (float): Fluid velocity (m/s)
        diameter (float): Pipe diameter (m)
        viscosity_cp (float): Dynamic viscosity (cP)
        
    Returns:
        float: Reynolds number
    """
    viscosity = viscosity_cp * 0.001  # Convert cP to Pa·s
    return (density * velocity * diameter) / viscosity

def get_flow_type(re):
    """
    Classify flow type based on Reynolds number.
    
    Args:
        re (float): Reynolds number
        
    Returns:
        str: Flow type ('laminar', 'transitional', 'turbulent')
    """
    if re < 2000:
        return 'laminar'
    elif 2000 <= re <= 4000:
        return 'transitional'
    else:
        return 'turbulent'

def friction_factor_swamee_jain(re, roughness, diameter):
    """
    Calculate friction factor using Swamee-Jain formula (turbulent flow).
    
    Args:
        re (float): Reynolds number
        roughness (float): Pipe roughness (m)
        diameter (float): Pipe diameter (m)
        
    Returns:
        float: Friction factor
    """
    term = roughness / (3.7 * diameter) 
    term1 = 5.74 / (re ** 0.9)
    return 0.25 / (math.log10(term+term1) ** 2)



def friction_factor_churchill(re, roughness, diameter):
    """
    Calculate friction factor using Churchill equation (all flow regimes).
    
    Args:
        re (float): Reynolds number
        roughness (float): Pipe roughness (m)
        diameter (float): Pipe diameter (m)
        
    Returns:
        float: Friction factor
    """
    term1 = (7 / re) ** 0.9 + 0.27 * (roughness / diameter)
    A = (2.457 * math.log(term1)) ** 16
    B = (37530 / re) ** 16
    bracket_term = (8 / re) ** 12 + 1 / (A + B) ** -1.5
    return 8 * bracket_term ** (1 / 12)

def calculate_friction_factor(re, roughness=None, diameter=None, method='auto'):
    """
    Calculate friction factor based on flow regime and specified method.
    
    Args:
        re (float): Reynolds number
        roughness (float, optional): Pipe roughness (m)
        diameter (float, optional): Pipe diameter (m)
        method (str): Calculation method ('auto', 'swamee_jain', 'churchill')
        
    Returns:
        float: Friction factor
        
    Raises:
        ValueError: For invalid inputs or missing parameters
    """
    flow_type = get_flow_type(re)
    
    if method == 'auto':
        if flow_type == 'laminar':
            return 64 / re
        elif flow_type == 'turbulent':
            if roughness is None or diameter is None:
                raise ValueError("Roughness and diameter required for turbulent flow")
            return friction_factor_swamee_jain(re, roughness, diameter)
        else:  # transitional
            if roughness is None or diameter is None:
                raise ValueError("Roughness and diameter required for transitional flow")
            return friction_factor_churchill(re, roughness, diameter)
    
    elif method == 'swamee_jain':
        if roughness is None or diameter is None:
            raise ValueError("Roughness and diameter required for Swamee-Jain method")
        return friction_factor_swamee_jain(re, roughness, diameter)
    
    elif method == 'churchill':
        if roughness is None or diameter is None:
            raise ValueError("Roughness and diameter required for Churchill method")
        return friction_factor_churchill(re, roughness, diameter)
    
    else:
        raise ValueError("Invalid method. Choose 'auto', 'swamee_jain', or 'churchill'")

def calculate_head_loss(friction_factor, length, diameter, velocity, gravity=9.81):
    """
    Calculate head loss using Darcy-Weisbach equation.
    
    Args:
        friction_factor (float): Friction factor
        length (float): Pipe length (m)
        diameter (float): Pipe diameter (m)
        velocity (float): Fluid velocity (m/s)
        gravity (float, optional): Gravitational acceleration (m/s²)
        
    Returns:
        float: Head loss (m)
    """
    return friction_factor * (length / diameter) * (velocity ** 2) / (2 * gravity)

def calculate_pressure_drop(friction_factor, density, length, diameter, velocity):
    """
    Calculate pressure drop using Darcy-Weisbach equation.
    
    Args:
        friction_factor (float): Friction factor
        density (float): Fluid density (kg/m³)
        length (float): Pipe length (m)
        diameter (float): Pipe diameter (m)
        velocity (float): Fluid velocity (m/s)
        
    Returns:
        float: Pressure drop (Pa)
    """
    return friction_factor * (length / diameter) * (density * velocity ** 2) / (2 * gravity)

# Example usage:
if __name__ == "__main__":
    # Input parameters
    density = 1000       # kg/m³ (water)
    velocity = 1.5       # m/s
    diameter = 0.05      # m
    viscosity_cp = 1.0   # cP (water)
    roughness = 0.0001   # m (PVC pipe)
    length = 10.0         # m
    gravity = 9.81        # m/s²
    
    # Calculate Reynolds number
    re = calculate_reynolds_number(density, velocity, diameter, viscosity_cp)
    print(f"Reynolds number: {re:.2f}")
    
    # Determine flow type
    flow_type = get_flow_type(re)
    print(f"Flow type: {flow_type}")
    
    # Calculate friction factor (auto method)
    f = calculate_friction_factor(re, roughness, diameter)
    print(f"Friction factor: {f:.4f}")
    
    # Calculate head loss
    h_loss = calculate_head_loss(f, length, diameter, velocity)
    print(f"Head loss: {h_loss:.4f} m")
    
    # Calculate pressure drop
    p_drop = calculate_pressure_drop(f, density, length, diameter, velocity)
    print(f"Pressure drop: {p_drop:.2f} Pa")

def extract_system_parameters(data):
    """Extract system parameters from the fetched JSON data"""
    system_params = {}
    
    for node in data['nodes']:
        node_type = node['data']['nodeType']
        params = node['data']['params']
        system_params[node_type] = {'params': params}
    
    return system_params

def perform_pipe_flow_calculations(system_params):
    """Convert parameters and perform calculations"""
    pipe_params = system_params['pipe']['params']
    feed_params = system_params['feed']['params']
    
    # Convert string parameters to float
    length = float(pipe_params['length'])
    diameter = float(pipe_params['diameter'])
    roughness = float(pipe_params['roughness']) / 1e6  # μm to m
    volumetric_flow_rate = float(pipe_params['volumetricFlowrate'])
    density = float(feed_params['density'])
    viscosity = float(feed_params['viscosity'])
    
    # Perform your existing calculations
    cross_sectional_area = calculate_cross_sectional_area(diameter)
    velocity = calculate_velocity(volumetric_flow_rate, cross_sectional_area)
    reynolds_number = calculate_reynolds_number(density, velocity, diameter, viscosity)
    friction_factor = calculate_friction_factor(reynolds_number, roughness, diameter)
    pressure_drop = calculate_pressure_drop(friction_factor, density, length, diameter, velocity)
    
    return {
        'status': 'success',
        'calculated_results': {
            'velocity': round(velocity, 3),
            'reynolds_number': round(reynolds_number, 1),
            'friction_factor': round(friction_factor, 4),
            'pressure_drop': round(pressure_drop, 2)
        }
    }
