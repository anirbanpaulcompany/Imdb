import {
  FETCH_MOVIES_REQUEST,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILURE,
  ADD_MOVIE_SUCCESS,
  EDIT_MOVIE,
  UPDATE_MOVIE_SUCCESS,
  UPDATE_MOVIE_FAILURE
} from '../actions/types';

interface Movie {
  id: number;
  name: string;
}

interface State {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  editingMovie: Movie | null;
}

const initialState: State = {
  movies: [],
  loading: false,
  error: null,
  editingMovie: null
};

const movieReducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case FETCH_MOVIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_MOVIES_SUCCESS:
      return { ...state, loading: false, movies: action.payload, error: null };
    case FETCH_MOVIES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_MOVIE_SUCCESS:
      return { ...state, movies: [...state.movies, action.payload], error: null };
    case EDIT_MOVIE:
      return { ...state, editingMovie: action.payload };
    case UPDATE_MOVIE_SUCCESS:
      const updatedMovie: Movie = action.payload;
      const updatedMovies: Movie[] = state.movies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      );
      return { ...state, movies: updatedMovies, editingMovie: null, error: null };
    case UPDATE_MOVIE_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default movieReducer;
