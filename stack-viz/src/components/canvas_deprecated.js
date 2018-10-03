// NOTE: keeping this class in case vis.js graph visualization lib doesnt work out and we have to build something custom
import React, { Component } from 'react';
import { fromJS, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

const styles = {
  canvas: {
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
  }
};

class Canvas extends Component {

  static propTypes = {
    resourceGraph: ImmutablePropTypes.listOf(
      ImmutablePropTypes.listOf(
        ImmutablePropTypes.mapContains({
          definition: ImmutablePropTypes.contains({
            name: PropTypes.string,
            egress: ImmutablePropTypes.listOf(
              PropTypes.string
            )
          }),
          display: ImmutablePropTypes.contains({
            color: PropTypes.string
          })
        })
      )
    ),
    onResourceClick: PropTypes.func.isRequired
  }

  render() {
    return (
      <div style={styles.canvas}>
        {this.props.resourceGraph.map(this.renderResourceColumn)}
      </div>
    );
  }
  
  renderResourceColumn = (col) => {
    return (
      <div style={styles.col} key={col.join('')}>
        {col.map(this.renderResource)}
      </div>
    );
  };

  renderResource = (r) => {
    const def = r.get('definition');
    const displayAttributes = this.getDisplayAttributes(r.get('display'));
    const color = displayAttributes.get('color');
    return (
      <div style={{ ...styles.resource, ...{ backgroundColor: color } }}
           key={r}
           onClick={this.props.onResourceClick.bind(this, def.get('name'))}>
        {def.get('image')
         ? ( <img src={def.getIn([ 'image', 'src' ])} style={styles.resourceImage} /> )
         : null}
        <p>{def.get('name')}</p>
      </div>
    );
  };

  getDisplayAttributes = (displayAttributes) => {
    const defaultAttributes = Map({ color: 'rgba(255,255,255,0.5)' });
    return defaultAttributes.merge(displayAttributes);
  };
}

export default Canvas;

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
