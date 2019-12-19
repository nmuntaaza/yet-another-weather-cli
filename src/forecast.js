import Conf from 'conf';
import Table from 'cli-table3';
import { configKey} from './configure';
import {
  validateApiKey,
  validateCityName,
  validateUnits,
  queryWeatherForecast
} from './utils';

export async function forecast(args) {
  const config = new Conf().get(configKey);
  const apiKey = args.apiKey || config.apiKey;
  if (!validateApiKey(apiKey)) {
    return;
  }
  const cityName = args.cityName || config.cityName;
  if (!validateCityName(cityName)) {
    return;
  }
  const units = args.units || config.units;
  if (!validateUnits(units)) {
    return;
  }

  const { data } = await queryWeatherForecast(cityName, units, apiKey);
  
  const tempUnits = (units == 'metric') ? '˚C' : '˚F';
  const table = new Table({
    head: ['City', 'DateTime', 'Weather', `Temp(${tempUnits})`],
    colWidths: [25, 23, 18, 12],
    wordWrap: true
  });

  const forecastLimit = args.limit ? args.limit : 5;
  data.list.slice(0, forecastLimit).forEach(forecast => {
    table.push([
      cityName,
      new Date(forecast.dt * 1000).toLocaleString(),
      forecast.weather[0].description,
      forecast.main.temp
    ]);
  })

  console.log(table.toString());
}