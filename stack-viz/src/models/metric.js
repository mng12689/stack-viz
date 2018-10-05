import { Record } from 'immutable';
import { global, resources } from '../config';

class Metric extends Record({
  key: null,
  value: null,
  resourceName: null,
  resourceId: null,
  ts: null,
  receivedAt: null,
  meta: null,
  severity: null
}) {
  constructor(obj) {
    // TODO: is it a bad idea to calc severity on each instantiation?
    super({
        ...obj,
        ...{ severity: Metric.getSeverity(obj.rName, obj.key, obj.value) }
    });
  }
}

Metric.prototype.getSeverity = function() {
  // TODO: more efficient way to find severity, hash fn prob best
  const _this = this;
  return Metric.getSeverity(_this.resourceName, _this.key, _this.value);
};

Metric.getSeverity = function(rName, key, value) {
  // TODO: more efficient way to find severity, hash fn prob best
  const severity = global.get( 'orderedSeverities' )
    .findLast((sDef) => {
      const s = sDef.get('name');
      const severityThreshold = resources.getIn([ rName, 'stats', key, 'thresholds', s ]);
      return severityThreshold &&
        value > severityThreshold.get('value');
    });
  return severity && severity.get('name');
};

export default Metric;
