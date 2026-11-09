import { activityAdvice, itemsToTake, warnings } from '../data/adviceDatabase';

export const getDailyAdvice = (temp, description, windSpeed, uvIndex = 0) => {
  const isRainy = description.toLowerCase().includes('дождь') || description.toLowerCase().includes('ливень');
  const isSnowy = description.toLowerCase().includes('снег');
  const isSunny = description.toLowerCase().includes('ясно') || description.toLowerCase().includes('солн');
  const isCloudy = description.toLowerCase().includes('облачн') || description.toLowerCase().includes('пасмурн');

  // 1. Советы по активности — с учётом осадков!
  const activity = activityAdvice.find(
    item => temp >= item.tempMin && temp < item.tempMax
  );
  
  let activityTips = activity ? [...activity.advice] : ['Наслаждайтесь днём!'];

  // Корректируем советы при плохой погоде
  if (isRainy) {
    if (temp >= 5 && temp < 20) {
      activityTips = [
        'Прогулка возможна, но возьмите зонт ☂️',
        'Избегайте длительных прогулок под дождём',
        'Хорошее время для чтения дома с чаем ☕'
      ];
    } else if (temp < 5) {
      activityTips = [
        'Лучше остаться дома — холодно и мокро',
        'Идеальное время для домашних дел',
        'Посмотрите фильм или почитайте книгу 📚'
      ];
    } else {
      activityTips = [
        'Тёплый дождь — можно прогуляться с зонтом',
        'Избегайте длительного пребывания под дождём',
        'Хорошее время для кафе или музея ☕'
      ];
    }
  } else if (isSnowy) {
    if (temp < -10) {
      activityTips = [
        'Сильный мороз со снегом — ограничьте пребывание на улице',
        'Опасно для длительных прогулок',
        'Идеальное время для горячего шоколада дома ☕'
      ];
    } else {
      activityTips = [
        'Отличное время для зимних забав! ⛄',
        'Можно покататься на санках или лыжах',
        'Одевайтесь теплее и гуляйте недолго'
      ];
    }
  } else if (isCloudy || isCloudy) {
    if (temp >= 10 && temp < 25) {
      activityTips = [
        'Пасмурно, но тепло — хорошая погода для прогулки',
        'Подойдёт велосипед или пробежка',
        'Отличное время для фотосессий 📷'
      ];
    }
  }

  // 2. Что взять с собой
  let itemsToTakeList = [];
  if (isRainy) {
    itemsToTakeList = itemsToTake.rain;
  } else if (isSnowy) {
    itemsToTakeList = itemsToTake.snow;
  } else if (isSunny && temp > 20) {
    itemsToTakeList = itemsToTake.sunny;
  }

  // 3. Предупреждения
  const activeWarnings = [];

  if (temp <= warnings.frost.tempMax) activeWarnings.push(warnings.frost);
  if (temp >= warnings.ice.tempMin && temp <= warnings.ice.tempMax && isSnowy) activeWarnings.push(warnings.ice);
  if (temp >= warnings.heat.tempMin) activeWarnings.push(warnings.heat);
  if (uvIndex >= warnings.uv_extreme.uvMin) activeWarnings.push(warnings.uv_extreme);
  else if (uvIndex >= warnings.uv_high.uvMin) activeWarnings.push(warnings.uv_high);
  if (windSpeed >= warnings.strong_wind.windMin) activeWarnings.push(warnings.strong_wind);

  return {
    activity: activityTips,
    items: itemsToTakeList,
    warnings: activeWarnings
  };
};