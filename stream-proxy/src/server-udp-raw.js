const dgram = require('dgram');

const WSProxy = require('./ws-proxy');
const ws = new WSProxy(process.env.WS_PORT);

const server = dgram.createSocket('udp4');
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const clients = ws.getServer().clients;
  if ( !clients || clients.size === 0 ) {
    console.log('No client connections, ignoring payload');
  } else {
    ws.broadcast(msg);
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(process.env.INGRESS_PORT);
