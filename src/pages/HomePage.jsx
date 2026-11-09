import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CitySearch from '../components/CitySearch';
import WeatherCard from '../components/WeatherCard';
import AdviceDisplay from '../components/AdviceDisplay';
import WeatherAnimation from '../components/WeatherAnimation';
import { getWeather } from '../services/weatherAPI';
import { getDailyAdvice } from '../utils/recommender';

// ✅ Выносим debounce за пределы компонента (утилитарная функция)
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

function HomePage() {
  const [weather, setWeather] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Основная функция поиска города
  const handleSearch = useCallback(async (city) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setAdvice(null);

    try {
      const weatherData = await getWeather(city);
      setWeather(weatherData);

      const adviceData = getDailyAdvice(
        weatherData.temp,
        weatherData.description,
        weatherData.wind,
        weatherData.uvIndex
      );
      setAdvice(adviceData);

      // Сохраняем город в URL
      navigate(`/?city=${encodeURIComponent(city)}`, { replace: true });

      // Кастомное событие при успешной загрузке
      window.dispatchEvent(new CustomEvent('cityLoaded', {
        detail: {
          city: weatherData.city,
          temp: weatherData.temp,
          description: weatherData.description
        }
      }));

    } catch (err) {
      setError(err.message);
      window.dispatchEvent(new CustomEvent('cityLoadError', {
        detail: { message: err.message }
      }));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Debounce-версия функции поиска
  const debouncedSearch = useCallback(
    debounce((city) => handleSearch(city), 300),
    [handleSearch]
  );

  // При загрузке страницы читаем город из URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const savedCity = params.get('city');

    if (savedCity) {
      handleSearch(savedCity);
    } else {
      handleSearch('Москва');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToForecast = () => {
    if (weather) {
      navigate(`/forecast/${weather.city}`);
    }
  };

  return (
    <div className="page home-page">
      <h1 className="page-title">🌦️ Узнайте, что делать сегодня</h1>
      <p className="page-subtitle">
        Введите город — мы подскажем активность и предупреждения
      </p>
  
      <CitySearch onSearch={debouncedSearch} />
  
      {loading && <p className="loading">Загрузка данных о погоде...</p>}
      {error && <p className="error-text">{error}</p>}
  
      {weather && (
        <>
          <WeatherAnimation weatherMain={weather.weatherMain} />
  
          <div className="results-layout">
            {/* Левая колонка: погода + кнопка */}
            <div className="weather-column">
              <WeatherCard data={weather} />
              <button className="btn-forecast" onClick={goToForecast}>
                📅 Посмотреть прогноз на неделю
              </button>
            </div>
  
            {/* Правая колонка: советы */}
            <div className="advice-column">
              <AdviceDisplay advice={advice} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;