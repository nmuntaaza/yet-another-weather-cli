import Conf from 'conf';
import Table from 'cli-table3';
import { configKey} from './config';
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

  if (!apiKeyValidation || !cityNameValidation || !unitsValidation) {
    let errMessage = `${chalk.redBright('\n  This option value is not valid:\n')}`;
    if (!apiKeyValidation) errMessage += `\t${apiKeyValidationText}\n`;
    if (!cityNameValidation) errMessage += `\t${cityNameValidationText}\n`;
    if (!unitsValidation) errMessage += `\t${unitsValidationText}\n`;

    return console.error(errMessage);
  }

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
    });

    return console.log(table.toString());
  } catch (err) {
    let errorText = '';
    if (err.isAxiosError) {
      switch(err.response.status) {
        case httpStatus.NOT_FOUND:
          errorText = chalk.redBright('\n  City is not found\n');  
          break;
        case httpStatus.UNAUTHORIZED:
          errorText = chalk.redBright('\n  apiKey is invalid probably expired. Unauthorized\n');
          break;
        default:
          errorText = chalk.redBright('\n  Error on axios\n');
          break;
      }
    } else {
      errorText = chalk.redBright('\n  Error is happened\n');
    }
    
    return console.error(errorText);
  }
}