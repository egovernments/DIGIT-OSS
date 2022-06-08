import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Api from '../../../api/api';
import jp from 'jsonpath';
import { orange500, blue500 } from 'material-ui/styles/colors';

const styles = {
  errorStyle: {
    color: orange500,
  },
  underlineStyle: {
    borderColor: orange500,
  },
  floatingLabelStyle: {
    color: orange500,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  },
};

export default class UiImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
    };
  }

  initData(props) {
    let { item, useTimestamp } = props;
    if (item.hasOwnProperty('url') && item.url && item.url.search('\\|') > -1) {
      let splitArray = item.url.split('?');
      let context = '';
      let id = {};

      for (var j = 0; j < splitArray[0].split('/').length; j++) {
        if (j == splitArray[0].split('/').length - 1) {
          context += splitArray[0].split('/')[j];
        } else {
          context += splitArray[0].split('/')[j] + '/';
        }
      }

      let queryStringObject = splitArray[1].split('|')[0].split('&');
      for (var i = 0; i < queryStringObject.length; i++) {
        if (i) {
          id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
        }
      }

      var response = Api.commonApiPost(context, id, {}, '', useTimestamp || false, false, '', '', item.isStateLevel).then(
        function(response) {
          if (response) {
            let pipe = splitArray[1].split('|')[1];
            this.setState({
              image: jp.query(response, pipe),
            });
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }
  }

  componentDidMount() {
    this.initData(this.props);
  }

  renderImage = item => {
    // console.log(item);
    var disabledValue = false;
    if (item.isDisablePath && typeof this.props.getVal(item.isDisablePath) == 'boolean') {
      disabledValue = !this.props.getVal(item.isDisablePath);
    } else {
      disabledValue = item.isDisabled;
    }
    switch (this.props.ui) {
      case 'google':
        return (
          <div>
            <label className="custom-form-control-for-textfield">
              <span>{item.label}</span>
            </label>{' '}
            <br />
            <img src={this.state.image || item.imagePath} width={item.width || '20%'} height={item.height || '60%'} label={item.label} />
          </div>
        );
    }
  };

  render() {
    return this.renderImage(this.props.item);
  }
}
