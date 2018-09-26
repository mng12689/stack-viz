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

function connectionError(error) {
  return {
    type: actions.WS_CONN_ERROR,
    payload: {
      error
    }
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
  
  const PROXY_HOST = process.env.PROXY_HOST;
  const PROXY_PORT = process.env.PROXY_PORT;
  
  return (dispatch) => {
    dispatch(openingConnection());

    // TODO: implement ping/pong to health check server and repoen conn if necessary
    const socket = new WebSocket(`ws://${PROXY_HOST}:${PROXY_PORT}`);
    socket.binaryType = 'arraybuffer';
    
    socket.onopen = () => {
      console.log('connection opened');
      dispatch(connectionOpened());
    };

    socket.onclose = () => {
      console.log('connection closed');
      dispatch(connectionClosed());
    };

    socket.onerror = (error) => {
      console.log('connection error');
      dispatch(connectionError(error));
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
