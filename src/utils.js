import axios from 'axios';
import chalk from 'chalk';
import request from './client/openweathermap'

export async function queryCurrentWeather(cityName, units, apiKey) {
  const url = setApiQuery('/weather', cityName, units, apiKey);
  return request.get(url);
}

export async function queryWeatherForecast(cityName, units, apiKey) {
  const url = setApiQuery('/forecast', cityName, units, apiKey);
  return request.get(url);
}

export function validateUserPlaces(userPlaces) {
  if (userPlaces != null) {
    if (typeof userPlaces == 'string') {
      return validateCityName(userPlaces);
    }
    if (typeof userPlaces == 'object') {
      if (userPlaces.length == 0) {
        return [false, `${chalk.redBright('--cityName')}: you should at least set your place with "weather config" or passing "--cityName" option`];
      }
      return [true, ''];
    }
  }
  return [false, `${chalk.redBright('--cityName')}: you should at least set your place with "weather config" or passing "--cityName" option`];
}

export function validateApiKey(apiKey) {
  if (apiKey != null && apiKey.length == 32) {
    return [true, ''];
  }
  return [false, `${chalk.redBright('--apiKey')}: must be not null and the length is 32`];
}

export function validateCityName(cityName) {
  if (cityName != null && cityName.length > 0) {
    return [true, ''];
  }
  return [false, `${chalk.redBright('--cityName')}: must be not null and the cityName string length is more than 0`];
}

export function validatePlaceName(placeName) {
  if (placeName != null && placeName.length > 0) {
    return [true, ''];
  }
  return [false, `${chalk.redBright('--placeName')}: must be not null and the placeName string length is more than 0`];
}

export function validateUnits(units) {
  const unitsList = {
    metric: 'metric',
    imperial: 'imperial'
  }
  if (unitsList[units] != null) {
    return [true, ''];
  }
  return [false, `${chalk.redBright('--units')}: must be imperial or metric`];
}

function setApiQuery(baseUri, cityName, units, apiKey) {
  return `${baseUri}?q=${cityName}&units=${units}&appid=${apiKey}`
}