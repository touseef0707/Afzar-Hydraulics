"use client";

import { FC } from "react";

// Props definition for the NodeResult component
interface NodeResultProps {
    result: any;
    nodeType?: string;
}

// Reusable UI row component to display a label, value, and optional unit
const LineItem = ({
    label,
    value,
    unit,
}: {
    label: string;
    value: string | number;
    unit?: string;
}) => (
    <div className="flex justify-between text-white/90 text-[11px] leading-tight gap-2">
        <span className="text-gray-300 whitespace-nowrap">{label}:</span>
        <span className="text-right whitespace-nowrap">
            {value} {unit}
        </span>
    </div>
);

// Format result data specific to 'feed' node type
const formatFeedResult = (result: any) => {
    const { fluidType, density, viscosity, pressure } = result;

    return (
        <div className="space-y-1">
            {fluidType && <LineItem label="Fluid Type" value={fluidType} />}
            {density !== undefined && (
                <LineItem label="Density" value={density} unit="kg/m³" />
            )}
            {viscosity !== undefined && (
                <LineItem label="Viscosity" value={viscosity} unit="cP" />
            )}
            {pressure !== undefined && (
                <LineItem label="Inlet Pressure P1" value={pressure} unit="kPa" />
            )}
        </div>
    );
};

// Format result data specific to 'pipe' node type
const formatPipeResult = (result: any) => {
    const {
        head_loss_m,
        friction_factor,
        pressure_drop_Pa,
        flow_velocity_m_s,
        flow_regime,
        reynolds_number,
    } = result;

    return (
        <div className="space-y-1">
            {head_loss_m !== undefined && (
                <LineItem label="Head Loss" value={head_loss_m.toFixed(4)} unit="m" />
            )}
            {friction_factor !== undefined && (
                <LineItem
                    label="Friction Factor"
                    value={friction_factor.toFixed(6)}
                />
            )}
            {pressure_drop_Pa !== undefined && (
                <LineItem
                    label="Pressure Drop"
                    value={(pressure_drop_Pa/1000).toFixed(2)}
                    unit="kPa"
                />
            )}
            {flow_velocity_m_s !== undefined && (
                <LineItem
                    label="Flow Velocity"
                    value={flow_velocity_m_s.toFixed(3)}
                    unit="m/s"
                />
            )}
            {flow_regime && <LineItem label="Flow Regime" value={flow_regime} />}
            {reynolds_number !== undefined && (
                <LineItem
                    label="Reynolds #"
                    value={reynolds_number.toFixed(2)}
                />
            )}
        </div>
    );
};

// Format result data specific to 'product' node type
const formatProductResult = (result: any) => {
    const { pressure_drop_Pa, outlet_pressure_Pa } = result;
    return (
        <div className="space-y-1">
            {pressure_drop_Pa !== undefined && (
                <LineItem
                    label="Pressure Drop"
                    value={(pressure_drop_Pa/1000).toFixed(2)}
                    unit="kPa"
                />
            )}
            {outlet_pressure_Pa !== undefined && (
                <LineItem
                    label="Outlet Pressure P2"
                    value={(outlet_pressure_Pa/1000).toFixed(2)}
                    unit="kPa"
                />
            )}

        </div>
    );
};

const NodeResult: FC<NodeResultProps> = ({ result, nodeType }) => {
    // Don't render anything if result is undefined or null
    if (!result) return null;

    // Choose the correct formatter based on node type
    const renderContent = () => {
        switch (nodeType) {
            case "feed":
                return formatFeedResult(result);
            case "pipe":
                return formatPipeResult(result);
            case "product":
                return formatProductResult(result);

            // Fallback: render raw JSON for unsupported node types
            default:
                return (
                    <pre className="text-[11px] text-gray-300 whitespace-pre-wrap break-words">
                        {typeof result === "object"
                            ? JSON.stringify(result, null, 2)
                            : String(result)}
                    </pre>
                );
        }
    };

    // Wrapper around the rendered node result with styling
    return (
        <div className="mt-2 bg-gray-600 rounded-md p-2 border border-gray-700 shadow-inner inline-block">
            {renderContent()}
        </div>
    );
};

export default NodeResult;
