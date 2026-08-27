// Utilities for generating clock times and converting them into the way
// Norwegians read an analog clock out loud (bokmål).

export type Level = 'hele' | 'halve' | 'kvarter' | 'fem'

export interface ClockTime {
  /** Hour on a 12-hour clock, 1..12. */
  hour: number
  /** Minutes, always a multiple of 5 here (0..55). */
  minute: number
}

/** Norwegian names for the hours on a 12-hour dial. */
const HOUR_NAMES = [
  'tolv', // index 0 -> 12
  'ett',
  'to',
  'tre',
  'fire',
  'fem',
  'seks',
  'sju',
  'åtte',
  'ni',
  'ti',
  'elleve',
  'tolv',
]

export function hourName(hour12: number): string {
  const idx = ((hour12 % 12) + 12) % 12
  return HOUR_NAMES[idx === 0 ? 12 : idx]
}

/** The next hour on a 12-hour dial (12 -> 1). */
function nextHour(hour12: number): number {
  return hour12 === 12 ? 1 : hour12 + 1
}

/**
 * Convert a time into the standard Norwegian spoken form, e.g.
 * 12:30 -> "halv ett", 9:45 -> "kvart på ti".
 */
export function toNorwegian({ hour, minute }: ClockTime): string {
  const h = hourName(hour)
  const next = hourName(nextHour(hour))

  switch (minute) {
    case 0:
      return h
    case 5:
      return `fem over ${h}`
    case 10:
      return `ti over ${h}`
    case 15:
      return `kvart over ${h}`
    case 20:
      return `ti på halv ${next}`
    case 25:
      return `fem på halv ${next}`
    case 30:
      return `halv ${next}`
    case 35:
      return `fem over halv ${next}`
    case 40:
      return `ti over halv ${next}`
    case 45:
      return `kvart på ${next}`
    case 50:
      return `ti på ${next}`
    case 55:
      return `fem på ${next}`
    default:
      // Fallback for non 5-minute values (not used by the generator).
      return `${h} ${minute}`
  }
}

/** Digital representation such as "09:05". */
export function toDigital({ hour, minute }: ClockTime): string {
  const hh = String(hour).padStart(2, '0')
  const mm = String(minute).padStart(2, '0')
  return `${hh}:${mm}`
}

/** Allowed minute values for each difficulty level. */
export function minutesForLevel(level: Level): number[] {
  switch (level) {
    case 'hele':
      return [0]
    case 'halve':
      return [0, 30]
    case 'kvarter':
      return [0, 15, 30, 45]
    case 'fem':
      return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  }
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/** Generate a random time for the given difficulty level. */
export function randomTime(level: Level): ClockTime {
  const hour = 1 + Math.floor(Math.random() * 12)
  const minute = pick(minutesForLevel(level))
  return { hour, minute }
}

function sameTime(a: ClockTime, b: ClockTime): boolean {
  return a.hour === b.hour && a.minute === b.minute
}

/**
 * Build a set of multiple-choice options for a quiz: the correct time plus
 * `count - 1` distractors, all distinct, shuffled.
 */
export function makeOptions(correct: ClockTime, level: Level, count = 4): ClockTime[] {
  const options: ClockTime[] = [correct]
  let guard = 0
  while (options.length < count && guard < 200) {
    guard += 1
    const candidate = randomTime(level)
    if (!options.some((o) => sameTime(o, candidate))) {
      options.push(candidate)
    }
  }
  // Fisher–Yates shuffle.
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  return options
}
