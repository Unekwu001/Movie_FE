import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [error, setError] = useState(null);

    const apiBaseUrl = 'https://moviebackend.azurewebsites.net';

    const searchMovie = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/Movie/search/${query}`);
            const { data } = response;

            if (data.succeeded) {
                setSearchResults([data.data] || []); // Wrap the single movie in an array
                setError(null);
                console.log(response);
            } else {
                setError(data.message || 'Error fetching search results. Please try again.');
            }
        } catch (error) {
            handleAxiosError(error, 'Error fetching search results. Please try again.');
        }
    };

    const getSearchHistory = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/Movie/searchHistory`);
            const { data } = response;

            if (data.succeeded) {
                setSearchHistory(data.data || []);
                setError(null);
            } else {
                setError(data.message || 'Error fetching search history. Please try again.');
            }
        } catch (error) {
            handleAxiosError(error, 'Error fetching search history. Please try again.');
        }
    };

    const handleAxiosError = (error, defaultMessage) => {
        if (error.response) {
            console.error('Axios Response Error:', error.response.data);
            setError(`Server Error: ${error.response.data.message || defaultMessage}`);
        } else if (error.request) {
            console.error('Axios Request Error:', error.request);
            setError('Network Error: Unable to reach the server.');
        } else {
            console.error('Axios General Error:', error.message);
            setError('Error: Something went wrong. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Movie Search</h1>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter movie title"
                />
                <button className="search-button" onClick={searchMovie}>
                    Search
                </button>
            </div>

            <div className="movie-list">
                {searchResults.map((movie) => (
                    <div key={movie.imdbID} onClick={() => setSelectedMovie(movie)} className="movie-card">
                        <img src={movie.poster} alt={movie.title} />
                        <h2>{movie.title}</h2>
                        <p>{movie.plot}<button className="more-link"> Click for more....</button></p>
                    </div>
                ))}
            </div>

            {selectedMovie && (
                <div className="selected-movie">
                    <h2>{selectedMovie.title}</h2>
                    <img src={selectedMovie.poster} alt={selectedMovie.title} />
                    <p>{selectedMovie.plot}</p>
                    <p>IMDB Score: {selectedMovie.imdbRating}</p>
                    <p>Awards: {selectedMovie.awards}</p>
                    <p>Released: {selectedMovie.released}</p>
                    <p>Runtime: {selectedMovie.runtime}</p>
                    <p>Genre: {selectedMovie.genre}</p>
                    <p>Director: {selectedMovie.director}</p>
                    <p>Writer: {selectedMovie.writer}</p>
                    <p>Actors: {selectedMovie.actors}</p>
                </div>
            )}

            <div className="search-history">
                <button onClick={getSearchHistory} className="search-button">Get Search History</button>
                <ul>
                    {searchHistory.map((history, index) => (
                        <li key={index}>{history}</li>
                    ))}
                </ul>
            </div>

            {error && <p className="error-message">{error}</p>}


        </div>
    );
}

export default App;
