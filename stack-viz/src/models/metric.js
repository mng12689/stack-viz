import { Record, Map } from 'immutable';
import appConfig from '../config';

class Metric extends Record({
  key: null,
  value: null,
  resourceName: null,
  resourceId: null,
  ts: null,
  receivedAt: null,
  meta: null,
  thresholds: Map()
}) {
  
  constructor(obj, def) {
    super({
      key: obj.key,
      value: obj.value,
      resourceName: obj.rName,
      resourceId: obj.rId,
      ts: obj.ts,
      meta: obj.meta,
      thresholds: def.get('thresholds')
    });
  }
}

Metric.prototype.getSeverity = function() {
  // TODO: more efficient way to find severity, hash fn prob best
  const _this = this;
  const severity = appConfig.getIn([ 'monitoring', 'severities' ])
    .findLast((sDef) => {
      const s = sDef.get('name');
      return this.thresholds.get(s) &&
        _this.value > _this.thresholds.get(s).get('value');
    });
  return severity && severity.get('name');
};

export default Metric;
