import Conf from 'conf';
import { validateApiKey, validateCityName, validateUnits } from './utils';
import chalk from 'chalk';

export const configKey = 'app-config';
export const userPlacesKey = 'user_place';

export async function configure(args) {
  const config = new Conf();
  const currentConfigObject = config.get(configKey) || {};

  if (!(args.apiKey || args.cityName || args.units)) {
    console.log(JSON.stringify(currentConfigObject, null, 2));
    return;
  }

  const apiKey = args.apiKey || currentConfigObject.apiKey;
  const units = args.units || currentConfigObject.units || 'metric'; // We set default units if not defined

  const [apiKeyValidation, apiKeyValidationText] = validateApiKey(apiKey);
  const [unitsValidation, unitsValidationText] = validateUnits(units);

  if (apiKeyValidation && unitsValidation) {
    config.set(configKey, { apiKey, units });
    return;
  }

  let errMessage = `${chalk.redBright('\n  This option value is not valid:\n')}`;
  if (!apiKeyValidation) errMessage += `\t${apiKeyValidationText}\n`;
  if (!unitsValidation) errMessage += `\t${unitsValidationText}\n`;
  return console.error(errMessage);
}