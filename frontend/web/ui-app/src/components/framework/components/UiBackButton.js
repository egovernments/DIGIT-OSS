import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';

class UiBackButton extends Component {
  constructor(props) {
    super(props);
  }

  back = e => {
    let { setRoute, match } = this.props;
    let { params, path } = match;
    let { customUrl } = this.props;
    if (customUrl) {
      setRoute(customUrl);
    } else {
      if (path.split('/')[1] == 'create') {
        setRoute(`/search/${params.moduleName}` + (params.master && '/' + params.master) + '/view');
      } else {
        setRoute('/' + localStorage.getItem('returnUrl'));
      }
    }
  };

  render() {
    let { back } = this;
    return (
      <RaisedButton
        type="button"
        onClick={e => {
          back(e);
        }}
        primary={true}
        label={'Back'}
        icon={
          <i className="material-icons" style={{ color: 'white' }}>
            arrow_back
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UiBackButton));
