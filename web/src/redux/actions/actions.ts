import { Dispatch } from 'redux';
import axios from 'axios';
import {
  FETCH_ACTORS_REQUEST,
  FETCH_ACTORS_SUCCESS,
  FETCH_ACTORS_FAILURE,
  ADD_ACTOR_REQUEST,
  ADD_ACTOR_SUCCESS,
  ADD_ACTOR_FAILURE,
  FETCH_PRODUCERS_REQUEST,
  FETCH_PRODUCERS_SUCCESS,
  FETCH_PRODUCERS_FAILURE,
  ADD_PRODUCER_REQUEST,
  ADD_PRODUCER_SUCCESS,
  ADD_PRODUCER_FAILURE,
  FETCH_MOVIES_REQUEST,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILURE,
  ADD_MOVIE_REQUEST,
  ADD_MOVIE_SUCCESS,
  ADD_MOVIE_FAILURE,
  EDIT_MOVIE,
  UPDATE_MOVIE,
} from './types';

import { Movie, Producer, Actor } from '../../services/movieService'

export const fetchActors = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_ACTORS_REQUEST });
  try {
    const response = await axios.get<Actor[]>('/api/actors');
    dispatch({ type: FETCH_ACTORS_SUCCESS, payload: response.data });
  } catch (error:any) {
    dispatch({ type: FETCH_ACTORS_FAILURE, payload: error.message });
  }
};

export const addActor = (actorData: Actor) => async (dispatch: Dispatch) => {
  dispatch({ type: ADD_ACTOR_REQUEST });
  try {
    const response = await axios.post<Actor>('/api/actors', actorData);
    dispatch({ type: ADD_ACTOR_SUCCESS, payload: response.data });
  } catch (error:any) {
    dispatch({ type: ADD_ACTOR_FAILURE, payload: error.message });
  }
};

export const fetchProducers = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_PRODUCERS_REQUEST });
  try {
    const response = await axios.get<Producer[]>('/api/producers');
    dispatch({ type: FETCH_PRODUCERS_SUCCESS, payload: response.data });
  } catch (error:any) {
    dispatch({ type: FETCH_PRODUCERS_FAILURE, payload: error.message });
  }
};

export const addProducer = (producerData: Producer) => async (dispatch: Dispatch) => {
  dispatch({ type: ADD_PRODUCER_REQUEST });
  try {
    const response = await axios.post<Producer>('/api/producers', producerData);
    dispatch({ type: ADD_PRODUCER_SUCCESS, payload: response.data });
  } catch (error:any) {
    dispatch({ type: ADD_PRODUCER_FAILURE, payload: error.message });
  }
};

export const fetchMovies = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_MOVIES_REQUEST });
  try {
    const response = await axios.get<Movie[]>('/api/movies');
    dispatch({ type: FETCH_MOVIES_SUCCESS, payload: response.data });
  } catch (error:any) {
    dispatch({ type: FETCH_MOVIES_FAILURE, payload: error.message });
  }
};

export const addMovie = (movieData: Movie) => async (dispatch: Dispatch) => {
  dispatch({ type: ADD_MOVIE_REQUEST });
  try {
    const response = await axios.post<Movie>('/api/movies', movieData);
    dispatch({ type: ADD_MOVIE_SUCCESS, payload: response.data });
  } catch (error:any) {
    dispatch({ type: ADD_MOVIE_FAILURE, payload: error.message });
  }
};

export const editMovie = (movie: Movie) => ({
  type: EDIT_MOVIE as typeof EDIT_MOVIE,
  payload: movie,
});

export const updateMovie = (updatedMovie: Movie) => ({
  type: UPDATE_MOVIE as typeof UPDATE_MOVIE,
  payload: updatedMovie,
});
