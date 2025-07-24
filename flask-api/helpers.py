"""
helpers.py
-----------
Graph traversal utilities and the main flowsheet-execution
function that wires together node data with the Pipe
hydraulics model.
"""
from __future__ import annotations

import math
from collections import defaultdict, deque
from typing import Dict, List, Any, Optional

from components.Pipe import Pipe


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


def validate_order(order: List[str], nodes_raw: Dict[str, Any]) -> None:
    """Validate node sequence matches expected process flow."""
    expected_sequence = ["feed", "pipe", "product"]
    actual_sequence = [nodes_raw[nid]["data"]["nodeType"] for nid in order]

    if actual_sequence != expected_sequence:
        raise ValueError(
            f"Invalid node execution order: expected {expected_sequence}, got {actual_sequence}"
        )


# ──────────────────────────────────────────────────────────
# 2.  Solver orchestration – walks the graph in order and
#     runs Pipe calculations (extend with other unit ops)
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
          "order":   [node_id, ...],
          "results": {node_id: result_dict, ...},
          "warnings": [str, ...]
        }
    """
    nodes_raw = {n["id"]: n for n in flowsheet["nodes"]}
    edges = flowsheet["edges"]
    order = traversal_order(flowsheet["nodes"], edges)
    validate_order(order, nodes_raw)

    results: Dict[str, Any] = {}
    warnings: List[str] = []
    current_pressure = 0.0  # Track pressure through the system

    for node_id in order:
        ndata = nodes_raw[node_id]["data"]
        ntype = ndata["nodeType"]
        params = ndata.get("params", {})

        if ntype == "feed":
            # copy-safe access
            results[node_id] = dict(ndata.get("params", {}))
            print(results[node_id])


            elif ntype == "pipe":
                # Get upstream conditions
                upstream_id = next(
                    e["source"] for e in edges if e["target"] == node_id
                )
                feed = results[upstream_id]

            pipe = Pipe(
                inner_diameter      = float(p["diameter"]),
                length              = float(p["length"]),
                roughness           = float(p["roughness"]),
                mass_flowrate       = float(p["massFlowRate"]),
                density             = float(p["density"]),
                viscosity_cp        = float(p["viscosity"]),
            )
            
            results[node_id] = pipe.solve()

            elif ntype == "product":
                upstream_id = next(
                    e["source"] for e in edges if e["target"] == node_id
                )
                results[node_id] = {
                    "pressure_Pa": current_pressure,
                    "status": "OK",
                    "upstream_node": upstream_id
                }

            else:
                raise NotImplementedError(f"Unknown node type '{ntype}'")

        except (ValueError, KeyError, TypeError) as e:
            warnings.append(f"Error processing {node_id} ({ntype}): {str(e)}")
            results[node_id] = {"error": str(e)}

    return {
        "order": order,
        "results": results,
        "warnings": warnings,
        "success": len(warnings) == 0
    }


def print_hydraulic_report(report: dict) -> None:
    """Generate a comprehensive human-readable report."""
    print("\n🔍 Hydraulic Simulation Report")
    print("=" * 50)

    # Print summary information
    print(f"\n📋 Summary:")
    print("-" * 50)
    print(f"{'Nodes processed':30}: {len(report['order'])}")
    print(f"{'Success':30}: {'✅' if report['success'] else '❌'}")
    if report['warnings']:
        print(f"{'Warnings':30}: {len(report['warnings'])}")

    # Print detailed results for each node
    for node_id in report["order"]:
        node_data = report["results"].get(node_id, {})
        node_type = node_id.split("_")[0].capitalize()
        
        print(f"\n📌 {node_type} ({node_id}):")
        print("-" * 50)
        
        if "error" in node_data:
            print(f"❌ Error: {node_data['error']}")
            continue
            
        for key, value in node_data.items():
            readable_key = key.replace("_", " ").title()
            
            # Special formatting for different value types
            if isinstance(value, float):
                if "pressure" in key:
                    print(f"{readable_key:30}: {value/1000:.3f} kPa")
                elif "flow" in key and ("m3" in key or "kg" in key):
                    print(f"{readable_key:30}: {value:.3f} {'m³/h' if 'm3' in key else 'kg/h'}")
                else:
                    print(f"{readable_key:30}: {value:.4f}")
            else:
                print(f"{readable_key:30}: {value}")

    # Print warnings if any
    if report["warnings"]:
        print("\n⚠️ Warnings:")
        print("-" * 50)
        for warning in report["warnings"]:
            print(f"- {warning}")

    print("=" * 50 + "\n✅ Report generation complete.\n")