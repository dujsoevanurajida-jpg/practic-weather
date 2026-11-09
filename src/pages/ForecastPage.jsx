import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getForecast } from '../services/weatherAPI';
import { getDailyAdvice } from '../utils/recommender';

function ForecastPage() {
  const { city } = useParams();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadForecast = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getForecast(city);
        setForecast(data);
        
        // ✅ ЗАКРЫВАЕМ ПР12 (Задание 5: Кастомные события)
        // Создаем и запускаем кастомное событие при успешной загрузке прогноза
        window.dispatchEvent(new CustomEvent('forecastLoaded', { 
          detail: { city: city, daysCount: data.length } 
        }));
        
      } catch (err) {
        setError(err.message);
        // Кастомное событие ошибки (тоже из ПР12)
        window.dispatchEvent(new CustomEvent('forecastError', { 
          detail: { message: err.message } 
        }));
      } finally {
        setLoading(false);
      }
    };
    
    loadForecast();
  }, [city]);

  return (
    <div className="page forecast-page">
      {/* Ссылка назад. Город сохранится, так как HomePage читает его из URL */}
      <Link to="/" className="back-link">← Вернуться к сегодняшнему прогнозу</Link>
      
      <h1 className="page-title">📅 Прогноз на 5 дней: {city}</h1>

      {loading && <p className="loading">Загрузка прогноза и советов...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <ForecastDayCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

// Отдельный компонент для карточки одного дня
function ForecastDayCard({ day }) {
  // Получаем советы именно для этой температуры и погоды
  const advice = getDailyAdvice(day.temp, day.description, day.wind, day.uvIndex);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="forecast-day-card">
      {/* Шапка карточки: день и иконка */}
      <div className="forecast-header">
        <div className="forecast-date">
          <span className="day-name">{day.dayName}</span>
          <span className="day-full">{formatDate(day.date)}</span>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
          alt={day.description}
          className="forecast-icon"
        />
      </div>

      {/* Температура и описание */}
      <div className="forecast-temp">{day.temp}°C</div>
      <div className="forecast-desc">{day.description}</div>

      {/* Детали погоды */}
      <div className="forecast-details">
        <span>Ощущается: {day.feelsLike}°C</span>
        <span>Ветер: {day.wind} м/с</span>
        <span>Влажность: {day.humidity}%</span>
      </div>

      {/* === БЛОК СОВЕТОВ (только релевантные) === */}
      <div className="forecast-advice">
        
        {/* 1. Активность (всегда есть) */}
        <h4>🏃 Активность:</h4>
        <p className="advice-text">{advice.activity[0]}</p>

        {/* 2. Взять с собой (ТОЛЬКО если есть дождь/снег/жара) */}
        {advice.items.length > 0 && (
          <>
            <h4>🎒 Взять с собой:</h4>
            <div className="forecast-items">
              {advice.items.map((item, idx) => (
                <span key={idx} className="forecast-item-badge">
                  {item.emoji} {item.name}
                </span>
              ))}
            </div>
          </>
        )}

        {/* 3. Предупреждения (ТОЛЬКО если есть риск: мороз, гололед, УФ и т.д.) */}
        {advice.warnings.length > 0 && (
          <>
            <h4>⚠️ Внимание:</h4>
            <div className="forecast-warnings">
              {advice.warnings.map((warning, idx) => (
                <span key={idx} className="warning-badge">
                  {warning.icon} {warning.title}
                </span>
              ))}
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}

export default ForecastPage;