import chalk from 'chalk';

const menus = {
  main: `
  ${chalk.blueBright('weather [command] <options>')}

    ${chalk.blueBright('now')} ................ show weather for now
    ${chalk.blueBright('forecast')} ........... show weather forecast
    ${chalk.blueBright('config')}.............. set API key, city name, and temperature units
    ${chalk.blueBright('version')} ............ show package version
  `,
  now: `
  ${chalk.greenBright('usage: weather now <options>')}

  options:
    --cityName: what city you want to know
    --units: what is the units you want, metric for 'celcius' and 'imperial' for fahrenheit
    --apiKey: your apiKey from https://openweathermap.org/. Sign in to get your apiKey
  
  if no option is passed, it will read from config file that you set.
  
  See also: weather help config.
  `,
  forecast: `
  ${chalk.greenBright('usage: weather forecast <options>')}

  options:
    --cityName: city you want to know the weather
    --units: is the units you want, metric for 'celcius' and 'imperial' for fahrenheit
    --apiKey: apiKey from https://openweathermap.org/. Sign in to get your apiKey
    --limit: limit for how much data will you get

  if no option is passed, it will read from config file that you set.

  See also: weather help config.
  `,
  version: `
  ${chalk.greenBright('usage: weather forecast <options>')}

  show weather cli version app
  `,
  config: `
  ${chalk.greenBright('usage: weather config <options>')}

  options:
    --cityName: city you want to know the weather
    --units: is the units you want, metric for 'celcius' and 'imperial' for fahrenheit
    --apiKey: apiKey from https://openweathermap.org/. Sign in to get your apiKey

  this command will save your setting to config file in your account folder
  when calling 'weather now <options>' if there is no value in the option,
  it will use you setted value.

  See also: weather now, weather forecast.
  `
}

export async function help(args) {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0];
  console.log(menus[subCmd] || menus.main);
}