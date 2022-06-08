import React from 'react';
import { WebView } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: 'http://egov-micro-dev.egovernments.org/app/v3/employee/user/language-selection'}}
      />
    );
  }
}
