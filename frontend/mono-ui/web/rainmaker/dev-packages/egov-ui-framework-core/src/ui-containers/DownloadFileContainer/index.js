import React, { Component } from "react";
import { MultiDownloadCard } from "egov-ui-framework/ui-molecules";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.css";
import { COPYFILE_FICLONE } from "constants";

class DownloadFileContainer extends Component {
  render() {
    const { data, documentData, ...rest } = this.props;
    return (
      <MultiDownloadCard data={data} documentData={documentData} {...rest} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  //const { sourceJsonPath, jsonPath } = ownProps;
  let { data } = ownProps;

  // if (jsonPath) {
  //   const basePath = get(state, jsonPath);
  //   data = get(basePath, sourceJsonPath);
  // } else {

  if (data && data.length > 0) {
    return { data };
  } else {
    data = get(
      screenConfiguration.preparedFinalObject,
      ownProps.sourceJsonPath
    );
    return { data };
  }
};

export default connect(
  mapStateToProps,
  null
)(DownloadFileContainer);
