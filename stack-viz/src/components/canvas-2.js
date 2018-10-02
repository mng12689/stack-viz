import Graph from 'react-graph-vis';
import React, { Component } from 'react';

const graph = {
  nodes: [
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'},
    {id: 6, label: 'Node 5'}
  ],
  // TODO: implement label, image, shape/shape properties, color, level, scaling and value (for ordinal mode)
  edges: [
    {from: 1, to: 2, arrows: { to: { enabled: true } }, chosen: { edge: false }, fixed: true },
    {from: 1, to: 3, arrows: { to: { enabled: true } }, chosen: { edge: false }, fixed: true },
    {from: 2, to: 4, arrows: { to: { enabled: true } }, chosen: { edge: false }, fixed: true },
    {from: 2, to: 5, arrows: { to: { enabled: true } }, chosen: { edge: false }, fixed: true }
  ]
};

const options = {
  layout: {
    hierarchical: { direction: 'LR', sortMethod: 'directed' }  
  },
  edges: {
    color: "#000000"
  }
};

const events = {
    select: function(event) {
        var { nodes, edges } = event;
    }
}

export default class Canvas extends Component {
  render() {
    return (
      <Graph graph={graph} options={options} events={events} />
    );
  }
}
