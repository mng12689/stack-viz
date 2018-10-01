import React, { Component } from 'react';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import { websocket } from '../actions';
import { resources, global } from '../config';
import { Canvas } from '../components';

// TODO: automate the creation of this resource graph
const resourceGraph = List([
  List([ 'admin-web-client' ]),
  List([ 'admin-lb']),
  List([ 'admin-web-cluster' ]),
  List([ 'account-cluster', 'auth-cluster', 'sponsor-cluster' ]),
  List([ 'account-rdbms', 'auth-rdbms', 'sponsor-rdbms' ])
]).map((c) => {
  return c.map((r) => Map({ definition: resources.get(r).set('name', r) }));
});

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  canvas: {
    display: 'flex',
    flex: 1
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
    height: 30,
    zIndex: 100
  }
};

class Stack extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedResource: null
    };
  }
  
  render() {
    const connState = this.props.connectionData.get('connectionState');
    const connErr = this.props.connectionData.get('error');
    return (
      <div style={styles.container}>
         {this.renderConnectionBanner(connState, connErr)}
        <div style={styles.canvas}>
          {this.state.selectedResource ? this.renderResourceDetail(this.state.selectedResource) : null}
        <Canvas resourceGraph={resourceGraph}
                onResourceClick={this.onResourceClick} />
        </div>
      </div>
    );
  }

  renderConnectionBanner = (status, err) => {
    function configForStatus(status, err) {
      switch(status) {
        case 'disconnected':
          if ( !err ) {
            return { text: 'Connection disconected. Retrying in ${??}', bg: 'orange' };
          }
          return { text: `Error opening connection ${JSON.stringify(err)}`, bg: 'red' };
        case 'loading':
          return { text: 'Reconnecting...', bg: 'orange' };
        case 'open':
          return { text: 'Connection open!', bg: 'green' };
        default:
          return '';
      }
    }
    
    const config = configForStatus(status, err);
    return (
      <div style={{ ...styles.banner, ...{ backgroundColor: config.bg }}}>
        <p>{config.text}</p>
      </div>
    );
  };
  
  onResourceClick = (r, e) => {
    this.setState({
      selectedResource: this.state.selectedResource === r ? null : r
    });
  };
  
  renderResourceDetail = (rName) => {
    const severity = this.getSeverity(rName) || 'none';
    const metrics = this.props.resourceData.metricsByResource.get(rName).valueSeq();
    return (
      <div style={styles.resourceDetail}>
        <div style={styles.resourceDetailSection}>
          <p style={styles.resourceDetailText}>{`Resource: ${rName}`}</p>
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

  getSeverity = (rName) => {
    // TODO: inefficient, find better algo
    const metrics = this.props.resourceData.metricsByResource.get(rName);
    if ( metrics.size > 0 ) {
      const topMetric = metrics.maxBy((m) => m.value);
      return topMetric.getSeverity();
    }
  };
  
  getDisplayAttributes = (severity) => {
    return severity 
          ? global.getIn(['severities', severity, 'display' ])
          : Map();
  };
}

export default connect((state) => ({
  connectionData: state.connectionData,
  resourceData: state.resourceData
}))(Stack);
