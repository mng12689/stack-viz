import { Record, fromJS, Map } from 'immutable';
import { Resource } from '../models';
import { actions } from '../constants';
import { resources } from '../config';

const initialState = new Record({
  metricsByResource: Map(
    resources.keySeq().reduce((obj, r) => {
      obj[r] = Map();
      return obj;
    }, {})
  )
})();

export default function resourceReducer(state = initialState, action = null) {
  const { type, payload } = action;
  switch ( type ) {
    case actions.WS_MSG_RECEIVED:
      // store and boot stale entry if necessary
      // calculate severity for metric
      // calculate overall severity for resource
      const { msg } = payload;
      
      if ( !resources.get(msg.resourceName) ) {
        console.warn(`Unknown resource name: ${msg.resourceName}`);
        return state;
      }
      if ( !resources.getIn([ msg.resourceName, 'stats' ]).has(msg.key)) {
        console.warn(`Unknown metric key: ${msg.key}`);
        return state;
      }

      // TODO: store list of metrics instead of last metric value
      return state.merge({
        metricsByResource: state.metricsByResource.setIn([ msg.resourceName, msg.key ],
                                                         msg.merge({
                                                           receivedAt: new Date()
                                                         })
                                                        )
      });
      
    default:
      return state;
  }
}
