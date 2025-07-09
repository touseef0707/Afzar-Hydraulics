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

# Local import:  components/__init__.py exposes Pipe
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
          "results": {node_id: result_dict, ...}
        }
    """
    nodes_raw = {n["id"]: n for n in flowsheet["nodes"]}
    edges     = flowsheet["edges"]
    order     = traversal_order(flowsheet["nodes"], edges)

    results: Dict[str, Any] = {}

    for node_id in order:
        ndata = nodes_raw[node_id]["data"]
        ntype = ndata["nodeType"]

        if ntype == "feed":
            # copy-safe access
            results[node_id] = dict(ndata.get("params", {}))


        elif ntype == "pipe":
            p      = ndata["params"]
            # find immediate upstream node (assume single inlet)
            upstream_id = next(
                e["source"] for e in edges if e["target"] == node_id
            )
            feed = results[upstream_id]

            pipe = Pipe(
                inner_diameter      = float(p["diameter"]),
                length              = float(p["length"]),
                roughness           = float(p["roughness"]),
                volumetric_flowrate = float(p["volumetricFlowrate"]),
                density             = float(feed["density"]),
                viscosity_cp        = float(feed["viscosity"]),
            )
            results[node_id] = pipe.solve()

        elif ntype == "product":
            upstream_id = next(e["source"] for e in edges
                               if e["target"] == node_id)

            # default to an empty dict when 'params' is missing
            params = dict(ndata.get("params", {}))
            params["pressure_drop_Pa"] = results[upstream_id]["pressure_drop_Pa"]
            results[node_id] = params

        else:
            raise NotImplementedError(f"Unknown node type '{ntype}'")

    return {"order": order, "results": results}

