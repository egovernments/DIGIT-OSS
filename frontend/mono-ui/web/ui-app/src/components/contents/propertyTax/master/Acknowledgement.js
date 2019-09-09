import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Upload from 'material-ui-upload/Upload';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { blue800, red500, white } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import { translate } from '../../../common/common';

var flag = 0;
const styles = {
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: '#354f57',
  },
  underlineFocusStyle: {
    borderColor: '#354f57',
  },
  floatingLabelStyle: {
    color: '#354f57',
  },
  floatingLabelFocusStyle: {
    color: '#354f57',
  },
  customWidth: {
    width: 100,
  },
  checkbox: {
    marginBottom: 0,
    marginTop: 15,
  },
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  floatButtonMargin: {
    marginLeft: 20,
    fontSize: 12,
    width: 30,
    height: 30,
  },
  iconFont: {
    fontSize: 17,
    cursor: 'pointer',
  },
  radioButton: {
    marginBottom: 0,
  },
  actionWidth: {
    width: 160,
  },
  reducePadding: {
    paddingTop: 4,
    paddingBottom: 0,
  },
  noPadding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  noMargin: {
    marginBottom: 0,
  },
  textRight: {
    textAlign: 'right',
  },
  chip: {
    marginTop: 4,
  },
};

class Acknowledgement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ack: '',
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;
    this.setState({
      ack: localStorage['ack'],
    });
  }

  render() {
    let { acknowledgement } = this.props;

    let cThis = this;

    return (
      <div>
        <h3 style={{ padding: 15 }}>Acknowledgement</h3>

        <Card className="uiCard">
          <CardText style={styles.reducePadding}>
            <Grid fluid>
              <Row style={{ paddingTop: 8, paddingBottom: 15 }}>
                <Col xs={12} md={12}>
                  <Row>
                    <Col
                      xs={12}
                      md={12}
                      style={{
                        textAlign: 'center',
                        paddingTop: 15,
                        fontSize: 16,
                      }}
                    >
                      {translate('pt.create.groups.acknowledgement.success')} : <span style={{ fontWeight: 500 }}>{this.state.ack}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  acknowledgement: state.form.form,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledgement);
