const WebSocket = require("ws");

class WSProxy {
  
  constructor(port) {
    
    const wss = new WebSocket.Server({
      host: 'localhost',
      port: port,
      clientTracking: true
    });
    wss.on('listening', () => console.log('Server listening on port'));
    wss.on('connection', () => console.log('Connection established'));
    
    this.getServer = () => wss;
    
    this.broadcast = (data) => {
      // Broadcast to all clients.
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    };
  }
  
};

module.exports = WSProxy;
