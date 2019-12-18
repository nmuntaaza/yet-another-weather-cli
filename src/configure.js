import Conf from 'conf';
import { validateApiKey, validateCityName, validateUnits } from './utils';

export const configKey = 'weather-cli';

export async function configure(args) {
  const config = new Conf();
  let currentConfigObject = config.get(configKey);
  currentConfigObject = currentConfigObject || {};

  let apiKey = args.apiKey;
  if (!apiKey) {
    apiKey = currentConfigObject.apiKey;
  }
  if (!validateApiKey(apiKey)) {
    return;
  }

  let cityName = args.cityName;
  if (!cityName) {
    cityName = currentConfigObject.cityName;
  }
  if (!validateCityName(cityName)) {
    return;
  }

  let units = args.units;
  if (!units) {
    units = currentConfigObject.units ? currentConfigObject.units : 'metric';
  }
  if (!validateUnits(units)) {
    return;
  }

  config.set(configKey, { apiKey, cityName, units });
}