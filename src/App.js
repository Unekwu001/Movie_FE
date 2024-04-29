// App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false); // State to control showing additional info

    const apiBaseUrl = 'https://moviebackend.azurewebsites.net';

    const searchMovie = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/Movie/search/${query}`);
            const { data } = response;

            if (data.succeeded) {
                setSearchResults([data.data] || []);
                setSelectedMovie(null);
                setError(null);
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

    const toggleShowMore = () => {
        setShowMore(!showMore); // Toggle showMore state
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
                    <div key={movie.imdbID} className="movie-card">
                        <img src={movie.poster} alt={movie.title} />
                        <h2>{movie.title}</h2>
                        <p>{movie.plot}</p>
                        {!showMore && (
                            <button className="more-link" onClick={toggleShowMore}>
                                Click to read more...
                            </button>
                        )}
                        {showMore && (
                            <div>
                                <p>IMDB Score: {movie.imdbRating}</p>
                                <p>Awards: {movie.awards}</p>
                                <p>Released: {movie.released}</p>
                                <p>Runtime: {movie.runtime}</p>
                                <p>Genre: {movie.genre}</p>
                                <p>Director: {movie.director}</p>
                                <p>Writer: {movie.writer}</p>
                                <p>Actors: {movie.actors}</p>
                                <button className="more-link" onClick={toggleShowMore}>
                                    Click to close
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="search-history">
                <button onClick={getSearchHistory} className="search-button">
                    Get Search History
                </button>
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
