import { useAppStore } from '@/store';
import { useMemo, memo } from 'react';

const COLORS = [
  { point: 'rgba(59, 130, 246, 1)', line: 'rgba(59, 130, 246, 0.5)', fill: 'rgba(59, 130, 246, 0.08)' },
  { point: 'rgba(16, 185, 129, 1)', line: 'rgba(16, 185, 129, 0.5)', fill: 'rgba(16, 185, 129, 0.08)' },
  { point: 'rgba(245, 158, 11, 1)', line: 'rgba(245, 158, 11, 0.5)', fill: 'rgba(245, 158, 11, 0.08)' },
  { point: 'rgba(239, 68, 68, 1)', line: 'rgba(239, 68, 68, 0.5)', fill: 'rgba(239, 68, 68, 0.08)' },
  { point: 'rgba(168, 85, 247, 1)', line: 'rgba(168, 85, 247, 0.5)', fill: 'rgba(168, 85, 247, 0.08)' },
  { point: 'rgba(236, 72, 153, 1)', line: 'rgba(236, 72, 153, 0.5)', fill: 'rgba(236, 72, 153, 0.08)' },
  { point: 'rgba(6, 182, 212, 1)', line: 'rgba(6, 182, 212, 0.5)', fill: 'rgba(6, 182, 212, 0.08)' },
  { point: 'rgba(249, 115, 22, 1)', line: 'rgba(249, 115, 22, 0.5)', fill: 'rgba(249, 115, 22, 0.08)' },
  { point: 'rgba(34, 197, 94, 1)', line: 'rgba(34, 197, 94, 0.5)', fill: 'rgba(34, 197, 94, 0.08)' },
  { point: 'rgba(139, 92, 246, 1)', line: 'rgba(139, 92, 246, 0.5)', fill: 'rgba(139, 92, 246, 0.08)' },
];

function RadarChart() {
  const profile = useAppStore((state) => state.profile);

  const skillLabels = Object.keys(profile.skills);
  const skillValues = Object.values(profile.skills);

  const { polygonPoints, axisLines, labels, gridLines, angles: computedAngles } = useMemo(() => {
    if (skillLabels.length === 0) {
      return { polygonPoints: '', axisLines: '', labels: [], gridLines: '', angles: [] };
    }

    const size = 280;
    const center = size / 2;
    const radius = 100;
    const levels = 5;

    const angles = skillLabels.map((_, i) => {
      const angle = (Math.PI * 2 * i) / skillLabels.length - Math.PI / 2;
      return angle;
    });

    const points = skillValues.map((value, i) => {
      const r = (value / 100) * radius;
      const x = center + r * Math.cos(angles[i]);
      const y = center + r * Math.sin(angles[i]);
      return { x, y, value };
    });

    const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

    const axisLines = skillLabels.map((_, i) => {
      const color = COLORS[i % COLORS.length].line;
      const r = (skillValues[i] / 100) * radius;
      return `<line x1="${center}" y1="${center}" x2="${center + r * Math.cos(angles[i])}" y2="${center + r * Math.sin(angles[i])}" stroke="${color}" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>`;
    }).join('');

    const gridLines = Array.from({ length: levels }, (_, level) => {
      const r = ((level + 1) / levels) * radius;
      const pts = skillLabels.map((_, i) => {
        const x = center + r * Math.cos(angles[i]);
        const y = center + r * Math.sin(angles[i]);
        return `${x},${y}`;
      }).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>`;
    }).join('');

    const labels = skillLabels.map((label, i) => {
      const labelRadius = radius + 30;
      const x = center + labelRadius * Math.cos(angles[i]);
      const y = center + labelRadius * Math.sin(angles[i]);
      let textAnchor: 'start' | 'middle' | 'end' = 'middle';
      if (Math.abs(angles[i]) < 0.3 || Math.abs(angles[i] - Math.PI) < 0.3 || Math.abs(angles[i] + Math.PI) < 0.3) {
        textAnchor = 'middle';
      } else if (Math.cos(angles[i]) > 0) {
        textAnchor = 'start';
      } else {
        textAnchor = 'end';
      }
      return { x, y, label, textAnchor };
    });

    return { polygonPoints, axisLines, labels, gridLines, angles };
  }, [skillLabels, skillValues]);

  if (skillLabels.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">能力画像</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">完成测评后将展示你的能力画像</p>
        </div>
      </div>
    );
  }

  const size = 280;
  const center = size / 2;
  const radius = 100;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/80 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 relative z-10">能力画像</h3>
      <div className="flex justify-center relative z-10">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <filter id="pointGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g dangerouslySetInnerHTML={{ __html: gridLines }} />
          <g dangerouslySetInnerHTML={{ __html: axisLines }} />
          <polygon
            points={polygonPoints}
            fill="rgba(107, 114, 128, 0.1)"
            stroke="rgba(107, 114, 128, 0.4)"
            strokeWidth="1.5"
          />
          {skillValues.map((value, i) => {
            const angle = computedAngles[i];
            const r = (value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            const color = COLORS[i % COLORS.length].point;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill={color} stroke="#fff" strokeWidth="2" />
                <circle cx={x} cy={y} r="6" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
              </g>
            );
          })}
          {labels.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y={label.y}
              textAnchor={label.textAnchor}
              dominantBaseline="middle"
              className="text-sm"
              fill="#374151"
            >
              {label.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default memo(RadarChart);
