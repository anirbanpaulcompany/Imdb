import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export interface Movie {
  id: number;
  name: string;
  yearOfRelease: string;
  plot: string;
  producerId: number;
  actorIds: number[];
  poster: string;
}

export interface Producer {
  id: number;
  name: string;
  gender: string;
  dob: string;
  bio: string;
}

export interface Actor {
  id: number;
  name: string;
  gender: string;
  dob: string;
  bio: string;
}

const movieService = {
  getAllMovies: async (): Promise<Movie[]> => {
    try {
      const response: AxiosResponse<Movie[]> = await axios.get(`${BASE_URL}/movies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all movies:', error);
      throw error;
    }
  },

  getMovieById: async (movieId: number): Promise<Movie> => {
    try {
      const response: AxiosResponse<Movie> = await axios.get(`${BASE_URL}/movies/${movieId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error);
      throw error;
    }
  },

  addMovie: async (movieData: Movie): Promise<Movie> => {
    movieData.yearOfRelease = new Date(movieData.yearOfRelease).toISOString();

    try {
      const response: AxiosResponse<Movie> = await axios.post(`${BASE_URL}/movies`, movieData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding movie:', error);
      throw error;
    }
  },

  updateMovie: async (movieId: number, updatedMovieData: Movie): Promise<Movie> => {
    updatedMovieData.poster = 'mmmmm';

    try {
      const response: AxiosResponse<Movie> = await axios.put(`${BASE_URL}/movies/${movieId}`, updatedMovieData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating movie with ID ${movieId}:`, error);
      throw error;
    }
  },

  deleteMovie: async (movieId: number): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/movies/${movieId}`);
    } catch (error) {
      console.error(`Error deleting movie with ID ${movieId}:`, error);
      throw error;
    }
  },

  getAllActors: async (): Promise<Actor[]> => {
    try {
      const response: AxiosResponse<Actor[]> = await axios.get(`${BASE_URL}/actors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all actors:', error);
      throw error;
    }
  },

  createProducer: async (newProducerData: Omit<Producer, 'id'>): Promise<Producer> => {
    try {
      const response: AxiosResponse<Producer> = await axios.post(`${BASE_URL}/producers`, newProducerData);
      return response.data;
    } catch (error) {
      console.error('Error creating producer:', error);
      throw error;
    }
  },

  createActor: async (actorData: Omit<Actor, 'id'>): Promise<Actor> => {
    try {
      const response: AxiosResponse<Actor> = await axios.post(`${BASE_URL}/actors`, actorData);
      return response.data;
    } catch (error) {
      console.error('Error creating actor:', error);
      throw error;
    }
  },

  getAllProducers: async (): Promise<Producer[]> => {
    try {
      const response: AxiosResponse<Producer[]> = await axios.get(`${BASE_URL}/producers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all producers:', error);
      throw error;
    }
  },
};

export default movieService;
