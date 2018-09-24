import { websocket } from './actions';

export default function init(store) {
  // TODO: on disconnect, attempt reconnect with exponential backoff
  store.dispatch(websocket.connect());
}
