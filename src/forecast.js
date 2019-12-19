import Conf from 'conf';
import Table from 'cli-table3';
import { configKey} from './configure';
import httpStatus from 'http-status';
import {
  validateApiKey,
  validateCityName,
  validateUnits,
  queryWeatherForecast
} from './utils';
import chalk from 'chalk';

export async function forecast(args) {
  const config = new Conf().get(configKey) || {};
  const apiKey = args.apiKey || config.apiKey;
  const cityName = args.cityName || config.cityName;
  const units = args.units || config.units;

  const [apiKeyValidation, apiKeyValidationText] = validateApiKey(apiKey);
  const [cityNameValidation, cityNameValidationText] = validateCityName(cityName);
  const [unitsValidation, unitsValidationText] = validateUnits(units);

  if (apiKeyValidation && cityNameValidation && unitsValidation) {
    try {
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
      return;
    } catch (err) {
      if (err.isAxiosError) {
        if (err.response.status == httpStatus.NOT_FOUND) {
          console.error(`${chalk.redBright('\n  City is not found\n')}`);
        }
        if (err.response.status == httpStatus.UNAUTHORIZED) {
          console.error(`${chalk.redBright('\n  apiKey is invalid probably expired. Unauthorized\n')}`);
        }
      } else {
        console.error(`${chalk.redBright('\n  Error is happened\n')}`);
      } 
    }
  } else {
    let errMessage = `${chalk.redBright('\n  This option value is not valid:\n')}`;
    if (!apiKeyValidation) errMessage += `${chalk.redBright('  --apiKey')}: ${apiKeyValidationText}\n`;
    if (!cityNameValidation) errMessage += `${chalk.redBright('  --cityName')}: ${cityNameValidationText}\n`;
    if (!unitsValidation) errMessage += `${chalk.redBright('  --units')}: ${unitsValidationText}\n`;
    console.error(errMessage);
  }
  return;
}