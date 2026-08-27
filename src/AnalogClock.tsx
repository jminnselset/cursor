import type { ClockTime } from './time'

interface AnalogClockProps {
  time: ClockTime
  size?: number
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** A retro neon SVG analog clock face. */
export default function AnalogClock({ time, size = 300 }: AnalogClockProps) {
  const c = size / 2
  const r = size / 2 - 8

  const minuteAngle = time.minute * 6
  // The hour hand moves gradually as the minutes pass.
  const hourAngle = ((time.hour % 12) + time.minute / 60) * 30

  const hourHand = polar(c, c, r * 0.5, hourAngle)
  const minuteHand = polar(c, c, r * 0.78, minuteAngle)

  const ticks = Array.from({ length: 60 }, (_, i) => i)
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <svg
      className="clock"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Analog klokke"
    >
      <defs>
        <radialGradient id="face" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#241653" />
          <stop offset="100%" stopColor="#140a30" />
        </radialGradient>
      </defs>

      <circle cx={c} cy={c} r={r} fill="url(#face)" stroke="#ff3caa" strokeWidth={6} />
      <circle cx={c} cy={c} r={r - 10} fill="none" stroke="#00e5ff" strokeWidth={1.5} opacity={0.5} />

      {ticks.map((i) => {
        const isHour = i % 5 === 0
        const outer = polar(c, c, r - 12, i * 6)
        const inner = polar(c, c, r - (isHour ? 26 : 18), i * 6)
        return (
          <line
            key={i}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke={isHour ? '#ffe600' : '#7a6fd8'}
            strokeWidth={isHour ? 3 : 1.5}
            strokeLinecap="round"
          />
        )
      })}

      {numbers.map((n) => {
        const p = polar(c, c, r - 42, n * 30)
        return (
          <text
            key={n}
            x={p.x}
            y={p.y}
            className="clock-number"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {n}
          </text>
        )
      })}

      {/* Hour hand */}
      <line
        x1={c}
        y1={c}
        x2={hourHand.x}
        y2={hourHand.y}
        stroke="#00e5ff"
        strokeWidth={7}
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={c}
        y1={c}
        x2={minuteHand.x}
        y2={minuteHand.y}
        stroke="#ffe600"
        strokeWidth={4}
        strokeLinecap="round"
      />

      <circle cx={c} cy={c} r={7} fill="#ff3caa" stroke="#fff" strokeWidth={1.5} />
    </svg>
  )
}
