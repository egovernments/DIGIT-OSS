import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class NoMatch extends Component {
  static isPrivate = false;
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>404 page not found</h3>
        <p>We are sorry but the page you are looking for does not exist.</p>
        <div style={{ textAlign: 'center' }}>
          <br />
          <RaisedButton
            label="Go back to home"
            primary={true}
            onClick={() => {
              window.location.href = window.location.href.split('#/')[0] + '#/' + localStorage.getItem('tenantId') || 'default';
            }}
          />
          <br />
        </div>
      </div>
    );
  }
}

export default NoMatch;
