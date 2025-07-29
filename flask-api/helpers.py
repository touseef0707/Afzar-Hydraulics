"""
extended_helpers.py
-------------------
Improved version that first creates component instances and then uses them to detect calculation mode.
"""

from __future__ import annotations
import math
from collections import defaultdict, deque
from typing import Dict, List, Any, Literal, Optional, Tuple
from enum import Enum

from components.Pipe import Pipe
from components.Feed import Feed
from components.Product import Product


class CalculationMode(Enum):
    OUTLET_PRESSURE = 1    # Given inlet P and flow, find outlet P
    INLET_PRESSURE = 2     # Given outlet P and flow, find required inlet P
    FLOW_RATE = 3          # Given inlet and outlet P, find max possible flow


# ──────────────────────────────────────────────────────────
# Graph Traversal (unchanged)
# ──────────────────────────────────────────────────────────
def traversal_order(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[str]:
    """Same as before"""
    adj: Dict[str, List[str]] = defaultdict(list)
    in_deg: Dict[str, int] = defaultdict(int)

    for edge in edges:
        s, t = edge["source"], edge["target"]
        adj[s].append(t)
        in_deg[t] += 1
        in_deg.setdefault(s, 0)  # ensure presence

    queue = deque([n for n, d in in_deg.items() if d == 0])
    order: List[str] = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in adj[node]:
            in_deg[nxt] -= 1
            if in_deg[nxt] == 0:
                queue.append(nxt)

    if len(order) != len(in_deg):
        raise ValueError("Graph contains cycles or disconnected nodes")

    return order


def validate_order(order, nodes_raw):
    """Same as before"""
    expected_sequence = ["feed", "pipe", "product"]
    actual_sequence = [nodes_raw[nid]["data"]["nodeType"] for nid in order]

    if actual_sequence != expected_sequence:
        raise ValueError(f"Invalid node execution order: expected {expected_sequence}, got {actual_sequence}")


# ──────────────────────────────────────────────────────────
# Improved Calculation Mode Detection
# ──────────────────────────────────────────────────────────
def detect_calculation_mode_from_instances(feed: Feed, pipe: Pipe, product: Product) -> CalculationMode:
    """
    Determine calculation mode based on component instances.
    Returns the calculation mode and validates parameter completeness.
    """
    has_inlet_p = feed.pressure is not None
    has_outlet_p = product.get_outlet_pressure() is not None
    has_flow = pipe.mass_flowrate is not None

    if has_inlet_p and has_flow and not has_outlet_p:
        return CalculationMode.OUTLET_PRESSURE
    elif has_outlet_p and has_flow and not has_inlet_p:
        return CalculationMode.INLET_PRESSURE
    elif has_inlet_p and has_outlet_p and not has_flow:
        return CalculationMode.FLOW_RATE
    else:
        raise ValueError(
            "Invalid parameter combination. Must provide exactly two of:\n"
            "1. Inlet pressure + flow rate (calculate outlet pressure)\n"
            "2. Outlet pressure + flow rate (calculate required inlet pressure)\n"
            "3. Inlet + outlet pressures (calculate max flow rate)\n"
            f"Current state - Inlet: {'provided' if has_inlet_p else 'missing'}, "
            f"Outlet: {'provided' if has_outlet_p else 'missing'}, "
            f"Flow: {'provided' if has_flow else 'missing'}"
        )


# ──────────────────────────────────────────────────────────
# Case-Specific Solvers (unchanged)
# ──────────────────────────────────────────────────────────
def solve_outlet_pressure(pipe: Pipe, inlet_pressure: float) -> Dict[str, Any]:
    """Case 1: Calculate outlet pressure given inlet pressure and flow"""
    pipe_results = pipe.solve()
    outlet_pressure = inlet_pressure - pipe_results["pressure_drop_Pa"]
    
    return {
        **pipe_results,
        "inlet_pressure_Pa": inlet_pressure,
        "outlet_pressure_Pa": outlet_pressure,
        "calculation_mode": "outlet_pressure"
    }


def solve_inlet_pressure(pipe: Pipe, outlet_pressure: float) -> Dict[str, Any]:
    """Case 2: Calculate required inlet pressure given outlet pressure and flow"""
    pipe_results = pipe.solve()
    required_inlet_p = (outlet_pressure + pipe_results["pressure_drop_Pa"])
    print(outlet_pressure)
    print(pipe_results, required_inlet_p)
    
    return {
        **pipe_results,
        "inlet_pressure_Pa": required_inlet_p,
        "outlet_pressure_Pa": outlet_pressure,
        "calculation_mode": "inlet_pressure"
    }


def solve_flow_rate(pipe: Pipe, 
                   inlet_pressure: float, 
                   outlet_pressure: float,
                   max_iter: int = 100,
                   tol: float = 1e-5) -> Dict[str, Any]:
    """Case 3: Calculate maximum possible flow rate given pressure difference"""
    # Initial guesses
    min_flow = 0
    max_flow = 10000  # kg/h, arbitrary large value
    best_flow = 0
    best_diff = float('inf')
    
    # Create a copy of pipe parameters
    pipe_params = {
        "id": pipe.id,
        "inner_diameter": pipe.D,
        "length": pipe.L,
        "roughness": pipe.epsilon,
        "density": pipe.rho,
        "viscosity_cp": pipe.mu_cp,
    }
    
    for _ in range(max_iter):
        test_flow = (min_flow + max_flow) / 2
        pipe_params["massFlowRate"] = test_flow
        
        test_pipe = Pipe(**pipe_params)
        pipe_results = test_pipe.solve()
        calculated_drop = pipe_results["pressure_drop_Pa"]
        actual_drop = inlet_pressure - outlet_pressure
        
        diff = abs(calculated_drop - actual_drop)
        
        if diff < tol:
            break
            
        if calculated_drop < actual_drop:
            min_flow = test_flow
        else:
            max_flow = test_flow
            
        if diff < best_diff:
            best_diff = diff
            best_flow = test_flow
    
    # Update the original pipe with calculated flow rate
    pipe.mass_flowrate = best_flow
    pipe_results = pipe.solve()
    
    return {
        **pipe_results,
        "inlet_pressure_Pa": inlet_pressure,
        "outlet_pressure_Pa": outlet_pressure,
        "calculation_mode": "flow_rate"
    }


def to_float(value: Any) -> Optional[float]:
    """Safely convert to float, preserving None"""
    try:
        return float(value) if value is not None else None
    except (TypeError, ValueError):
        return None


# ──────────────────────────────────────────────────────────
# Improved Flowsheet Execution
# ──────────────────────────────────────────────────────────
def execute_flowsheet_extended(flowsheet: Dict[str, Any]) -> Dict[str, Any]:
    """
    Improved version that:
    1. First creates all component instances
    2. Then detects calculation mode based on instances
    3. Performs the appropriate calculations
    """
    nodes_raw = {n["id"]: n for n in flowsheet["nodes"]}
    edges = flowsheet["edges"]
    order = traversal_order(flowsheet["nodes"], edges)
    
    validate_order(order, nodes_raw)
    
    results: Dict[str, Any] = {}
    
    # Get node IDs from the order
    feed_id = next(nid for nid in order if nodes_raw[nid]["data"]["nodeType"] == "feed")
    pipe_id = next(nid for nid in order if nodes_raw[nid]["data"]["nodeType"] == "pipe")
    product_id = next(nid for nid in order if nodes_raw[nid]["data"]["nodeType"] == "product")
    
    # Get node data with proper null checks
    feed_data = nodes_raw[feed_id]["data"]
    pipe_data = nodes_raw[pipe_id]["data"]
    product_data = nodes_raw[product_id]["data"]
    
    feed_params = feed_data.get("params", {})
    pipe_params = pipe_data.get("params", {})
    product_params = product_data.get("params", {})
    
    # Create component instances first
    feed = Feed(
        id=feed_id,
        fluid_type=feed_params.get("fluid_type", "unknown"),
        pressure=to_float(feed_params.get("pressure"))
    )
    
    pipe = Pipe(
        id=pipe_id,
        inner_diameter=to_float(pipe_params.get("diameter", 0)),
        length=to_float(pipe_params.get("length", 0)),
        roughness=to_float(pipe_params.get("roughness", 0)),
        mass_flowrate=to_float(pipe_params.get("massFlowRate")),
        density=to_float(pipe_params.get("density", 0)),
        viscosity_cp=to_float(pipe_params.get("viscosity", 0)),
    )
    
    product = Product(
        id=product_id,
        outlet_pressure=to_float(product_params.get("pressure"))
    )

    # print(feed, pipe, product)
    
    try:
        # Detect calculation mode based on component instances
        mode = detect_calculation_mode_from_instances(feed, pipe, product)
        
        # Perform calculations based on mode
        if mode == CalculationMode.OUTLET_PRESSURE:
            if feed.pressure is None:
                raise ValueError("Feed pressure is required for outlet pressure calculation")
            if pipe.Q is None:
                raise ValueError("Mass flow rate is required for outlet pressure calculation")
                
            pipe_results = solve_outlet_pressure(pipe, feed.pressure)
            product.set_outlet_pressure(pipe_results["outlet_pressure_Pa"])
            
        elif mode == CalculationMode.INLET_PRESSURE:
            if product.get_outlet_pressure() is None:
                raise ValueError("Product pressure is required for inlet pressure calculation")
            if pipe.mass_flowrate is None:
                raise ValueError("Mass flow rate is required for inlet pressure calculation")
                
            pipe_results = solve_inlet_pressure(pipe, product.get_outlet_pressure())
            feed.pressure = pipe_results["inlet_pressure_Pa"]
            
        elif mode == CalculationMode.FLOW_RATE:
            if feed.pressure is None:
                raise ValueError("Feed pressure is required for flow rate calculation")
            if product.get_outlet_pressure() is None:
                raise ValueError("Product pressure is required for flow rate calculation")
                
            pipe_results = solve_flow_rate(
                pipe,
                feed.pressure,
                product.get_outlet_pressure()
            )
            print(pipe_results)
        
        # Store results
        results[feed_id] = {
            "node_type": "feed",
            "pressure": feed.pressure,
            "fluid_type": feed.fluid_type
        }
        
        results[pipe_id] = {
            "node_type": "pipe",
            **pipe_results
        }
        
        results[product_id] = {
            "node_type": "product",
            "inlet_pressure_Pa": pipe_results.get("inlet_pressure_Pa"),
            "outlet_pressure_Pa": pipe_results.get("outlet_pressure_Pa"),
            "pressure_drop_Pa": pipe_results.get("pressure_drop_Pa")
        }
        
        return {
            "order": order,
            "results": results,
            "calculation_mode": mode.name
        }
        
    except Exception as e:
        print(e)
        return {
            "error": str(e),
            "order": order,
            "results": {},
            "calculation_mode": "error"
        }
