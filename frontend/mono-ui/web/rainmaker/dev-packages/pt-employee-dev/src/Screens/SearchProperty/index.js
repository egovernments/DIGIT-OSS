import React, { Component } from "react";
import { SearchProperty } from "modules/common";

class SearchProperties extends Component {
  render() {
    const { history } = this.props;
    return <SearchProperty history={history} />;
  }
}

export default SearchProperties;
