import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class UiHyperLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.handleOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };
  }

  renderDlgBx = item => {
    switch (this.props.ui) {
      case 'google':
        const actions = [
          <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
          <FlatButton label="Submit" primary={true} disabled={true} onClick={this.handleClose} />,
        ];
        return (
          <div>
            <FlatButton
              href={item.url}
              target="_blank"
              id={item.label.split('.').join('-')}
              type={item.uiType || 'button'}
              label={item.label}
              primary={typeof item.primary != 'undefined' ? item.primary : true}
              secondary={item.secondary || false}
              //onClick={this.handleOpen}
              disabled={item.isDisabled ? true : false}
            />
            <Dialog title="Dialog With Actions" actions={actions} modal={true} open={this.state.open} />
          </div>
        );
    }
  };

  render() {
    console.log('dialog');
    return this.renderDlgBx(this.props.item);
  }
}
