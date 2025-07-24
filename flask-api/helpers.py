"""
helpers.py
-----------
Graph traversal utilities and the main flowsheet-execution
function that wires together node data with the Pipe
hydraulics model.

This module is **import-free** beyond the Python standard
library and your own `components.Pipe` implementation.
"""
from __future__ import annotations

import math
from collections import defaultdict, deque
from typing import Dict, List, Any

from components.Pipe import Pipe
from components.Feed import Feed
from components.Product import Product


# ──────────────────────────────────────────────────────────
# 1.  Topological traversal of an acyclic process network
# ──────────────────────────────────────────────────────────
def traversal_order(
    nodes: List[Dict[str, Any]],
    edges: List[Dict[str, Any]]
) -> List[str]:
    """
    Returns node IDs in strict upstream → downstream order.

    Raises
    ------
    ValueError
        If the graph has cycles or disconnected nodes.
    """
    adj: Dict[str, List[str]] = defaultdict(list)
    in_deg: Dict[str, int]    = defaultdict(int)

    for edge in edges:
        s, t = edge["source"], edge["target"]
        adj[s].append(t)
        in_deg[t] += 1
        in_deg.setdefault(s, 0)      # ensure presence

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
    expected_sequence = ["feed", "pipe", "product"]
    actual_sequence = [nodes_raw[nid]["data"]["nodeType"] for nid in order]

    if actual_sequence != expected_sequence:
        raise ValueError(f"Invalid node execution order: expected {expected_sequence}, got {actual_sequence}")

# ──────────────────────────────────────────────────────────
# 2.  Solver orchestration – walks the graph in order and
#     runs component calculations
# ──────────────────────────────────────────────────────────
def execute_flowsheet(flowsheet: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point consumed by the Flask backend.

    Parameters
    ----------
    flowsheet : dict
        Must contain top-level keys `"nodes"` and `"edges"` in
        the format produced by your front-end.

    Returns
    -------
    dict
        {
          "order": [node_id, ...],
          "results": {node_id: result_dict, ...}
        }
    """
    nodes_raw = {n["id"]: n for n in flowsheet["nodes"]}
    edges = flowsheet["edges"]
    order = traversal_order(flowsheet["nodes"], edges)

    validate_order(order, nodes_raw)

    results: Dict[str, Any] = {}
    components: Dict[str, Any] = {}

    for node_id in order:
        ndata = nodes_raw[node_id]["data"]
        ntype = ndata["nodeType"]
        params = ndata.get("params", {})

        if ntype == "feed":
            feed = Feed(
                id=node_id,
                fluid_type=params.get("fluid_type", "unknown"),
                pressure=float(params.get("pressure", 0))
            )
            components[node_id] = feed
            results[node_id] = {
                "node_type": "feed",
                "pressure": feed.pressure,
                "fluid_type": feed.fluid_type
            }

        elif ntype == "pipe":
            # Find upstream component (assume single inlet)
            upstream_id = next(
                e["source"] for e in edges if e["target"] == node_id
            )
            upstream_pressure = results[upstream_id]["pressure"]

            pipe = Pipe(
                id=node_id,
                inner_diameter=float(params["diameter"]),
                length=float(params["length"]),
                roughness=float(params["roughness"]),
                mass_flowrate=float(params["massFlowRate"]),
                density=float(params["density"]),
                viscosity_cp=float(params["viscosity"]),
            )
            components[node_id] = pipe
            pipe_results = pipe.solve()
            pipe_results["node_type"] = "pipe"
            pipe_results["inlet_pressure_Pa"] = upstream_pressure * 1000  #pa
            pipe_results["outlet_pressure_Pa"] = upstream_pressure - pipe_results["pressure_drop_Pa"]
            results[node_id] = pipe_results

        elif ntype == "product":
            # Find upstream component (assume single inlet)
            upstream_id = next(
                e["source"] for e in edges if e["target"] == node_id
            )
            upstream_results = results[upstream_id]

            product = Product(
                id=node_id,
                outlet_pressure=float(params.get("outlet_pressure", 0))
            )
            
            # Calculate outlet pressure based on upstream and pressure drop
            product.calculate_outlet_pressure(
                inlet_pressure=upstream_results.get("inlet_pressure_Pa", 0),
                pressure_drop=upstream_results.get("pressure_drop_Pa", 0)
            )
            
            components[node_id] = product
            results[node_id] = {
                "node_type": "product",
                "inlet_pressure_Pa": upstream_results.get("inlet_pressure_Pa", 0),
                "pressure_drop_Pa": upstream_results.get("pressure_drop_Pa", 0),
                "outlet_pressure_Pa": product.get_outlet_pressure(),
            }

        else:
            raise NotImplementedError(f"Unknown node type '{ntype}'")

    return {
        "order": order,
        "results": results
    }

def print_hydraulic_report(report: dict):
    print("\n🔍 Hydraulic Simulation Report")
    print("=" * 50)

    order = report.get("order", [])
    results = report.get("results", {})

    for element_id in order:
        element_data = results.get(element_id, {})
        element_type = element_id.split("_")[0].capitalize()
        print(f"\n📌 {element_type} ({element_id}):")
        print("-" * 50)
        
        for key, value in element_data.items():
            # Format the key to be more readable
            readable_key = key.replace("_", " ").title()
            # Format floats with 4 decimal places
            if isinstance(value, float):
                print(f"{readable_key:30}: {value:.4f}")
            else:
                print(f"{readable_key:30}: {value}")
    
    print("=" * 50 + "\n✅ Report generation complete.\n")