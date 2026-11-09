import React, { useEffect, useState } from 'react';

function WeatherAnimation({ weatherMain }) {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
      const rainDrops = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: 0.5 + Math.random() * 0.5,
        animationDelay: Math.random() * 2
      }));
      setDrops(rainDrops);
    } else if (weatherMain === 'Snow') {
      const snowFlakes = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 8,
        animationDuration: 3 + Math.random() * 4,
        animationDelay: Math.random() * 5
      }));
      setDrops(snowFlakes);
    } else {
      setDrops([]);
    }
  }, [weatherMain]);

  if (drops.length === 0) return null;

  const isRain = weatherMain === 'Rain' || weatherMain === 'Drizzle';

  return (
    <div className={`weather-animation ${isRain ? 'rain' : 'snow'}`}>
      {drops.map(drop => (
        <div
          key={drop.id}
          className={isRain ? 'raindrop' : 'snowflake'}
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.animationDuration}s`,
            animationDelay: `${drop.animationDelay}s`,
            ...(isSnow(drop) ? { width: `${drop.size}px`, height: `${drop.size}px` } : {})
          }}
        />
      ))}
    </div>
  );
}

function isSnow(drop) {
  return drop.size !== undefined;
}

export default WeatherAnimation;