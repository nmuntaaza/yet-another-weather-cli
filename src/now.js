import Conf from 'conf';
import Table from 'cli-table3';
import { configKey, userPlacesKey } from './config';
import {
  validateApiKey,
  validateUserPlaces,
  validateUnits,
  queryCurrentWeather
} from './utils';
import chalk from 'chalk';
import httpStatus from 'http-status';
import promise from 'bluebird';

export async function now(args) {
  const appConfig = new Conf().get(configKey) || {};
  const userPlacesConfig = new Conf().get(userPlacesKey) || [];
  const userPlaces = args.cityName || userPlacesConfig;

  const apiKey = args.apiKey || appConfig.apiKey;
  const units = args.units || appConfig.units;

  return await showWeatherInfo(userPlaces, units, apiKey);
}

async function showWeatherInfo(userPlaces, units, apiKey) {
  const [apiKeyValidation, apiKeyValidationText] = validateApiKey(apiKey);
  const [unitsValidation, unitsValidationText] = validateUnits(units);
  const [userPlacesValidation, userPlacesValidationText] = validateUserPlaces(userPlaces);

  if (!apiKeyValidation || !unitsValidation || !userPlacesValidation) {
    let errMessage = `${chalk.redBright('\n  This option value is not valid:\n')}`;
    if (!apiKeyValidation) errMessage += `\t${apiKeyValidationText}\n`;
    if (!unitsValidation) errMessage += `\t${unitsValidationText}\n`;
    if (!userPlacesValidation) errMessage += `\t${userPlacesValidationText}\n`;
    return console.error(errMessage);
  }

  const tempUnits = (units == 'metric') ? '˚C' : '˚F';
  let table = null;
  try {
    if (typeof userPlaces == 'object' && userPlaces.length > 0) {
      table = new Table({
        head: ['Name', 'City', 'DateTime', 'Weather', `Temp(${tempUnits})`],
        colWidths: [15, 15, 23, 18, 12],
        wordWrap: true
      });
      promise.each(userPlaces, async place => {
        return queryCurrentWeather(place.cityName, units, apiKey).then(result => {
          table.push([
            place.placeName,
            result.data.name,
            new Date(result.dt * 1000).toLocaleString(),
            result.data.weather[0].description,
            result.data.main.temp
          ])
        })
      }).then(() => {
        console.log(table.toString());
      });
      return;
    }
    if (typeof userPlaces == 'string') {
      const { data } = await queryCurrentWeather(userPlaces, units, apiKey);
      table = new Table({
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
      return console.log(table.toString());
    }
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
    return console.error(errorText, err);
  }
}