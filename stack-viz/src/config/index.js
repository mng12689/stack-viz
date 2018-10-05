import { Map, fromJS } from 'immutable';

// Load resources, expose static rsource config here...
// Then we never have to deal with resource type definitions anywhere else
// 00. Load all json config files from dir and merge them together
// 0. Load default resource types, merge with defined resource types
// 1. Iterate through resources
//   - get type def per resource
//   - merge typedef with resource def

// export { resources, globals }

//const _files = fs.readdirSync('/etc/stack-viz.d/');
var files = {};

function importAll (r) {
  r.keys().forEach(key => files[key] = r(key));
}

importAll(require.context('/etc/stack-viz.d/', false, /\.json$/));

const defaultFilename = './default.json';
const defaultFile = files[defaultFilename];
if ( !defaultFile ) {
  throw new Error('Could not locate /etc/stack-viz.d/default.json, did you accidentially delete this file?');
}
let config = fromJS(defaultFile);

Object.keys(files).forEach((key) => {
  if ( key !== defaultFilename ) {
    config = config.mergeDeepWith((oldVal, newVal) => newVal, files[key]);
  }
});

const resources = config.get('resources').entrySeq().reduce((m, [k, r]) => {
  if ( r.get('type') ) {
    const typeDef = config.getIn([ 'resourceTypes', r.get('type') ]);
    return m.set(k, typeDef.mergeDeep(r));
  }
  return m.set(k, r);
}, Map());

const orderedSeverities = config.getIn([ 'global', 'severities' ]);
const global = config.get('global')
      .set('orderedSeverities', orderedSeverities)
      .set('severities', orderedSeverities.reduce((map, s) => map.set(s.get('name'), s), Map()));

export {
  resources,
  global
}
