export const startDateUTC = new Date(Date.UTC(2025, 5, 9, 21, 0, 0))
const msPerWeek = 7 * 24 * 60 * 60 * 1000

export const getActiveMovieIndexes = (weekOffset: number = 0): number[] => {
	const now = new Date()
	const rawDiff = (+now - +startDateUTC) / msPerWeek
	const weekDiff = Math.max(0, Math.floor(rawDiff)) + weekOffset
	const baseIndex = (weekDiff * 3) % 9
	return [baseIndex, (baseIndex + 1) % 9, (baseIndex + 2) % 9]
}

export const getWeekRange = (weekOffset: number): string => {
	const start = new Date(startDateUTC.getTime() + weekOffset * msPerWeek)
	const end = new Date(start.getTime() + msPerWeek)
	const options: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		weekday: 'long',
	}
	return `From ${start.toLocaleDateString(
		'en-US',
		options
	)} to ${end.toLocaleDateString('en-US', options)}`
}
