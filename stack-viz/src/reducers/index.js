import { combineReducers } from 'redux';
import connection from './ws-conn';
import resources from './resources';

const appReducer = combineReducers({
  connectionData: connection,
  resourceData: resources
});

export default appReducer;
