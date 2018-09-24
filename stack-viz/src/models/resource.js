import { Record, List, Map } from 'immutable';
import { getSeverityValue } from '../lib';

class Resource extends Record({
  name: null,
  type: null,
  egress: List(),
  metrics: Map(),
}) {

  constructor(obj, def, typedef) {
    super({
      name: obj.name,
      type: typedef,
      egress: def.get('egress')
    });
  }
}

Resource.prototype.getSeverity = function() {
  // TODO: make this more efficient, perhaps metrics can be a heap data structure?
  return this.metrics.isEmpty()
    ? 'none'
    : this.metrics.toList().maxBy((s) => getSeverityValue(s.getSeverity())).getSeverity();
};

export default Resource;
