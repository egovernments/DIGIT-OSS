import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
// import {Card, CardHeader, CardText} from 'material-ui/Card';
// import {brown500, red500,white} from 'material-ui/styles/colors';
// import Paper from 'material-ui/Paper';

const styles = {
  floatRight: {
    float: 'right',
  },

  paper: {
    width: '100%',
    marginTop: 20,
    display: 'inline-block',
    backgroundColor: '#f3f4f5',
    color: 'black',
    fontSize: 12,
    paddingTop: 16,
    paddingBottom: 16,
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },

  putDown: {
    position: 'absolute',
    bottom: 0,
  },
};

class Footer extends Component {
  render() {
    const renderFooterData = function() {
      if (!localStorage.token)
        return (
          <div className="Footer" style={styles.paper}>
            <Col xs={12} lg={12}>
              <Row>
                <Col xs={12} sm={5}>
                  <span>
                    Copyright &#169; 2017 eGovernments Foundation.<sup>&#174;</sup>
                  </span>{' '}
                </Col>
                <Col xs={12} sm={7}>
                  <div style={styles.floatRight} />
                </Col>
              </Row>
            </Col>
          </div>
        );
    };

    return <div>{renderFooterData()}</div>;
  }
}

export default Footer;
