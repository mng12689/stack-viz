const parser = require('yargs').command('stream <host> <port>', 'Stream payloads to the specified destination', (yargs) => {
    yargs.positional('host', {
      describe: 'Host to which this program streams payloads',
      type: 'string',
      demandOption: true
    }).positional('port', {
      describe: 'Port of destination host',
      type: 'string',
      demandOption: true
    }).options({
      interactive: {
        alias: 'i',
        describe: 'Stream your own payloads on the fly in interactive mode',
        type: 'boolean'
      },
      file: {
        alias: 'f',
        describe: 'Supply a file path to have payloads streamed line-by-line',
        type: 'string'
      },
      speed: {
        alias: 's',
        describe: 'If in non-interactive mode, the rate (in payloads per sec) at which the supplied payloads are streamed to the destination',
        type: 'number',
        default: 1
      },
      nloops: {
        alias: 'n',
        describe: 'Number of loops to do over the input source. Works in both interactive and non-interactive modes.',
        type: 'boolean'
      },
      protocol: {
        alias: 'p',
        describe: 'Network protocol to use for communication with destination',
        default: 'UDP',
        choices: [ 'UDP', 'TCP' ]
      }
    });
});

module.exports = parser;
