import chalk from 'chalk';

const menus = {
  main: `
  ${chalk.blueBright('weather [command] <options>')}

    ${chalk.blueBright('add')} ................ set your places for later use
    ${chalk.blueBright('config')} ............. set API key and units
    ${chalk.blueBright('forecast')} ........... show forecast for the text three hour
    ${chalk.blueBright('now')} ................ show current weather
    ${chalk.blueBright('version')} ............ get app version
  `,
  add: `
  ${chalk.blueBright('usage: weather add [--placeName] [--cityName]')}

  parameter:
    --placeName: your place name (eg. Home) ${chalk.blueBright('Required')}
    --cityName: where city your place is (eg. London) ${chalk.blueBright('Required')}
  `,
  config: `
  ${chalk.blueBright('usage: weather config [--apiKey] [--units]')}

  parameter:
    --apiKey: apiKey from https://openweathermap.org/. Sign in to get your apiKey ${chalk.blueBright('Required')}
    --units: is the units you want, metric for 'celcius' and 'imperial' for fahrenheit ${chalk.blueBright('Optional')}

  if you dont set units it will using default 'metric'
  this command will save your setting to config file in your account folder
  if there is no value in the option, it will use you setted value

  See also: weather now, weather forecast.
  `,
  forecast: `
  ${chalk.blueBright('usage: weather forecast [--cityName] [--limit] [--units]')}

  parameter:
    --cityName: city you want to know the weather ${chalk.blueBright('Required')}
    --limit: limit for how much data will you get ${chalk.blueBright('Optional')}
    --units: is the units you want, metric for 'celcius' and 'imperial' for fahrenheit ${chalk.blueBright('Optional')}

  if no option is passed, it will read from config file that you set.

  See also: weather help config.
  `,
  now: `
  ${chalk.blueBright('usage: weather now [--cityName] [--units]')}

  parameter:
    --cityName: city name you want to know the weather (eg. London) ${chalk.blueBright('Optional')}
    --units: what is the units you want, metric for 'celcius' and 'imperial' for fahrenheit ${chalk.blueBright('Optional')}
  
  if no parameter is passed, it will read from config file that you set
  
  See also: weather help config.
  `,
  version: `
  ${chalk.blueBright('usage: weather forecast <options>')}

  show weather cli version app
  `
}

export async function help(args) {
  const subCmd = args._[1]
    ? args._[1]
    : 'main';
  console.log(menus[subCmd]);
}