import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import MovieForm from './MovieForm';
import './MovieList.css'; 

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [editMovieId, setEditMovieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await movieService.getAllMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleEdit = (movie: any) => {
    setEditMovieId(movie?.id);
  };

  const handleDelete = async (movieId: number) => {
    try {
      await movieService.deleteMovie(movieId);
      const updatedMovies = movies.filter((movie) => movie.id !== movieId);
      setMovies(updatedMovies);
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className="movies-container">
      <h2>Movies List</h2>
      <div>
        <Link to="/add">
          <button>Add Movie</button>
        </Link>
      </div>
      <ul className="movies-list">
        {movies.map((movie: any) => (
          <li key={movie.id} className="movie-item">
            {editMovieId === movie.id ? (
              <MovieForm Id={editMovieId} initialMovie={movie} />
            ) : (
              <div>
                <strong>{movie.name}</strong> ({movie.yearOfRelease}) - Producer:{' '}
                {movie.producer ? movie.producer.name : 'Unknown'} - Actors:{' '}
                {movie.actors ? movie.actors.map((actor: any) => actor.name).join(', ') : 'Unknown'} - Plot:{' '}
                {movie.plot ? movie.plot : 'Unknown'}
                <button onClick={() => handleEdit(movie)}>Edit</button>
                <button onClick={() => handleDelete(movie.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
