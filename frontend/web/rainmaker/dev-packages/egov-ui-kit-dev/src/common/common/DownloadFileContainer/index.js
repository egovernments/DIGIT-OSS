import { MultiDownloadCard } from "egov-ui-framework/ui-molecules";
import React, { Component } from "react";
import "./index.css";

class DownloadFileContainer extends Component {
  render() {
    const { data, documentData, ...rest } = this.props;
    return (
      <MultiDownloadCard data={data} documentData={documentData} {...rest} />
    );
  }
}

export default DownloadFileContainer;
