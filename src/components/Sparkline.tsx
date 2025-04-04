import React from 'react';

interface SparklineProps {
  data: number[];
  height?: number;
  width?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, height = 30, width = 100 }) => {
  if (!data || data.length === 0) return null;

  const DAYS = 7;
  // Take last 7 points if we have more
  const recentData = data.length > DAYS ? data.slice(-DAYS) : data;

  const min = Math.min(...recentData);
  const max = Math.max(...recentData);
  const range = max - min || 1; // Prevent division by zero
  
  const normalizedData = recentData.map(value => 
    1 - ((value - min) / range)
  );

  // Create path data - position the line at the end of the timeline
  let pathData = '';
  normalizedData.forEach((point, index) => {
    // Calculate x position relative to the end of the timeline
    const startOffset = DAYS - recentData.length;
    const x = ((startOffset + index) / (DAYS - 1)) * width;
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
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default Sparkline;
