import axios from 'axios';

export async function queryCurrentWeather(cityName, units, apiKey) {
  const baseUri = 'https://api.openweathermap.org/data/2.5/weather';
  const url = getApiUrl(baseUri, cityName, units, apiKey);
  return await axios({
    method: 'GET',
    url
  });
}

export async function queryWeatherForecast(cityName, units, apiKey) {
  const baseUri = 'https://api.openweathermap.org/data/2.5/forecast';
  const url = getApiUrl(baseUri, cityName, units, apiKey);
  return await axios({
    method: 'GET',
    url
  });
}

export function validateApiKey(apiKey) {
  if (apiKey != null && apiKey.length == 32) {
    return [true, ''];
  }
  return [false, 'must be not null and the length is 32'];
}

export function validateCityName(cityName) {
  if (cityName != null && cityName.length > 0) {
    return [true, ''];
  }
  return [false, 'must be not null and the cityName string length is more than 0'];
}

export function validateUnits(units) {
  const unitsList = {
    metric: 'metric',
    imperial: 'imperial'
  }
  if (unitsList[units] != null) {
    return [true, ''];
  }
  return [false, 'must be imperial or metric'];
}

function getApiUrl(baseUri, cityName, units, apiKey) {
  return `${baseUri}?q=${cityName}&units=${units}&appid=${apiKey}`
}