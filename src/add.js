import Conf from 'conf';
import { validateCityName, validatePlaceName } from './utils';
import { userPlacesKey } from './config';
import chalk from 'chalk';

export async function add(args) {
  const config = new Conf();
  const cityName = args.cityName;
  const placeName = args.placeName;

  const [cityNameValidation, cityNameValidationText] = validateCityName(cityName);
  const [placeNameValidation, placeNameValidationText] = validatePlaceName(placeName);

  if (!cityNameValidation || !placeNameValidation) {
    let errMessage = `${chalk.redBright('\n  This option value is not valid:\n')}`;
    if (!cityNameValidation) errMessage += `\t${cityNameValidationText}\n`;
    if (!placeNameValidation) errMessage += `\t${placeNameValidationText}\n`;
    return console.error(errMessage);
  }

  const currentUserPlaces = config.get(userPlacesKey) || [];
  const placeIndex = currentUserPlaces.findIndex(place => place.placeName == placeName);
  placeIndex == -1 ? currentUserPlaces.push({ cityName, placeName }) : currentUserPlaces[placeIndex] = { cityName, placeName };
  config.set(userPlacesKey, currentUserPlaces);
}