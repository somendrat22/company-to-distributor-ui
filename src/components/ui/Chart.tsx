'use client'

import React from 'react'

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  height?: number
  showValues?: boolean
}

export function BarChart({ data, height = 200, showValues = true }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
              <div className="relative w-full flex items-end justify-center">
                {showValues && (
                  <span className="text-xs font-semibold text-gray-700 mb-1">
                    {item.value.toLocaleString()}
                  </span>
                )}
              </div>
              <div
                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: item.color || '#3B82F6',
                  minHeight: item.value > 0 ? '4px' : '0px'
                }}
              />
              <span className="text-xs text-gray-600 text-center mt-2 break-words">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface LineChartProps {
  data: Array<{ label: string; value: number }>
  height?: number
  color?: string
}

export function LineChart({ data, height = 200, color = '#3B82F6' }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value - minValue) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="w-full">
      <svg width="100%" height={height} className="overflow-visible">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - ((item.value - minValue) / range) * 100
          return (
            <g key={index}>
              <circle
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={color}
                className="hover:r-6 transition-all cursor-pointer"
              />
              <title>{`${item.label}: ${item.value.toLocaleString()}`}</title>
            </g>
          )
        })}
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-600">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

interface PieChartProps {
  data: Array<{ label: string; value: number; color: string }>
  size?: number
  showLegend?: boolean
}

export function PieChart({ data, size = 200, showLegend = true }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -90

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)
    const largeArc = angle > 180 ? 1 : 0

    return {
      ...item,
      percentage,
      path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`
    }
  })

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {slices.map((slice, index) => (
          <g key={index}>
            <path
              d={slice.path}
              fill={slice.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <title>{`${slice.label}: ${slice.value.toLocaleString()} (${slice.percentage.toFixed(1)}%)`}</title>
            </path>
          </g>
        ))}
      </svg>
      
      {showLegend && (
        <div className="grid grid-cols-2 gap-2 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-700 truncate">
                {item.label}: {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>
  size?: number
  centerText?: string
  centerValue?: string
}

export function DonutChart({ data, size = 200, centerText, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -90

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const outerRadius = 40
    const innerRadius = 25

    const startOuterX = 50 + outerRadius * Math.cos((startAngle * Math.PI) / 180)
    const startOuterY = 50 + outerRadius * Math.sin((startAngle * Math.PI) / 180)
    const endOuterX = 50 + outerRadius * Math.cos((endAngle * Math.PI) / 180)
    const endOuterY = 50 + outerRadius * Math.sin((endAngle * Math.PI) / 180)
    
    const startInnerX = 50 + innerRadius * Math.cos((endAngle * Math.PI) / 180)
    const startInnerY = 50 + innerRadius * Math.sin((endAngle * Math.PI) / 180)
    const endInnerX = 50 + innerRadius * Math.cos((startAngle * Math.PI) / 180)
    const endInnerY = 50 + innerRadius * Math.sin((startAngle * Math.PI) / 180)

    const largeArc = angle > 180 ? 1 : 0

    return {
      ...item,
      percentage,
      path: `M ${startOuterX} ${startOuterY} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuterX} ${endOuterY} L ${startInnerX} ${startInnerY} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInnerX} ${endInnerY} Z`
    }
  })

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.path}
            fill={slice.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>{`${slice.label}: ${slice.value.toLocaleString()} (${slice.percentage.toFixed(1)}%)`}</title>
          </path>
        ))}
        
        {/* Center text */}
        {(centerText || centerValue) && (
          <g>
            {centerValue && (
              <text
                x="50"
                y="48"
                textAnchor="middle"
                className="text-xl font-bold fill-gray-900"
                style={{ fontSize: '12px' }}
              >
                {centerValue}
              </text>
            )}
            {centerText && (
              <text
                x="50"
                y="58"
                textAnchor="middle"
                className="text-xs fill-gray-600"
                style={{ fontSize: '6px' }}
              >
                {centerText}
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  )
}
