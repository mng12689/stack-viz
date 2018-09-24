# Possible names: COCKPIT, switchboard, command post, HQ

[$Name] is a stack visualization and monitoring tool that uses your stack's metrics to display a real-time view of the health of your system.

## Technical architecture
The stack consists of 2 parts:

### Stream proxy
The stream proxy is a simple connection proxy that accepts network connections (currently only UDP supported) from an external streaming source (eg. Logstash) and proxies them to connected browsers over a Websocket connection. Stream proxy supports multiple clients by accepting incoming data and broadcasting it to all connected clients over their own websocket connections.

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
// TODO: for now look at ./stack-viz/src/template.json to get an idea of how to configure
```
{
  resources: {
    "$rName": {
      "type": "$type",
      "egress": [ "$rName2", "$rName3" ]
    }
  },
  resourceTypes: {
    "$rType": {
      
    }
  }
}               
```

resources: Defines each individual resource. Each new resource is defined as a key within "resources", and will be rendered exactly once in the stack visualization. It is defined as inheriting from a "type" (defined in "resourceTypes"), which allows multiple resources to inherit the same metrics and display characteristics. Resources may override any properties from their inherited type, or even choose to define all of their properties without specifying a type. // TODO: this isnt exactly true right now, but it should be

resourceTypes: Defines a generic type from which individual resources may inherit characteristics. Currently allows defining metrics and associated thresholds for those metrics.

global: Defines global characteristics. Right now defines ordered severities.

display: Allows display-specific customization of almost any key in the configuration file, including resources and severities.

## Installation
Note: Docker files exist in these project repos but dont work right now. Hopefully that will change soon.

Start stream proxy:
```
$> node ./connection_handler/src/server-udp-raw.js
```
Start stack visualizer:
```
$> cd ./stack-viz && npm run start
```
Then open localhost:3000 in your browser

Start streamer:
```
$> cd ./ streamer gcc -o client_udp client_udp.c && ./client_udp localhost 8000
```
Then provide a payload. For now, you can supply the following payload to see the account-cluster resource change to "warning" severity:
```
{"key":"latency_per_req","value":505,"rName":"account-cluster"}
```
