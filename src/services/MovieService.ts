import { AxiosResponse } from 'axios'
import $api from '../http'
import { IMovie } from '../models/IMovie'

export default class MovieService {
	static async fetchMovies(): Promise<AxiosResponse<IMovie[]>> {
		return $api.get<IMovie[]>('/movies')
	}

	static async getOneMovie(id: string): Promise<AxiosResponse<IMovie>> {
		return $api.get<IMovie>(`/movies/${id}`)
	}
}
