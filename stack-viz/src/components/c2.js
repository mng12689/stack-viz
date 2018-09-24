import React, { Component } from 'react';
import { fromJS } from 'immutable';
const template = require('../template.json');
const resourceGraph = [
  [ 'admin-web-client' ],
  [ 'admin-lb'],
  [ 'admin-web-cluster' ],
  [ 'account-cluster', 'auth-cluster', 'sponsor-cluster' ],
  [ 'account-rdbms', 'auth-rdbms', 'sponsor-rdbms' ]
];

const styles = {
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    display: 'flex',
    flex: 1,
    justifyContent: 'space-evenly'
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  resource: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d6d7da',
    borderWidth: 10,
    borderRadius: 4,
    backgroundColor: 'blue',
    width: 100,
    height: 60,
    margin: 20
  },
  resourceImage: {
    width: '100%',
    height:'100%'
  },
  resourceDetail: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    display: 'flex',
    alignItems: 'left',
    flexDirection: 'column'
  },
  resourceDetailSection: {
    marginBottom: 20
  },
  resourceDetailText: {
    textAlign: 'left'
  }
};

export default class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedResource: null
    };
  }
  
  render() {
    return (
      <div style={styles.canvas}>
        {this.state.selectedResource ? this.renderResourceDetail(this.state.selectedResource) : null}
        {resourceGraph.map((col) => this.renderResourceColumn(col))}
      </div>
    );
  }

  renderResourceColumn = (col) => {
    return (
      <div style={styles.col} key={col.join('')}>
        {col.map((r) => this.renderResource(r))}
      </div>
    );
  };

  renderResource = (r) => {
    // look up most recent stat to determine color
    const resource = this.getResource(r);
    const resourceType = template.resourceTypes[resource.def.type];
    const displayAttributes = template.monitoring.severities[resource.state.severity];
    const color = displayAttributes.color || 'none';
    return (
      <div style={{ ...styles.resource, ...{ backgroundColor: color } }}
           key={r}
           onClick={this.onResourceClick.bind(this, r)}>
        {resourceType.image
         ? ( <img src={resourceType.image.src} style={styles.resourceImage} /> )
         : null}
        <p>{r}</p>
      </div>
    );
  };
  
  onResourceClick = (r, e) => {
    this.setState({
      selectedResource: this.state.selectedResource === r ? null : r
    });
  };
  
  renderResourceDetail = (r) => {
    const resource = this.getResource(r);
    const resourceType = template.resourceTypes[resource.def.type];
    const { severity, stats } = resource.state;
    const displayAttributes = template.monitoring.severities[severity];
    const color = displayAttributes.color || 'none';
    return (
      <div style={styles.resourceDetail}>
        <div style={styles.resourceDetailSection}>
          <p style={styles.resourceDetailText}>{`Resource: ${r}`}</p>
          <p style={styles.resourceDetailText}>{`Severity: ${severity}`}</p>
        </div>
        {stats
         ? (
           <div style={styles.resourceDetailSection}>
             <p style={styles.resourceDetailText}>{`Offending statistics:`}</p>
             <div style={styles.statList}>
               {stats.map((s) => {
                 return ( <p style={styles.resourceDetailText}>{`${s.key}: ${s.value}`}</p> );
               })}
             </div>
           </div>
         ) : null}
         <div style={styles.resourceDetailSection}>
           <a>View full resource details</a>
         </div>
      </div>
    );
  };
  
  getResource = (r) => {
    return {
      def: template.resources[r],
      state: {
        severity: 'warning',
        stats: [
          { key: 'latency_per_req', value: 200 }
        ]
      }
    };
  };
}


/*function structureResources(template) {
  // 1. gather non-ingress
  // 2. do BFS using egress specifiers
  // 2a. each level is the next group right of the current group. if encounter already visited node, move node to next group
  // 3. result should be depth based network based on max network hops to get there
  let grid = List();
  let visited = {};
  // TODO: find heads dynamically
  const heads = List([ resources.get("admin-web-client") ]);
  grid = grid.set(0, heads);
  heads.map((h) => {
    let level = 1;
    let node = resour;
    let queue = List();
    while ( !queue.isEmpty() ) {
      const egressNodes = node.egress || List();
      egressNodes.forEach((e) => {
        if ( visited.has(e) ) {
          const pos = visited.get(e);
          if ( level < pos.level ) {
            grid.get(level)
            grid.set(level, grid.get(level).append(grid.get(pos.level).get(pos.index);
        }
        queue.add(resources.get(e));
      });
      node.egress && !node.egress.isEmpty()
    }
  });
  const resources = template.get('resources');
}*/
