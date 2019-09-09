import React, { Component } from 'react';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import _ from 'lodash';

class UiCheckBoxGrp extends Component {
  constructor(props) {
    super(props);
  }

  getVal = (path, dateBool) => {
    var _val = _.get(this.props.formData, path);
    if (dateBool && typeof _val == 'string' && _val && _val.indexOf('-') > -1) {
      var _date = _val.split('-');
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }

    return typeof _val != 'undefined' ? _val : '';
  };

  renderCheckBox = (item, isSelected) => {
    let { formData } = this.props;
    let { getVal } = this;
    let tempDisabled = eval(item.isDisabled);
    switch (this.props.ui) {
      case 'google':
        return (
          <div className="row">
            {
              item.jsonPath.map((i, key) => {
                return (
                    <div key = {key} className={`col-md-${item.hasOwnProperty("colSpan")?item.colSpan:4}`}>
                      <Checkbox
                        id={item.jsonPath[key].split('.').join('-')}
                        style={{
                          display: item.hide ? 'none' : 'inline',
                          marginTop: '43px',
                          marginLeft: '-5px',
                        }}
                        label={item.label[key] + (item.isRequired ? ' *' : '')}
                        checked={this.props.getVal ? this.props.getVal(item.jsonPath[key]) : isSelected}
                        disabled={tempDisabled}
                        errorText={this.props.fieldErrors ? this.props.fieldErrors[item.jsonPath[key]] : 'Empty'}
                        onCheck={e =>
                          this.props.handler(
                            { target: { value: e.target.checked } },
                            item.jsonPath[key],
                            item.isRequired ? true : false,
                            '',
                            item.requiredErrMsg,
                            item.patternErrMsg,
                            item.expression,
                            item.expressionMsg
                          )
                        }
                      />
                    </div>
                  )

                }
          )
        }
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderCheckBox(this.props.item, this.props.isSelected)}</div>;
  }
}

const mapStateToProps = state => ({
  formData: state.frameworkForm.form,
});

const mapDispatchToProps = dispatch => ({
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UiCheckBoxGrp);
