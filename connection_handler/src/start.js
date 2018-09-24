const NetworkProxy = require('./network-proxy');
//TODO: should be able to choose server class based on config, for now we assume UDP
const ServerUDP = require('./server-udp');

const np = new NetworkProxy(ServerUDP, {
  wsPort: process.env.WS_PORT,
  ingressPort: process.env.INGRESS_PORT
});
