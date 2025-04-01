
import React from 'react';

interface SparklineProps {
  data: number[];
  height?: number;
  width?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, height = 30, width = 100 }) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Prevent division by zero
  
  const normalizedData = data.map(value => 
    1 - ((value - min) / range)
  );

  // Create path data
  let pathData = '';
  normalizedData.forEach((point, index) => {
    const x = (index / (normalizedData.length - 1)) * width;
    const y = point * height;
    if (index === 0) {
      pathData += `M ${x},${y}`;
    } else {
      pathData += ` L ${x},${y}`;
    }
  });

  return (
    <div className="sparkline-container">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path 
          d={pathData} 
          className="sparkline"
        />
      </svg>
    </div>
  );
};

export default Sparkline;
