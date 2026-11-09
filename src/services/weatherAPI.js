const API_KEY = process.env.REACT_APP_WEATHER_KEY;

export const getWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Город не найден. Проверьте название.');
  }
  
  const data = await response.json();
  
  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    weatherMain: data.weather[0].main,
    uvIndex: data.uvi || 0 // УФ-индекс (если доступен)
  };
};

export const getForecast = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Не удалось загрузить прогноз.');
  }
  
  const data = await response.json();
  
  const dailyForecast = [];
  const processedDates = new Set();
  
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    const time = item.dt_txt.split(' ')[1];
    
    if (time === '12:00:00' && !processedDates.has(date)) {
      processedDates.add(date);
      dailyForecast.push({
        date: date,
        dayName: getDayName(item.dt * 1000),
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        wind: item.wind.speed,
        weatherMain: item.weather[0].main,
        uvIndex: item.uvi || 0
      });
    }
  });
  
  return dailyForecast.slice(0, 5);
};

export const getCitiesSuggestions = async (query) => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=ru`;
    const response = await fetch(url);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    if (!data.results) return [];
    
    return data.results.map(city => `${city.name}, ${city.country}`);
  } catch (error) {
    return [];
  }
};

function getDayName(timestamp) {
  const date = new Date(timestamp);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
}