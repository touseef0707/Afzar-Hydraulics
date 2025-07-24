"use client";

import { FC } from "react";

interface NodeResultProps {
    result: any;
    nodeType?: string;
}

const LineItem = ({
    label,
    value,
    unit,
    precision = 2,
}: {
    label: string;
    value: string | number;
    unit?: string;
    precision?: number;
}) => {
    const formattedValue = typeof value === 'number' 
        ? value.toFixed(precision) 
        : value;
        
    return (
        <div className="flex justify-between text-white/90 text-[11px] leading-tight gap-2">
            <span className="text-gray-300 whitespace-nowrap">{label}:</span>
            <span className="text-right whitespace-nowrap">
                {formattedValue} {unit && <span className="text-gray-400">{unit}</span>}
            </span>
        </div>
    );
};

const formatFeedResult = (result: any) => {
    const { fluidType, density, viscosity, pressure, mass_flow_rate_kg_h } = result;

    return (
        <div className="space-y-1">
            {fluidType && <LineItem label="Fluid Type" value={fluidType} />}
            {density !== undefined && (
                <LineItem label="Density" value={density} unit="kg/m³" precision={1} />
            )}
            {viscosity !== undefined && (
                <LineItem label="Viscosity" value={viscosity} unit="cP" precision={2} />
            )}
            {pressure !== undefined && (
                <LineItem 
                    label="Pressure" 
                    value={pressure / 1000} 
                    unit="kPa" 
                    precision={3} 
                />
            )}
            {mass_flow_rate_kg_h !== undefined && (
                <LineItem 
                    label="Mass Flow" 
                    value={mass_flow_rate_kg_h} 
                    unit="kg/h" 
                    precision={1}
                />
            )}
        </div>
    );
};

const formatPipeResult = (result: any) => {
    const {
        head_loss_m,
        friction_factor,
        pressure_drop_Pa,
        flow_velocity_m_s,
        flow_regime,
        reynolds_number,
        mass_flow_rate_kg_h,
        volumetric_flow_rate_m3_h,
        inlet_pressure_Pa,
        outlet_pressure_Pa,
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
                    label="Outlet Pressure"
                    value={(outlet_pressure_Pa/1000).toFixed(2)}
                    unit="kPa"
                />
            )}

        </div>
    );
};

const NodeResult: FC<NodeResultProps> = ({ result, nodeType }) => {
    if (!result || Object.keys(result).length === 0) {
        return (
            <div className="mt-2 bg-gray-600 rounded-md p-2 border border-gray-700 shadow-inner inline-block">
                <span className="text-gray-300 text-[11px]">No data available</span>
            </div>
        );
    }

    const renderContent = () => {
        switch (nodeType) {
            case "feed":
                return formatFeedResult(result);
            case "pipe":
                return formatPipeResult(result);
            case "product":
                return formatProductResult(result);
            default:
                return (
                    <pre className="text-[11px] text-gray-300 whitespace-pre-wrap break-words">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                );
        }
    };

    return (
        <div className="mt-2 bg-gray-600 rounded-md p-2 border border-gray-700 shadow-inner inline-block min-w-[200px]">
            {renderContent()}
        </div>
    );
};

export default NodeResult;