import React, { useState, useEffect, useRef } from 'react';
import { getCitiesSuggestions } from '../services/weatherAPI';

function CitySearch({ onSearch }) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const wrapperRef = useRef(null);

  // Закрытие подсказок при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ ЗАКРЫВАЕМ ПР12 (Задание 7.3: Debounce для подсказок)
  useEffect(() => {
    if (city.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const cities = await getCitiesSuggestions(city);
        setSuggestions(cities);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
      }
    }, 300); // Задержка 300мс — это и есть debounce

    return () => clearTimeout(timer);
  }, [city]);

  const handleSubmit = (e) => {
    // ✅ ЗАКРЫВАЕМ ПР12 (Задание 4.2: preventDefault)
    e.preventDefault();
    
    if (city.trim().length < 2) {
      setError('Введите название города (минимум 2 буквы)');
      return;
    }
    setError('');
    setShowSuggestions(false);
    onSearch(city.trim());
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <h2>Узнать, что делать</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Начните вводить город..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (error) setError('');
            }}
            autoComplete="off"
          />
          <button type="submit">Найти</button>
        </div>
        {error && <p className="error-text">{error}</p>}

        {/* Выпадающий список подсказок */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                📍 {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}

export default CitySearch;