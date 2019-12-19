import Conf from 'conf';
import Table from 'cli-table3';
import { configKey } from './configure';
import {
  validateApiKey,
  validateCityName,
  validateUnits,
  queryCurrentWeather
} from './utils';
import chalk from 'chalk';
import httpStatus from 'http-status';

export async function now(args) {
  const config = new Conf().get(configKey) || {};
  const apiKey = args.apiKey || config.apiKey;
  const cityName = args.cityName || config.cityName;
  const units = args.units || config.units;

  const [apiKeyValidation, apiKeyValidationText] = validateApiKey(apiKey);
  const [cityNameValidation, cityNameValidationText] = validateCityName(cityName);
  const [unitsValidation, unitsValidationText] = validateUnits(units);

  if (apiKeyValidation && cityNameValidation && unitsValidation) {
    try {
      const { data } = await queryCurrentWeather(cityName, units, apiKey);
      const tempUnits = (units == 'metric') ? '˚C' : '˚F';
      const table = new Table({
        head: ['City', 'DateTime', 'Weather', `Temp(${tempUnits})`],
        colWidths: [25, 23, 18, 12],
        wordWrap: true
      });

      table.push([
        data.name,
        new Date(data.dt * 1000).toLocaleString(),
        data.weather[0].description,
        data.main.temp
      ]);

      console.log(table.toString());
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