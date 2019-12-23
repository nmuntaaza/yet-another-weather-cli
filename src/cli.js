import minimist from 'minimist';
import { version } from './version';
import { help } from './help';
import { configure } from './config';
import { now } from './now';
import { forecast } from './forecast';
import { add } from './add';

export async function cli(argsArray) {
  const args = minimist(argsArray.slice(2));
  let cmd = args._[0] || 'help';

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
    case 'add':
      add(args);
      break;
    default:
      console.error(
        `weather ${cmd}: unknown command\nRun 'weather help' for usage`
      );
      break;
  }
}