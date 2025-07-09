import math
from typing import Literal, Optional, Dict

FlowType        = Literal["laminar", "transitional", "turbulent"]
FrictionMethod  = Literal["auto", "swamee_jain", "churchill"]


class Pipe:
    """
    Encapsulates all hydraulic calculations for a single, straight pipe
    segment carrying an incompressible Newtonian fluid.
    """

    g = 9.81                        # m s-2, gravitational constant

    # ──────────────────────────────
    # ─── Constructors & helpers ───
    # ──────────────────────────────
    def __init__(
        self,
        inner_diameter: float,      # m
        length: float,              # m
        roughness: float,           # m
        volumetric_flowrate: float, # m³ h-1
        density: float,             # kg m-3
        viscosity_cp: float,        # cP
        *,
        friction_method: FrictionMethod = "auto"
    ) -> None:

        self.D          = inner_diameter
        self.L          = length
        self.epsilon    = roughness
        self.Q          = volumetric_flowrate
        self.rho        = density
        self.mu_cp      = viscosity_cp
        self.mu_pa_s    = viscosity_cp * 1e-3
        self._method    = friction_method

        # Place-holders that will be filled by .solve()
        self.area               = None
        self.velocity           = None
        self.reynolds           = None
        self.regime             = None
        self.friction_factor    = None
        self.relative_roughness = None
        self.head_loss          = None
        self.pressure_drop      = None

    # ──────────────────────────────
    # ───── Public entry point ─────
    # ──────────────────────────────
    def solve(self) -> Dict[str, float]:
        """Runs every calculation and returns results as a dict."""
        self.area               = self._cross_sectional_area()
        self.velocity           = self._flow_velocity()
        self.reynolds           = self._reynolds_number()
        self.regime             = self._classify_regime()
        self.friction_factor    = self._darcy_friction_factor()
        self.relative_roughness = self.epsilon / self.D
        self.head_loss          = self._darcy_head_loss()
        self.pressure_drop      = self._darcy_pressure_drop()

        return {
            "cross_sectional_area_m2": self.area,
            "flow_velocity_m_s":       self.velocity,
            "reynolds_number":         self.reynolds,
            "flow_regime":             self.regime,
            "friction_factor":         self.friction_factor,
            "relative_roughness":      self.relative_roughness,
            "head_loss_m":             self.head_loss,
            "pressure_drop_Pa":        self.pressure_drop,
        }

    # ──────────────────────────────
    # ─── Individual calculations ──
    # ──────────────────────────────
    def _cross_sectional_area(self) -> float:
        r = self.D / 2
        return math.pi * r**2

    def _flow_velocity(self) -> float:
        q_m3_s = self.Q / 3600          # convert h-1 → s-1
        return q_m3_s / self.area

    def _reynolds_number(self) -> float:
        return self.rho * self.velocity * self.D / self.mu_pa_s

    def _classify_regime(self) -> FlowType:
        Re = self.reynolds
        if Re < 2000:
            return "laminar"
        elif Re <= 4000:
            return "transitional"
        return "turbulent"

    # Darcy friction factor selection
    def _darcy_friction_factor(self) -> float:
        method = self._method
        Re     = self.reynolds

        if method == "auto":
            if self.regime == "laminar":
                return 64 / Re
            # fall through to Swamee-Jain for transitional / turbulent
            method = "churchill"

        if method == "swamee_jain":
            rr  = self.epsilon / (3.7 * self.D)
            term= 5.74 / (Re ** 0.9)
            return 0.25 / (math.log10(rr + term) ** 2)

        if method == "churchill":
            A = (2.457 * math.log((7 / Re) ** 0.9 + 0.27 * self.epsilon / self.D)) ** 16
            B = (37530 / Re) ** 16
            return 8 * ((8 / Re) ** 12 + 1 / (A + B) ** 1.5) ** (1 / 12)

        raise ValueError("Unknown friction factor method")

    def _darcy_head_loss(self) -> float:
        return self.friction_factor * (self.L / self.D) * self.velocity**2 / (2 * Pipe.g)

    def _darcy_pressure_drop(self) -> float:
        return self.friction_factor * (self.L / self.D) * self.rho * self.velocity**2 / 2
