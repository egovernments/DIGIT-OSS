import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../../common/common';
import _ from 'lodash';

export default class UiArrayField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentValue: '',
      valueList: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    let arrayValue = this.props.getVal(this.props.item.jsonPath);
    let { valueList } = this.state;
    if (_.isArray(arrayValue) && JSON.stringify(arrayValue) != JSON.stringify(valueList)) {
      this.setState({
        valueList: arrayValue,
      });
    }
  }

  renderField = item => {
    let val = this.props.getVal(item.jsonPath);
    if (this.props.readonly === 'true') {
      return (
        <div>
          <Col xs={12}>
            <label>
              <span style={{ fontWeight: 500, fontSize: '13px' }}>{translate(item.label)}</span>
            </label>
          </Col>
          <Col xs={12}>{val && val.constructor == Array ? val.join(', ') : ''}</Col>
        </div>
      );
    } else {
      return (
        <Row>
          <Col xs={12} md={6}>
            <TextField
              className="cutustom-form-controll-for-textfield"
              id={item.jsonPath.split('.').join('-')}
              floatingLabelStyle={{
                color: '#A9A9A9',
                fontSize: '20px',
                whiteSpace: 'nowrap',
              }}
              inputStyle={{ color: '#5F5C57' }}
              floatingLabelFixed={true}
              maxLength={item.maxLength || ''}
              style={{ display: item.hide ? 'none' : 'inline-block' }}
              errorStyle={{ float: 'left' }}
              fullWidth={true}
              floatingLabelText={
                <span>
                  {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
                </span>
              }
              //value = {this.state.valueList.join(", ")}
              value={val && val.constructor == Array ? val.join(', ') : ''}
              disabled={true}
            />
          </Col>
          <Col xs={12} md={6}>
            <FloatingActionButton
              style={{ marginTop: 39 }}
              mini={true}
              onClick={() => {
                this.handleOpen();
              }}
            >
              <i className="material-icons">add</i>
            </FloatingActionButton>
          </Col>
        </Row>
      );
    }
  };

  renderArrayField = item => {
    switch (this.props.ui) {
      case 'google':
        return (
          <div>
            {this.renderField(item)}
            <Dialog
              title={this.props.item.label}
              actions={<FlatButton label={translate('pt.create.button.viewdcb.close')} primary={true} onClick={this.handleClose} />}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              <Row>
                <Col xs={12} md={8}>
                  <TextField
                    className="cutustom-form-controll-for-textfield"
                    floatingLabelStyle={{
                      color: '#696969',
                      fontSize: '20px',
                      whiteSpace: 'nowrap',
                    }}
                    inputStyle={{ color: '#5F5C57' }}
                    floatingLabelFixed={true}
                    value={this.state.currentValue}
                    maxLength={this.props.item.maxLength || ''}
                    errorStyle={{ float: 'left' }}
                    fullWidth={true}
                    floatingLabelText={<span>{this.props.item.label}</span>}
                    errorText={
                      this.state.currentValue && this.props.item.pattern && !new RegExp(this.props.item.pattern).test(this.state.currentValue)
                        ? this.props.item.patternErrMsg || 'Invalid Pattern'
                        : ''
                    }
                    onChange={e => {
                      if (e.target.value) {
                        e.target.value = e.target.value.replace(/^\s*/, '');
                        if (e.target.value[e.target.value.length - 1] == ' ' && e.target.value[e.target.value.length - 2] == ' ') return;
                      }

                      if (this.props.item.type == 'arrayNumber' && e.target.value && !/^\d.*$/.test(e.target.value)) return;
                      this.setState({ currentValue: e.target.value });
                    }}
                  />
                </Col>
                <Col xs={12} md={4}>
                  <FlatButton
                    label={translate('pt.create.groups.ownerDetails.fields.add')}
                    disabled={
                      !this.state.currentValue ||
                      (this.state.currentValue && this.props.item.pattern && !new RegExp(this.props.item.pattern).test(this.state.currentValue))
                    }
                    secondary={true}
                    style={{ marginTop: 39 }}
                    onClick={e => {
                      let list = [...this.state.valueList];
                      list.push(this.state.currentValue);
                      this.setState(
                        {
                          valueList: list,
                          currentValue: '',
                        },
                        () => {
                          this.props.handler(
                            { target: { value: this.state.valueList } },
                            this.props.item.jsonPath,
                            this.props.item.isRequired ? true : false,
                            '',
                            this.props.item.requiredErrMsg,
                            this.props.item.patternErrMsg
                          );
                        }
                      );
                    }}
                  />
                </Col>
              </Row>
              <br />
              <Col xs={12} md={12} style={this.props.item.style}>
                <Table className="table table-striped table-bordered" responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{translate('collection.pay.value')}</th>
                      <th>{translate('reports.common.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.valueList.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{v}</td>
                          <td>
                            <div
                              className="material-icons"
                              onClick={() => {
                                this.valueFromList(i);
                              }}
                            >
                              delete
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Dialog>
          </div>
        );
    }
  };

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  valueFromList = index => {
    let list = [...this.state.valueList];
    list.splice(index, 1);
    this.setState(
      {
        valueList: list,
      },
      () => {
        this.props.handler(
          {
            target: {
              value: this.state.valueList.length ? this.state.valueList : '',
            },
          },
          this.props.item.jsonPath,
          this.props.item.isRequired ? true : false,
          '',
          this.props.item.requiredErrMsg,
          this.props.item.patternErrMsg
        );
      }
    );
  };

  render() {
    return <div>{this.renderArrayField(this.props.item)}</div>;
  }
}
