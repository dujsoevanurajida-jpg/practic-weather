import React from 'react';

function WeatherCard({ data }) {
  if (!data) return null;
  return (
    <div className="weather-card">
      <img 
        src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} 
        alt={data.description} 
      />
      <h3>{data.city}, {data.country}</h3>
      <div className="temp">{data.temp}°C</div>
      <p className="desc">{data.description}</p>
      <div className="details">
        <span>Ощущается: {data.feelsLike}°C</span>
        <span>Ветер: {data.wind} м/с</span>
        <span>Влажность: {data.humidity}%</span>
      </div>
    </div>
  );
}

export default WeatherCard;