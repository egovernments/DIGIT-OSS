import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: brown500,
  },
  underlineFocusStyle: {
    borderColor: brown500,
  },
  floatingLabelStyle: {
    color: brown500,
  },
  floatingLabelFocusStyle: {
    color: brown500,
  },
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
  topGap: {
    marginTop: 24,
    fontWeight: 700,
  },
  boldText: {
    fontWeight: 700,
  },
};

class BuildingClassification extends Component {
  state = {
    value: 1,
  };

  handleChange = (event, index, value) => this.setState({ value });

  render() {
    return (
      <div className="buildingClassification">
        <Card>
          <CardHeader title={<strong style={{ color: brown500 }}>Building Classification</strong>} />
          <CardText>
            <Card>
              <CardText>
                <Grid>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        hintText="Name"
                        floatingLabelText="Name"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        hintText="Code"
                        floatingLabelText="Code"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        hintText="Description"
                        floatingLabelText="Description"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <DatePicker
                        hintText="From Date"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        style={styles.topGap}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <DatePicker
                        hintText="To Date"
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        style={styles.topGap}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <Checkbox label="Active" style={styles.checkbox} style={styles.topGap} />
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>
            <div style={{ float: 'center' }}>
              <RaisedButton type="submit" label="Add" backgroundColor={brown500} labelColor={white} />
              <RaisedButton type="button" label="Close" />
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default BuildingClassification;
