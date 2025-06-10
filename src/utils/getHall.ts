const halls = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const times = ['16:00', '18:40', '20:40']

export const getHallForMovie = (movieIndex: number, time: string): string => {
	const timeIndex = times.indexOf(time)
	if (timeIndex === -1) return '1'

	const hallIndex = (movieIndex * times.length + timeIndex) % halls.length
	return halls[hallIndex]
}
