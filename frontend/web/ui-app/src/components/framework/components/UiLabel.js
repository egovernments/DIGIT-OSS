import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { connect } from 'react-redux';
import { cToN } from '../utility/utility';
import Api from '../../../api/api';
import jp from 'jsonpath';
import { translate } from '../../common/common';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';

class UiLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  setVal = () => {
    let { item, useTimestamp } = this.props;
    let self = this;
    var val = this.props.getVal(item.jsonPath, item.isDate, item.isTime);
    // console.log(item);
    if (item.configUrl && item.url) {
      let _url = item.configUrl.split('?')[0];
      let qString = {};
      if (item.configUrl.split('?')[1]) {
        let qKeys = item.configUrl.split('?')[1].split('&');
        for (let i = 0; i < qKeys.length; i++) {
          qString[qKeys[i].split('=')[0]] = qKeys[i].split('=')[1];
        }
      }

      Api.commonApiPost(_url, qString)
        .then(config => {
          _url = item.url.split('?')[0];
          qString = {};
          let qKeys = item.url
            .split('?')[1]
            .split('|')[0]
            .split('&');
          for (var i = 0; i < qKeys.length; i++) {
            if (i) {
              if (/\}/.test(qKeys[i].split('=')[1]))
                qString[qKeys[i].split('=')[0]] = _.get(
                  config,
                  qKeys[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0]
                );
              else qString[qKeys[i].split('=')[0]] = qKeys[i].split('=')[1];
            }
          }

          Api.commonApiPost(_url, qString, {}, '', useTimestamp || false).then(
            function(response) {
              if (response) {
                let keys = jp.query(response, item.url.split('?')[1].split('|')[1]);
                let values = jp.query(response, item.url.split('?')[1].split('|')[2]);
                let dropDownData = [];
                for (var k = 0; k < keys.length; k++) {
                  if (val == keys[k]) {
                    return self.setState({
                      value: values[k],
                    });
                  }
                }
              }
            },
            function(err) {
              console.log(err);
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
    } else if (val && item.hasOwnProperty('url') && item.url.search('\\|') > -1) {
      let splitArray = item.url.split('?');
      let context = '';
      let id = {};
      for (var j = 0; j < splitArray[0].split('/').length; j++) {
        context += splitArray[0].split('/')[j] + '/';
      }

      let queryStringObject = splitArray[1].split('|')[0].split('&');
      for (var i = 0; i < queryStringObject.length; i++) {
        var string = "";
        if (i) {
          if(queryStringObject[i].split('=')[1].includes(".")){
            string  = this.props.getVal(queryStringObject[i].split('=')[1]);
            id[queryStringObject[i].split('=')[0]] = string;
          }else{
            id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
          }
        }
      }

      Api.commonApiPost(context, id, {}, '', useTimestamp || false).then(
        function(response) {
          if (response) {
            let keys = jp.query(response, splitArray[1].split('|')[1]);
            let values = jp.query(response, splitArray[1].split('|')[2]);
            let dropDownData = [];
            for (var k = 0; k < keys.length; k++) {
              if (val == keys[k]) {
                return self.setState({
                  value: values[k],
                });
              }
            }
          }
        },
        function(err) {
          console.log(err);
        }
      );
    } else if (val && item.defaultValue) {
      if (_.isArray(item.defaultValue)) {
        let defaultObj = item.defaultValue.find(obj => {
          return obj.key == val;
        });
        if (defaultObj) {
          this.setState({
            value: defaultObj.value,
          });
        }
      }
    } else if (val) {
      this.setState({
        value: val,
      });
    }
  };

  componentDidMount() {
    this.setVal();
  }

  componentDidUpdate() {
    if (!this.state.value) this.setVal();
  }

  openLink(item) {
    window.open(
      item.hyperLink + '/' + encodeURIComponent(this.state.value || this.props.getVal(item.jsonPath, item.isDate)),
      'mywin',
      'left=20,top=20,width=500,height=500,toolbar=1,resizable=0'
    );
  }

  showObjectInTable = (field, spec) => {
    let { dropDownData } = this.props;
    if (Array.isArray(field)) {
      return field.map((item) => {
          let label = '';
           if (typeof item == 'object') {
             label = (item.name ? item.name : spec.cToN ? cToN(dropDownData[spec.reduxObject], item.code) : item.code);
          } else {
            label = (spec.cToN ? cToN(dropDownData[spec.reduxObject], item.code) : item.code);
          }
         return label;
      }).join(", </br>");
  }
    else {
      return spec.cToN ? cToN(dropDownData[spec.reduxObject], field) : field;
    }
  };

  renderLabel = item => {
    let { showObjectInTable } = this;

    if (item.enableDownload) {
      return (
        <div>
          <Row>
            <Col
              id={item.jsonPath.split('.').join('-')}
              style={item.hasOwnProperty('textAlign') ? { textAlign: item.textAlign } : { textAlign: 'left' }}
              xs={12}
            >
              <label>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{translate(item.label)}</span>
              </label>
            </Col>
            <Col
              id={item.jsonPath.split('.').join('-')}
              style={item.hasOwnProperty('textAlign') ? { textAlign: item.textAlign } : { textAlign: 'left' }}
              xs={12}
            >
              <a
                href={window.location.origin + '/filestore/v1/files/id?tenantId=' + localStorage.tenantId + '&fileStoreId=' + this.state.value}
                target="_blank"
              >
                {'Download'}
              </a>
            </Col>
          </Row>
        </div>
      );
    }
    return (
      <div>
        <Row>
          {!item.hasOwnProperty('isLabel') ? (
            <Col
              id={item.jsonPath ? item.jsonPath.split('.').join('-') : item.dependentJsonPath && item.dependentJsonPath.split('.').join('-')}
              style={item.hasOwnProperty('textAlign') ? { textAlign: item.textAlign } : { textAlign: 'left' }}
              xs={12}
            >
              <label>
                <span style={item.hasOwnProperty('color') ? { fontWeight: 300, fontSize: '14px', color: item.color, whiteSpace: "nowrap", fontStyle: "italic" } : { fontWeight: 600, fontSize: '13px'}}>{translate(item.label)}</span>
              </label>
            </Col>
          ) : (
            ''
          )}
          {item.hyperLink && (this.state.value || this.showObjectInTable(this.props.getVal(item.jsonPath, item.isDate), item)) ? (
            <Col style={{ textAlign: 'left' }} xs={12}>
              <FlatButton label={this.state.value || this.props.getVal(item.jsonPath, item.isDate)} primary={true} />
            </Col>
          ) : item.jsonPath ? (
            <Col
              id={item.jsonPath.split('.').join('-')}
              style={item.hasOwnProperty('textAlign') ? { textAlign: item.textAlign } : { textAlign: 'left' }}
              xs={12}
            >
              <span dangerouslySetInnerHTML={{__html : this.state.value || showObjectInTable(this.props.getVal(item.jsonPath, item.isDate), item) || 'NA'}} />
            </Col>
          ) : item.dependentJsonPath ? (
            <Col
              id={item.dependentJsonPath.split('.').join('-')}
              style={item.hasOwnProperty('textAlign') ? { textAlign: item.textAlign } : { textAlign: 'left' }}
              xs={12}
            >
              {this.props.getVal(item.dependentJsonPath) ? 'NO' : 'YES'}
            </Col>
          ) : (
            ''
          )}
        </Row>
        <br />
      </div>
    );
  };

  render() {
    return <div>{this.renderLabel(this.props.item)}</div>;
  }
}

const mapStateToProps = state => ({
  formData: state.frameworkForm.form,
  dropDownData: state.framework.dropDownData,
  dropDownOringalData: state.framework.dropDownOringalData,
});

export default connect(mapStateToProps)(UiLabel);
