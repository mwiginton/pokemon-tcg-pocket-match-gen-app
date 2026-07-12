export type StatsPeriodMode = 'all' | 'year' | 'month'

export type StatsPeriod = {
  mode: StatsPeriodMode
  year: string
  month: string
}

type DatedRow = {
  created_at: string
}

const getYearKey = (value: string) => new Date(value).getFullYear().toString()

const getMonthKey = (value: string) => {
  const date = new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const getAvailableYears = <T extends DatedRow>(rows: T[]) =>
  Array.from(new Set(rows.map((row) => getYearKey(row.created_at)))).sort((a, b) =>
    b.localeCompare(a),
  )

export const getAvailableMonths = <T extends DatedRow>(rows: T[], year?: string) =>
  Array.from(
    new Set(
      rows
        .filter((row) => !year || getYearKey(row.created_at) === year)
        .map((row) => getMonthKey(row.created_at)),
    ),
  ).sort((a, b) => b.localeCompare(a))

export const formatStatsMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1))
}

export const getEffectiveStatsPeriod = (
  period: StatsPeriod,
  availableYears: string[],
  availableMonths: string[],
): StatsPeriod => {
  const year = period.year || availableYears[0] || ''
  const month = availableMonths.includes(period.month)
    ? period.month
    : availableMonths[0] || ''

  return {
    mode: period.mode,
    year,
    month,
  }
}

export const gameMatchesStatsPeriod = (createdAt: string, period: StatsPeriod) => {
  if (period.mode === 'all') return true
  if (period.mode === 'year') return period.year ? getYearKey(createdAt) === period.year : true
  return period.month ? getMonthKey(createdAt) === period.month : true
}

export const getStatsPeriodLabel = (period: StatsPeriod) => {
  if (period.mode === 'year') return period.year || 'selected year'
  if (period.mode === 'month') return period.month ? formatStatsMonthLabel(period.month) : 'selected month'
  return 'all time'
}
