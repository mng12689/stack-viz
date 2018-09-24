import _template from '../template.json';
import { fromJS } from 'immutable';

const template = fromJS(_template);
const severityValues = template.getIn([ 'monitoring', 'severities' ]).reduce((s, obj, i) => {
  return obj.set(s.get('name'), i);
});

export default function getSeverityValue(s) {
  return severityValues.get(s);
}
