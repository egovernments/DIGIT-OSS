import { SearchProperty } from "modules/common";
import React, { Component } from "react";

class SearchProperties extends Component {
  componentWillMount = () => {
    const { history } = this.props;
    history.push('/pt-mutation/propertySearch');
  }
  render() {
    const { history } = this.props;
    return <SearchProperty history={history} />;
  }
}

export default SearchProperties;
