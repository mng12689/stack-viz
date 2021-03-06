# Possible names: COCKPIT, switchboard, command post, HQ

[$Name] is a stack visualization and monitoring tool that uses your stack's metrics to display a real-time view of the health of your system.

## Technical architecture
The stack consists of 2 parts:

### Stream proxy
The stream proxy is a simple connection proxy that listens for network traffic (currently only UDP supported) from an external streaming source (eg. Logstash) and proxies the traffic to connected browsers over a Websocket connection. Stream proxy supports multiple clients by accepting incoming data and broadcasting it to all connected clients over their own websocket connections.

The stream proxy expects a small payload like the following:

```
{ "key": "$metric_name", "value": "$metric_value", "rName": "$my_resource_name", "rId": "$my_resource_id" }
```

It will validate the format and ensure it has received all of the required parameters, and then forward the payload on to all connected clients.
// TODO: may want to handle rate limiting at the proxy
// TODO: is validation in the proxy a good or bad idea?
// TODO: if there a large number of connected browsers, we may need to provide a sticky load balancer

### Stack visualizer
The stack visualizer is the browser client that renders the actual visualization of your stack. It takes a set of configuration files representing the resources in the stack, and renders each resource, its relationships to other resources, and its health information (the visual encoding of this health information is also configurable). As it receives incoming metrics from the stream proxy, it will update the rendered view of the associated resources in real time based on the values of these metrics and their configured severity thresholds. The display characteristics all have reasonable defaults, but pretty much anything rendered on screen can be customized.

### External streamer
This project obviously relies on some external source to stream correctly formatted messages to the stream proxy. In production, this will likely be a log/metrics parser like Logstash, but for debugging purposes this project comes with a streamer which waits for input from STDIN and sends that input to the stream proxy.

#### Configuration
// TODO: for now look at ./stack-viz/src/config/default.json to get an idea of how to configure, eventually default.json should only contain default configuration, and user-supplied configuration should be placed in /etc/stack-viz.d/
```
{
  "resources": {
    "$rName": {
      "type": "$type",
      "egress": [ "$rName2", "$rName3" ]
    }
  },
  "resourceTypes": {
    "$rType": {
      "stats": {
        "$key": {
          "thresholds": {
            "$s1": { "value": 500 }
            "$s2": { "value": 1000 }
          }
        }
      }
    }
  },
  "global": {
    "severities": [
      { "name": "$s1", { display: "color": "$color1" } },
      { "name": "$s2", { display: "color": "$color1" } }
    ]
  }
}               
```

resources: Defines each individual resource. Each new resource is defined as a key within "resources", and will be rendered exactly once in the stack visualization. It is defined as inheriting from a "type" (defined in "resourceTypes"), which allows multiple resources to inherit the same metrics and display characteristics. Resources may override any properties from their inherited type, or even choose to define all of their properties without specifying a type.

resourceTypes: Defines a generic type from which individual resources may inherit characteristics. Currently allows defining metrics and associated thresholds for those metrics.

global: Defines global characteristics. Right now defines ordered severities.

$key.display: Allows display-specific customization of almost any key in the configuration file. Every key supports the same display attributes, so simply adding a "display" key to any displayable object should modify its appearance in a consistent manner.

## Installation
Note: Docker files exist in these project repos but dont work right now. Hopefully that will change soon.

Start stream proxy:
```
$> WS_PORT=8080 INGRESS_PORT=8000 node ./stream-proxy/src/server-udp-raw.js
```
Start stack visualizer:
```
$> docker-compose up
```
Then open localhost:3000 in your browser
NOTE: If using docker-machine, you may not be able to hit localhost directly. Instead, use the IP address of the docker-machine, or modify /etc/hosts to add a dedicated host for that IP.
NOTE: If using docker-machine, hot reload is somewhat delayed. It's enabled via the CHOKIDAR_USE_POLLING=true env variable. You may remove this in the docker-compose file if using Docker for Mac.

Start streamer in interactive mode:
```
$> node ./streamer.js stream localhost 8000 -i
```
Then provide a payload. For now, you can supply the following payload to see the account-cluster resource change to "warning" severity:
```
{"key":"latency_per_req","value":505,"rName":"account-cluster"}
```
For a complete list of valid payloads, see src/config/default.json

For a complete list of possible streamer modes, such as streaming input from a file:
```
$> node ./streamer.js stream --help
```