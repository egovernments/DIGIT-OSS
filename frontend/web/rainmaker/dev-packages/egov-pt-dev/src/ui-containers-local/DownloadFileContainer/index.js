import React, { Component } from "react";
import { MultiDownloadCard } from "egov-ui-framework/ui-molecules";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.scss";

class DownloadFileContainer extends Component {
  render() {
    const { data, documentData, ...rest } = this.props;
    return (
      <MultiDownloadCard data={documentData} documentData={documentData} {...rest} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;

  let uploadedDocData = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux",
    []
  );
  let keys=Object.keys(uploadedDocData)

  uploadedDocData=keys.map(key=>uploadedDocData[key])

  const documentData =
        uploadedDocData &&
        uploadedDocData.map(item => {
          return {
            title: `PT_${item.title}`,
            link: item.link,
            linkText: "View",
            name: item.name
          };
        });
      // createEstimateData(
      //   LicenseData,
      //   "LicensesTemp[0].estimateCardData",
      //   dispatch
      // ); //get bill and populate estimate card
  
  const data = ownProps.data
    ? ownProps.data
    : get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath, []);
  return { data,documentData };
};

export default connect(
  mapStateToProps,
  null
)(DownloadFileContainer);
