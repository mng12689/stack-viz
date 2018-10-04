const parser = require('./parser');
const fs = require('fs');

let timerId = null;
  
function getClient(p) {
  // TODO: when we implement both protocols, we should expose a common interface here
  if ( p === 'UDP' ) {
    const dgram = require('dgram');
    return dgram.createSocket('udp4');
  } else {
    throw Error('Protocol not yet supported');
  }
}

function readNext(inputSource, client, args) {
  var buf = inputSource.read();
  // parse next line and put remaining chars back into the buffer
  console.log('read: ', buf);
  if (buf) {
    var offset = 0;
    for (; offset < buf.length; offset++) {
      if (buf[offset] === '\x0A' || buf[offset] === 'x0D') {
        const msg = buf.slice(0, offset + 1);
        client.send(msg, args.port, args.host, (err) => {
          if ( err ) {
            console.warn('Message transmission error: ', err);
          }
        });
        buf = buf.slice(offset + 1);
        inputSource.unshift(buf);
        break;
      }
    }
  }

  // stdin seems to get paused during the readable callback?
  // regardless, if any input source is paused here, lets resume
  if ( inputSource.isPaused() ) {
    inputSource.resume();
  }

  if ( !args.interactive ) {
    timerId = setTimeout(readNext.bind(null,inputSource, client, args), 1000 / args.speed);
  }
};

function readNextIfNecessary(inputSource, client, args) {
  // if we're not rate limited, or we havent read anything yet, read from the input source
  // otherwise we know we'll check back in shortly to read the data in the buffer
  if ( !timerId ) {
    readNext(inputSource, client, args);
  }
}

function main() {
  const args = parser.argv;
  
  const client = getClient(args.protocol);
  const inputSource = args.interactive
        ? process.stdin
        : fs.createReadStream(args.file, { encoding: 'utf8', highWaterMark: 1024 });
  inputSource.on('readable', readNextIfNecessary.bind(null, inputSource, client, args));
  inputSource.on('close', () => clearTimeout(timerId));
}

main();
