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

        try:
            if ntype == "feed":
                # copy-safe access
                results[node_id] = dict(ndata.get("params", {}))
                current_pressure = results[node_id].get("pressure_Pa", 0.0)

            elif ntype == "pipe":
                # Get upstream conditions
                upstream_id = next(
                    e["source"] for e in edges if e["target"] == node_id
                )
                feed = results[upstream_id]

                pipe = Pipe(
                    inner_diameter=float(params["diameter"]),
                    length=float(params["length"]),
                    roughness=float(params["roughness"]),
                    mass_flowrate=float(params["massFlowRate"]),
                    density=float(params["density"]),
                    viscosity_cp=float(params["viscosity"]),
                    inlet_pressure=current_pressure
                )
                
                pipe_results = pipe.solve()
                results[node_id] = pipe_results
                current_pressure = pipe_results["outlet_pressure_Pa"]

            elif ntype == "product":
                upstream_id = next(
                    e["source"] for e in edges if e["target"] == node_id
                )
                results[node_id] = {
                    "pressure_Pa": current_pressure,
                    "status": "OK",
                    "upstream_node": upstream_id
                }

        except StopIteration:
            warnings.append(f"Node {node_id} has no upstream connection")
            results[node_id] = {"error": "Missing upstream connection"}
        except (ValueError, KeyError, TypeError) as e:
            warnings.append(f"Error processing {node_id} ({ntype}): {str(e)}")
            results[node_id] = {"error": str(e)}

    return {
        "order": order,
        "results": results,
        "warnings": warnings,
        "success": len(warnings) == 0
    }