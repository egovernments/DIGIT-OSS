/**
 * Created by narendrasisodiya on 12/12/17.
 */

import React, { Component } from 'react';
import MultiCheckboxDemo from './MultiCheckboxDemo';

var ComponentMap = {
  MultiCheckboxDemo: MultiCheckboxDemo,
};

export default class ComponentLoader extends Component {
  componentWillReceiveProps(nextprops) {
    console.log('LifeCycle: ComponentLoader: componentWillReceiveProps', nextprops);
  }
  shouldComponentUpdate(nextProps, nextState) {
    var d = JSON.stringify(this.props) !== JSON.stringify(nextProps);
    console.log('LifeCycle: ComponentLoader: shouldComponentUpdate', d);
    return d;
  }

  render() {
    console.log('LifeCycle: ComponentLoader: Render');
    var Comp = ComponentMap[this.props.match.params.componentName];
    return (
      <div>
        <h1>Welcome to Component Loader</h1>
        <Comp />
      </div>
    );
  }
}
