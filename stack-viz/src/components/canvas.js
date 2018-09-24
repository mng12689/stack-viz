import React, { Component } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { websocket } from '../actions';
import appConfig from '../config';

const resourceGraph = [
  [ 'admin-web-client' ],
  [ 'admin-lb'],
  [ 'admin-web-cluster' ],
  [ 'account-cluster', 'auth-cluster', 'sponsor-cluster' ],
  [ 'account-rdbms', 'auth-rdbms', 'sponsor-rdbms' ]
];

const styles = {
  canvas: {
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
  },
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 80,
    zIndex: 100
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedResource: null
    };
  }
  
  render() {
    const connState = this.props.connectionData.get('connectionState');
    return (
      <div style={styles.container}>
        {connState === 'open'
         ? this.renderConnectionBanner(connState)
         : null}
        <div style={styles.canvas}>
          {this.state.selectedResource ? this.renderResourceDetail(this.state.selectedResource) : null}
          {resourceGraph.map((col) => this.renderResourceColumn(col))}
        </div>
      </div>
    );
  }

  renderConnectionBanner = (status) => {
    function configForStatus(status) {
      switch(status) {
        case 'disconnected':
          return { text: 'No connection detected. Retrying in ${??}', bg: 'orange' };
        case 'loading':
          return { text: 'Reconnecting...', bg: 'orange' };
        case 'open':
          return { text: 'Connection open!', bg: 'green' };
        default:
          return '';
      }
    }
    
    const config = configForStatus(status);
    return (
      <div style={{ ...styles.banner, ...{ backgroundColor: config.bg }}}>
        <p>{config.text}</p>
      </div>
    );
  };
  
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
    const displayAttributes = this.getDisplayAttributes(resource);
    const color = displayAttributes.get('color');
    return (
      <div style={{ ...styles.resource, ...{ backgroundColor: color } }}
           key={r}
           onClick={this.onResourceClick.bind(this, r)}>
        {resource.type.get('image')
         ? ( <img src={resource.type.image.src} style={styles.resourceImage} /> )
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
    const severity = resource.getSeverity();
    const metrics = resource.metrics.toList();
    const displayAttributes = this.getDisplayAttributes(resource);
    const color = displayAttributes.get('color');
    return (
      <div style={styles.resourceDetail}>
        <div style={styles.resourceDetailSection}>
          <p style={styles.resourceDetailText}>{`Resource: ${r}`}</p>
          <p style={styles.resourceDetailText}>{`Severity: ${severity}`}</p>
        </div>
        {metrics
         ? (
           <div style={styles.resourceDetailSection}>
             <p style={styles.resourceDetailText}>{`Offending metrics:`}</p>
             <div style={styles.statList}>
               {metrics.map((m) => {
                 return ( <p style={styles.resourceDetailText}>{`${m.key}: ${m.value}`}</p> );
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
    return this.props.resourceData.resources.get(r);
  };

  getDisplayAttributes = (resource) => {
    const defaultAttributes = Map({ color: 'rgba(255,255,255,0.5)' });
    const displayAttributes = resource.getSeverity()
          ? appConfig.getIn(['display', 'severities', resource.getSeverity() ])
          : Map();
    return defaultAttributes.merge(displayAttributes);
  };
}

export default connect((state) => ({
  connectionData: state.connectionData,
  resourceData: state.resourceData
}))(Canvas);

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
