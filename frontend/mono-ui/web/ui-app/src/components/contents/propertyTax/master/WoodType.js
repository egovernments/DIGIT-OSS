import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
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
};

class WoodType extends Component {
  state = {
    value: 1,
  };

  handleChange = (event, index, value) => this.setState({ value });

  render() {
    return (
      <div className="woodType">
        <Card>
          <CardHeader title={<strong style={{ color: brown500 }}>Search Wood Type</strong>} />
          <CardText>
            <Card>
              <CardText>
                <Grid>
                  <Row>
                    <Col xs={12} md={6}>
                      <SelectField
                        floatingLabelText="Wood Type"
                        value={this.state.value}
                        onChange={this.handleChange}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                      >
                        <MenuItem value={1} primaryText="Choose name" />
                        <MenuItem value={2} primaryText="Country Wood" />
                        <MenuItem value={3} primaryText="Rose Wood" />
                        <MenuItem value={4} primaryText="Teak Wood" />
                        <MenuItem value={5} primaryText="ORD" />
                        <MenuItem value={6} primaryText="OPM" />
                      </SelectField>
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>
            <div style={{ float: 'center' }}>
              <RaisedButton type="submit" label="Create" backgroundColor={brown500} labelColor={white} />
              <RaisedButton type="submit" label="Update" backgroundColor={brown500} labelColor={white} />
              <RaisedButton type="submit" label="View" backgroundColor={brown500} labelColor={white} />
              <RaisedButton type="button" label="Close" />
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default WoodType;
