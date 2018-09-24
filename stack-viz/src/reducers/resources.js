import { Record, fromJS, Map } from 'immutable';
import { Resource } from '../models';
import { actions } from '../constants';
import _template from '../template.json';

const template = fromJS(_template);
const resources = template.get('resources');
const resourceTypes = template.get('resourceTypes');

const initialState = new Record({
  resources: resources.keySeq().reduce((map, rName) => {
    const resDef = resources.get(rName);
    const resTypeDef = resourceTypes.get( resDef.get('type') );
    return map.set(rName, new Resource({ name: rName }, resDef, resTypeDef ));
  }, Map())
})();

export default function resourceReducer(state = initialState, action = null) {
  const { type, payload } = action;
  switch ( type ) {
    case actions.WS_MSG_RECEIVED:

      // validate key/rName/etc
      // store and boot stale entry if necessary
      // calculate severity for metric
      // calculate overall severity for resource
      const { msg } = payload;
      
      if ( !state.getIn([ 'resources', msg.resourceName ]) ) {
        console.warn(`Unknown resource name: ${msg.resourcName}`);
        return state;
      }
      if ( !state.getIn([ 'resources', msg.resourceName, 'type', 'stats']).has(msg.key)) {
        console.warn(`Unknown metric key: ${msg.key}`);
        return state;
      }

      // TODO: store list of metrics instead of last metric value
      const metrics = state.resources.get(msg.resourceName).metrics.set(
        msg.key,
        msg.merge({
          receivedAt: new Date()
        })
      );
      const newResource = state.resources.get(msg.resourceName).set('metrics', metrics);
      return state.merge({
        resources: state.resources.set(msg.resourceName, newResource)
      });
    default:
      return state;
  }
}
