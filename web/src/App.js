import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';

const App = () => {
  return (
    <Router>
      <div>
        <h1>IMDb Clone</h1>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/add" element={<MovieForm editMode={false} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
