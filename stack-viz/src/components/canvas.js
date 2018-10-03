import Graph from 'react-graph-vis';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { lightenDarkenHexColor } from '../lib';
import cs from 'color-string';

const options = {
  layout: {
    hierarchical: { direction: 'LR', sortMethod: 'directed' }  
  },
  edges: {
    arrows: { to: { enabled: true } },
    chosen: { edge: false },
    color: { inherit: false }
  },
  nodes: {
    fixed: true
  },
  physics: {
    enabled: false
  }
};

export default class Canvas extends Component {
  static propTypes = {
    resources: ImmutablePropTypes.mapContains({
      definition: ImmutablePropTypes.map.isRequired,
      display: ImmutablePropTypes.map
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.graph = this.computeGraph(props);
  }
  
  componentWillReceiveProps(nextProps) {
    this.graph = this.computeGraph(nextProps);
  }
  
  render() {
    const onNodeClick = (event) => {
      const { nodes } = event;
      this.props.onResourceClick(nodes[0]);
    };
    const events = {
      select: onNodeClick.bind(this),
    };
    
    return (
      <Graph graph={this.graph} options={options} events={events} />
    );
  }

  computeGraph(props) {
    return props.resources.entrySeq().reduce((g, [ rName, r ]) => {
      const rDef = r.get('definition');
      const egress = rDef.get('egress');
      const nodeRawColor = r.getIn([ 'display', 'color' ]);
      const nodeHex = nodeRawColor ? cs.to.hex( cs.get.rgb(nodeRawColor) ) : null;
      const nodeColor = nodeHex ? {
        background: nodeHex,
        border: lightenDarkenHexColor(nodeHex, -.5)
      } : null;
      g.nodes.push({
        id: rName,
        label: rName,
        color: {
            ...nodeColor,
          highlight: {
              ...nodeColor
          }
        }
      });
      if ( egress ) {
        g.edges = g.edges.concat(
          egress.map((e) => {
            return {
              from: rName,
              to: e
            };
          }).toArray()
        );
      }
      return g;
    }, { nodes: [], edges: [] });
  };
}
