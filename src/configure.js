import Conf from 'conf';
import { validateApiKey, validateCityName, validateUnits } from './utils';

export const configKey = 'weather-cli';

export async function configure(args) {
  const config = new Conf();
  const currentConfigObject = config.get(configKey) || {};

  if (!(args.apiKey || args.cityName || args.units)) {
    console.log(currentConfigObject);
    return;
  }

  const apiKey = args.apiKey || currentConfigObject.apiKey;
  const cityName = args.cityName || currentConfigObject.cityName;
  const units = args.units || currentConfigObject.units || 'metric'; // We set default units if not defined

  const [apiKeyValidation, apiKeyValidationText] = validateApiKey(apiKey);
  const [cityNameValidation, cityNameValidationText] = validateCityName(cityName);
  const [unitsValidation, unitsValidationText] = validateUnits(units);

  if (apiKeyValidation, cityNameValidation, unitsValidation) {
    config.set(configKey, { apiKey, cityName, units });
    return;
  }

  let errMessage = `${chalk.redBright('This option value is not valid:\n')}`;
  if (!apiKeyValidation) errMessage += `${chalk.redBright('  --apiKey')}: ${apiKeyValidationText}\n`;
  if (!cityNameValidation) errMessage += `${chalk.redBright('  --cityName')}: ${cityNameValidationText}\n`;
  if (!unitsValidation) errMessage += `${chalk.redBright('  --units')}: ${unitsValidationText}\n`;
  console.error(errMessage.trim());
}