import { actions } from '../constants';
import { Metric } from '../models';
import appConfig from '../config';

function openingConnection() {
  return {
    type: actions.OPEN_WS_CONN,
    payload: {}
  };
}

function connectionOpened() {
  return {
    type: actions.WS_CONN_OPENED,
    payload: {}
  };
}

function connectionClosed() {
  return {
    type: actions.WS_CONN_CLOSED,
    payload: {}
  };
}

function wsMessageReceived(msg) {
  return {
    type: actions.WS_MSG_RECEIVED,
    payload: {
      msg
    }
  };
}

export function connect() {
  // TODO: implement ping/pong to health check server and repoen conn if necessary
  const socket = new WebSocket("ws://localhost:8080");
  socket.binaryType = 'arraybuffer';
  return (dispatch) => {
    dispatch(openingConnection());
    socket.onopen = () => {
      console.log('connection opened');
      dispatch(connectionOpened());
    };
    socket.onmessage = (evt) => {
      const msg = String.fromCharCode.apply(null, new Uint8Array(evt.data));
      console.log('message received', msg);
      let metric;
      try {
        const parsed = JSON.parse(msg);
        metric = new Metric({
            ...parsed,
            ...{
              resourceName: parsed.rName,
              resourceId: parsed.rId
            }
        });
        dispatch(wsMessageReceived(metric));
      } catch(e) {
        console.error(`Unparseable metric, throwing away: ${msg}`);
      }
    };
  };
}
