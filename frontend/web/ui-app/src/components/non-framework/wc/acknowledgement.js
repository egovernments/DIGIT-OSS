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
import { translate } from '../../common/common';

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

class InboxAcknowledgement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      upicNumber: '',
    };
  }

  componentDidMount() {
    //call boundary service fetch wards,location,zone data
    var currentThis = this;
    currentThis.setState({
      status: localStorage['status'] || '',
      upicNumber: localStorage['acknowledgementNumber'] || '',
    });
  }

  getUrlVars() {
    var vars = [],
      hash;
    var hashes = this.props;
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  titleCase(field) {
    if (field) {
      var newField = field[0].toUpperCase();
      for (let i = 1; i < field.length; i++) {
        if (field[i - 1] != ' ' && field[i] != ' ') {
          newField += field.charAt(i).toLowerCase();
        } else {
          newField += field[i];
        }
      }
      return newField;
    } else {
      return '';
    }
  }

  render() {
    console.log(this.state.upicNumber);

    let { InboxAcknowledgement } = this.props;

    let { cThis, getUrlVars, titleCase } = this;

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
                      <center>
                        <font color="ass">
                          <b style={{ 'font-weight': 'bold' }}> {titleCase(this.props.match.params.status)} Successfully! </b>{' '}
                        </font>{' '}
                      </center>
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
  InboxAcknowledgement: state.form.form,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(InboxAcknowledgement);
