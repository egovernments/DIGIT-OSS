import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';

class UiEditButton extends Component {
  constructor(props) {
    super(props);
  }

  edit = e => {
    let { setRoute, match, customUrl } = this.props;
    let { params, url } = match;
    // console.log(path);
    // console.log(`/create/${params.moduleName}`+ (params.master && "/"+params.master));
    if (customUrl) {
      setRoute(customUrl);
    } else {
      setRoute(url.replace('view', 'update'));
    }
  };

  render() {
    let { edit } = this;
    return (
      <RaisedButton
        type="button"
        onClick={e => {
          edit(e);
        }}
        primary={true}
        label="Edit"
        icon={
          <i style={{ color: 'white' }} className="material-icons">
            edit
          </i>
        }
      />
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UiEditButton));
