import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import UiBackButton from '../../../components/UiBackButton';
import * as Templates from '../../../templates/templates/index';

export default class legalTemplateParser extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Template = Templates[this.props.match.params.legalTemplatePath];
    return (
      <div>
      <UiBackButton />
        <div id="printTemplate">
          {localStorage.templateData ? (
            <div>
              <Template data={JSON.parse(localStorage.templateData)} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
