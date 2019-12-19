import minimist from 'minimist';
import { version } from './version';
import { help } from './help';
import { configure } from './configure';
import { now } from './now';
import { forecast } from './forecast';

export async function cli(argsArray) {
  const args = minimist(argsArray.slice(2));
  let cmd = args._[0] || 'help';

  if (args.version || args.v) {
    cmd = 'version';
  }

  if (args.help || args.h) {
    cmd = 'help';
  }

  switch (cmd) {
    case 'version':
      version();
      break;
    case 'help':
      help(args);
      break;
    case 'config':
      configure(args);
      break;
    case 'now':
      now(args);
      break;
    case 'forecast':
      forecast(args);
      break;
    default:
      console.error(
        `weather ${cmd}: unknown command\nRun 'weather help' for usage`
      );
      break;
  }
}