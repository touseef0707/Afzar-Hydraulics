import math
from typing import Literal, Optional, Dict

FlowType = Literal["laminar", "transitional", "turbulent"]
FrictionMethod = Literal["auto", "swamee_jain", "churchill"]


class Pipe:
    """
    Hydraulic calculations for a single pipe segment carrying an incompressible Newtonian fluid.
    Handles both mass flow rate and volumetric flow rate inputs.
    """

    g = 9.81  # m/s², gravitational constant

    def __init__(
        self,
        inner_diameter: float,      # m
        length: float,              # m
        roughness: float,           # mm
        mass_flowrate: float,       # kg h-1
        # volumetric_flowrate: float, # m³ h-1
        density: float,             # kg m-3
        viscosity_cp: float,        # cP
        *,
        mass_flow_rate: Optional[float] = None,       # kg/h
        volumetric_flow_rate: Optional[float] = None, # m³/h
        friction_method: FrictionMethod = "auto"
    ) -> None:

        self.D          = inner_diameter
        self.L          = length
        self.epsilon    = roughness / 1000 # m
        self.Q          = mass_flowrate / 1000 
        self.rho        = density
        self.mu_cp      = viscosity_cp
        self.mu_pa_s    = viscosity_cp * 1e-3
        self._method    = friction_method

        # Calculate flow rates
        if mass_flow_rate is not None:
            self.m_dot_kg_h = mass_flow_rate
            self.m_dot_kg_s = mass_flow_rate / 3600
            self.Q_m3_h = mass_flow_rate / density
            self.Q_m3_s = self.Q_m3_h / 3600
        else:
            self.Q_m3_h = volumetric_flow_rate
            self.Q_m3_s = volumetric_flow_rate / 3600
            self.m_dot_kg_h = volumetric_flow_rate * density
            self.m_dot_kg_s = self.m_dot_kg_h / 3600

        # Initialize result fields
        self.area = None
        self.velocity = None
        self.reynolds = None
        self.regime = None
        self.friction_factor = None
        self.relative_roughness = None
        self.head_loss = None
        self.pressure_drop = None

    def solve(self) -> Dict[str, float]:
        """Run all calculations and return comprehensive results."""
        self.area = self._cross_sectional_area()
        self.velocity = self._flow_velocity()
        self.reynolds = self._reynolds_number()
        self.regime = self._classify_regime()
        self.friction_factor = self._darcy_friction_factor()
        self.relative_roughness = self.epsilon / self.D
        self.head_loss = self._darcy_head_loss()
        self.pressure_drop = self._darcy_pressure_drop()

        return {
            # Input parameters
            "inner_diameter_m": self.D,
            "length_m": self.L,
            "roughness_mm": self.epsilon * 1000,
            "density_kg_m3": self.rho,
            "viscosity_cP": self.mu_cp,
            
            # Flow rates
            "mass_flow_rate_kg_h": self.m_dot_kg_h,
            "mass_flow_rate_kg_s": self.m_dot_kg_s,
            "volumetric_flow_rate_m3_h": self.Q_m3_h,
            "volumetric_flow_rate_m3_s": self.Q_m3_s,
            
            # Calculated results
            "cross_sectional_area_m2": self.area,
            "flow_velocity_m_s": self.velocity,
            "reynolds_number": self.reynolds,
            "flow_regime": self.regime,
            "friction_factor": self.friction_factor,
            "relative_roughness": self.relative_roughness,
            "head_loss_m": self.head_loss,
            "pressure_drop_Pa": self.pressure_drop,
            "pressure_drop_bar": self.pressure_drop / 1e5,
        }

    # Calculation methods remain the same as before
    def _cross_sectional_area(self) -> float:
        return math.pi * (self.D ** 2) / 4

    def _flow_velocity(self) -> float:
        return self.Q_m3_s / self.area

    def _reynolds_number(self) -> float:
        return self.rho * self.velocity * self.D / self.mu_pa_s

    def _classify_regime(self) -> FlowType:
        Re = self.reynolds
        if Re < 2000:
            return "laminar"
        elif Re <= 4000:
            return "transitional"
        return "turbulent"

    def _darcy_friction_factor(self) -> float:
        Re = self.reynolds
        if Re < 2000:
            return 64 / Re
        elif 2000 <= Re < 4000:
            return self._swamee_jain_friction(Re)
        else:
            return self._churchill_friction(Re)

    def _swamee_jain_friction(self, Re: float) -> float:
        rr = self.epsilon / (3.7 * self.D)
        term = 5.74 / (Re ** 0.9)
        return 0.25 / ((math.log10(rr + term)) ** 2)

    def _churchill_friction(self, Re: float) -> float:
        A = (2.457 * math.log((7 / Re) ** 0.9 + 0.27 * self.epsilon / self.D)) ** 16
        B = (37530 / Re) ** 16
        return 8 * ((8 / Re) ** 12 + (A + B) ** -1.5) ** (1 / 12)

    def _darcy_head_loss(self) -> float:
        return (self.friction_factor * self.L * self.velocity ** 2) / (self.D * 2 * self.g)

    def _darcy_pressure_drop(self) -> float:
        return self.head_loss * self.rho * Pipe.g

    def __repr__(self) -> str:
        return f"Pipe(D={self.D}, L={self.L}, epsilon={self.epsilon}, Q={self.Q}, rho={self.rho}, mu_cp={self.mu_cp})"
