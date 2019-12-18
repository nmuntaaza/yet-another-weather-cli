import Conf from 'conf';
import Table from 'cli-table3';
import { configKey } from './configure';
import {
  validateApiKey,
  validateCityName,
  validateUnits,
  queryCurrentWeather
} from './utils';

export async function now(args) {
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

  const { data } = await queryCurrentWeather(cityName, units, apiKey);

  const table = new Table({
    head: ['City', 'DateTime', 'Weather', 'Temp'],
    colWidths: [25, 23, 18, 7],
    wordWrap: true
  });

  table.push([
    data.name,
    new Date(data.dt * 1000).toLocaleString(),
    data.weather[0].description,
    data.main.temp
  ]);

  console.log(table.toString());
}