import fishing from './fishing';
import tide from './tide';

/** An 'index' file is special as it allows us to do:
 * import commands from './commands'
 * as opposed to
 * import commands from './commands/index'
 */
export default [fishing, tide];
