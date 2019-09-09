/**
 * Created by narendrasisodiya on 14/12/17.
 */

import React, { Component } from 'react';
import MultiCheckbox from './MultiCheckbox';
import ReactJsonViewer from 'react-json-viewer';

export default class MultiCheckboxDemo extends Component {
  state = {
    demo1Porps: {
      debug: true,
      displayLabel: 'Please selected your hobbies',
      isRequired: true,
      isDisabled: false,
      defaultValue: ['C2'],
      data: [
        {
          label: 'Coding',
          code: 'C1',
        },
        {
          label: 'Programming',
          code: 'C2',
        },
        {
          label: 'Dummy Label 2',
          code: 'C3',
        },
      ],
    },
  };
  onChange = selected => {
    console.log('Current Selected value is ', selected);
  };
  keyup = e => {
    console.log('KeyUp Called');
    try {
      var demo1Porps = JSON.parse(e.target.value);
      this.setState({
        demo1Porps: demo1Porps,
      });
    } catch (ex) {}
  };
  validateFunction = selected => {
    if (selected.length < 2) {
      return 'At Least 2 must be selected';
    } else {
      return '';
    }
    //This function will run everytime onChange, and return a ErrorMessage.
  };
  render() {
    console.log('LifeCycle: MultiCheckboxDemo: Render');
    return (
      <div>
        <h1>Demo MultiCheckbox</h1>
        <MultiCheckbox {...this.state.demo1Porps} validateFunction={this.validateFunction} onChange={this.onChange} />
        <textarea onKeyUp={this.keyup} name="" id="" cols="100" rows="20">
          {JSON.stringify(this.state.demo1Porps, null, '\t')}
        </textarea>
      </div>
    );
  }
}
