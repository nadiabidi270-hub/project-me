import React, { useState } from 'react';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
}

const Slice: React.FC<{
  item: PieChartData;
  startAngle: number;
  endAngle: number;
  isHovered: boolean;
}> = ({ item, startAngle, endAngle, isHovered }) => {
  const radius = 80;
  const pathRadius = isHovered ? radius + 5 : radius;
  const innerRadius = 40;

  const getCoordinates = (angle: number, r: number) => {
    return {
      x: 100 + r * Math.cos(angle * Math.PI / 180),
      y: 100 + r * Math.sin(angle * Math.PI / 180),
    };
  };

  const startOuter = getCoordinates(startAngle, pathRadius);
  const endOuter = getCoordinates(endAngle, pathRadius);
  const startInner = getCoordinates(startAngle, innerRadius);
  const endInner = getCoordinates(endAngle, innerRadius);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  const d = [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${pathRadius} ${pathRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');

  return <path d={d} fill={item.color} className="transition-all duration-200" />;
};


export const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if(total === 0) {
        return <div className="text-center text-text-secondary py-8">No data to display in chart.</div>
    }

    let currentAngle = -90;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative">
                <svg viewBox="0 0 200 200" width="200" height="200">
                    <g>
                        {data.map(item => {
                            const sliceAngle = (item.value / total) * 360;
                            const startAngle = currentAngle;
                            currentAngle += sliceAngle;
                            const endAngle = currentAngle;

                            return (
                                <g
                                    key={item.name}
                                    onMouseEnter={() => setHoveredSlice(item.name)}
                                    onMouseLeave={() => setHoveredSlice(null)}
                                >
                                    <Slice
                                        item={item}
                                        startAngle={startAngle}
                                        endAngle={endAngle}
                                        isHovered={hoveredSlice === item.name}
                                    />
                                </g>
                            );
                        })}
                    </g>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col text-center pointer-events-none">
                    <span className="text-3xl font-bold text-text-main">{total}</span>
                    <span className="text-sm text-text-secondary">Total Assets</span>
                </div>
            </div>
            <div className="w-full md:w-56 space-y-2">
                {data.map(item => (
                    <div 
                        key={item.name}
                        className={`p-2 rounded-md transition-all duration-200 ${hoveredSlice === item.name ? 'bg-gray-100' : ''}`}
                        onMouseEnter={() => setHoveredSlice(item.name)}
                        onMouseLeave={() => setHoveredSlice(null)}
                    >
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span className="text-text-secondary">{item.name}</span>
                            </div>
                            <span className="font-semibold text-text-main">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
