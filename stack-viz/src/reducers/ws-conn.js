import { Record } from 'immutable';
import { actions } from '../constants';

const initialState = new Record({
  connectionState: 'disconnected'
})();

export default function ws_conn(state = initialState, action = null) {
  const { type, payload } = action;
  switch ( type ) {
    case actions.OPEN_WS_CONN:
      return state.merge({
        connectionState: 'loading'
      });
    case actions.WS_CONN_OPENED:
      return state.merge({
        connectionState: 'open'
      });
    case actions.WS_CONN_CLOSED:
      return state.merge({
        connectionState: 'disconnected'
      });
    default:
      return state;
  }
}
