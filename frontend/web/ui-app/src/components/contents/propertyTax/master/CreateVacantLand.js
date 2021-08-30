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

class VacantLand extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { VacantLand, handleChange, fieldErrors } = this.props;
    return (
      <div className="VacantLand">
        <Card>
          <CardHeader title={<strong style={{ color: brown500 }}>Create Vacant Land</strong>} />
          <CardText>
            <Card>
              <CardText>
                <Grid>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.surveyNumber ? fieldErrors.surveyNumber : ''}
                        value={VacantLand.surveyNumber ? VacantLand.surveyNumber : ''}
                        onChange={e => handleChange(e, 'surveyNumber', false, /^\d{1,20}$/g)}
                        hintText="Survey Number "
                        floatingLabelText="Survey Number"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.pattaNumber ? fieldErrors.pattaNumber : ''}
                        value={VacantLand.pattaNumber ? VacantLand.pattaNumber : ''}
                        onChange={e => handleChange(e, 'pattaNumber', false, /^\d{1,20}$/g)}
                        hintText="Patta Number "
                        floatingLabelText="Patta Number"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.vacantLandArea ? fieldErrors.vacantLandArea : ''}
                        value={VacantLand.vacantLandArea ? VacantLand.vacantLandArea : ''}
                        onChange={e => handleChange(e, 'vacantLandArea', false, /^\d{1,20}$/g)}
                        hintText="Vacant Land Area "
                        floatingLabelText="Vacant Land Area (in sqr. Mts.)"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.marketValue ? fieldErrors.marketValue : ''}
                        value={VacantLand.marketValue ? VacantLand.marketValue : ''}
                        onChange={e => handleChange(e, 'marketValue', false, /^\d{1,20}$/g)}
                        hintText="Market Value"
                        floatingLabelText=" Market Value"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.vacantLandArea ? fieldErrors.capitalValue : ''}
                        value={VacantLand.capitalValue ? VacantLand.capitalValue : ''}
                        onChange={e => handleChange(e, 'capitalValue', false, '')}
                        hintText="Capital Value "
                        floatingLabelText="Capital Value"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <DatePicker
                        value={VacantLand.effectiveDate ? VacantLand.effectiveDate : ''}
                        onChange={e => handleChange(e, 'effectiveDate', false, '')}
                        hintText="Effective Date"
                        container="inline"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <SelectField
                        errorText={fieldErrors.vacantLandPlotArea ? fieldErrors.vacantLandPlotArea : ''}
                        value={VacantLand.vacantLandPlotArea ? VacantLand.vacantLandPlotArea : ''}
                        onChange={(event, index, value) => {
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChange(e, 'vacantLandPlotArea', false, '');
                        }}
                        floatingLabelText="Vacant Land Plot Area"
                      >
                        <MenuItem value={1} primaryText="" />
                        <MenuItem value={2} primaryText="Every Night" />
                        <MenuItem value={3} primaryText="Weeknights" />
                        <MenuItem value={4} primaryText="Weekends" />
                        <MenuItem value={5} primaryText="Weekly" />
                      </SelectField>
                    </Col>

                    <Col xs={12} md={6}>
                      <SelectField
                        errorText={fieldErrors.layoutApprovalAuthority ? fieldErrors.layoutApprovalAuthority : ''}
                        value={VacantLand.layoutApprovalAuthority ? VacantLand.layoutApprovalAuthority : ''}
                        onChange={(event, index, value) => {
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChange(e, 'layoutApprovalAuthority', false, '');
                        }}
                        floatingLabelText="Layout Approval Authority"
                      >
                        <MenuItem value={1} primaryText="" />
                        <MenuItem value={2} primaryText="Every Night" />
                        <MenuItem value={3} primaryText="Weeknights" />
                        <MenuItem value={4} primaryText="Weekends" />
                        <MenuItem value={5} primaryText="Weekly" />
                      </SelectField>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.layoutPermitNumber ? fieldErrors.layoutPermitNumber : ''}
                        value={VacantLand.layoutPermitNumber ? VacantLand.layoutPermitNumber : ''}
                        onChange={e => handleChange(e, 'layoutPermitNumber', false, /^\d{20}$/g)}
                        hintText="Layout Permit Number"
                        floatingLabelText="Layout Permit Number"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <DatePicker
                        value={VacantLand.layoutPermitDate ? VacantLand.effectiveDate : ''}
                        onChange={e => handleChange(e, 'layoutPermitDate', false, '')}
                        hintText="Layout Permit Date"
                        container="inline"
                      />
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>
            <Card>
              <CardHeader title={<strong style={{ color: brown500 }}>Details Of Surrounding Boundary of The Property</strong>} />

              <Card>
                <CardText>
                  <Grid>
                    <Row>
                      <Col xs={12} md={6}>
                        <TextField
                          errorText={fieldErrors.north ? fieldErrors.north : ''}
                          value={VacantLand.north ? VacantLand.north : ''}
                          onChange={e => handleChange(e, 'north', false, /^\d{1,10}$/g)}
                          hintText="North "
                          floatingLabelText="North"
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <TextField
                          errorText={fieldErrors.south ? fieldErrors.south : ''}
                          value={VacantLand.south ? VacantLand.south : ''}
                          onChange={e => handleChange(e, 'south', false, /^\d{1,10}$/g)}
                          hintText="South "
                          floatingLabelText="South"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} md={6}>
                        <TextField
                          errorText={fieldErrors.east ? fieldErrors.east : ''}
                          value={VacantLand.east ? VacantLand.east : ''}
                          onChange={e => handleChange(e, 'east', false, /^\d{1,10}$/g)}
                          hintText="East "
                          floatingLabelText="East"
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <TextField
                          errorText={fieldErrors.west ? fieldErrors.west : ''}
                          value={VacantLand.west ? VacantLand.west : ''}
                          onChange={e => handleChange(e, 'west', false, /^\d{1,10}$/g)}
                          hintText="West"
                          floatingLabelText="West"
                        />
                      </Col>
                    </Row>
                  </Grid>
                </CardText>
              </Card>
            </Card>

            <div style={{ float: 'center' }}>
              <RaisedButton type="submit" label="Create" backgroundColor={brown500} labelColor={white} />
              <RaisedButton type="button" label="Close" />
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  VacantLand: state.form.form,
  fieldErrors: state.form.fieldErrors,
  isFormValid: state.form.isFormValid,
  isTableShow: state.form.showTable,
  buttonText: state.form.buttonText,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: [],
        },
      },
    });
  },
  handleChange: (e, property, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VacantLand);
