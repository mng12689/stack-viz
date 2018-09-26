import { Record } from 'immutable';
import { actions } from '../constants';

const initialState = new Record({
  connectionState: 'disconnected',
  error: null
})();

export default function ws_conn(state = initialState, action = null) {
  const { type, payload } = action;
  switch ( type ) {
    case actions.OPEN_WS_CONN:
      return state.merge({
        connectionState: 'loading',
        error: null
      });
    case actions.WS_CONN_OPENED:
      return state.merge({
        connectionState: 'open',
        error: null
      });
    case actions.WS_CONN_CLOSED:
      return state.merge({
        connectionState: 'disconnected'
      });
    case actions.WS_CONN_ERROR:
      return state.merge({
        connectionState: 'disconnected',
        error: payload.error
      });
    default:
      return state;
  }
}
