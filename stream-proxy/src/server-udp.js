const dgram = require('dgram');
const ConnectionHandler = require('./connection-handler');

class ServerUDP extends ConnectionHandler {
  constructor(port) {
    super();
    
    const server = dgram.createSocket('udp4');   
    this.on = server.on;
    this.close = server.close;
    this.address = server.address;
    this.start = server.bind(this);
  }
}

module.exports = ServerUDP;


