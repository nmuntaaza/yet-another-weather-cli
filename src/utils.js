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
  return (apiKey != null
    && apiKey.length == 32
  );
}

export function validateCityName(cityName) {
  return (cityName != null);
}

export function validateUnits(units) {
  const unitsList = {
    metric: 'metric',
    imperial: 'imperial'
  }
  return (unitsList[units] != null);
}

function getApiUrl(baseUri, cityName, units, apiKey) {
  return `${baseUri}?q=${cityName}&units=${units}&appid=${apiKey}`
}