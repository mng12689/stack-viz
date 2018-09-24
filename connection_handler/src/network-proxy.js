const WSProxy = require('./ws-proxy');

class NetworkProxy {
  constructor(ConnectionHandler, options) {
    const { wsPort, ingressPort } = options;

//    const ws = new WSProxy(wsPort);
    const handler = new ConnectionHandler();
    handler.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      handler.close();
    });
    handler.on('message', (msg, rinfo) => {
      console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
      // TODO: validate format
      // TODO: rate limit
      const clients = ws.getServer().clients;
      if ( !clients || clients.length === 0 ) {
        console.log("No connected clients, ignoring message");
      } else {
        ws.broadcast(msg);
      }
    });
    handler.on('listening', () => {
      const address = handler.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });
    handler.start(ingressPort || 8000);
  }
}

module.exports = NetworkProxy;
