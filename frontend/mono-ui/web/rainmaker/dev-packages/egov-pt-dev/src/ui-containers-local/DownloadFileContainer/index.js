import React, { Component } from "react";
import { MultiDownloadCard } from "egov-ui-framework/ui-molecules";
import { connect } from "react-redux";
import get from "lodash/get";
import compact from "lodash/compact";
import "./index.scss";

class DownloadFileContainer extends Component {
  render() {
    const { data, documentData, ...rest } = this.props;
    return (
      <MultiDownloadCard data={documentData}  {...rest} documentData={documentData} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  let uploadedDocData = get(
    state.screenConfiguration.preparedFinalObject,    "ptmDocumentsUploadRedux",
    []
  );
  let keys = Object.keys(uploadedDocData)

  uploadedDocData = keys.map(key => uploadedDocData[key])

  let documentData =
    uploadedDocData &&
    uploadedDocData.map(item => {
      if (item.title && item.fileStoreId && item.name && item.link && item.linkText) {
        return {
          ...item
        }
      }
      else {
        if(item.documents && Array.isArray(item.documents) && item.documents[0].fileUrl){
          return {
            title: item.documentCode,
            link: item.documents[0].fileUrl.split(",")[0],
            linkText: "View",
            name: item.documents[0].fileName,
          };
        }
      }
    });

    documentData = compact(documentData);

  const data = ownProps.data
    ? ownProps.data
    : get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath, []);
  return { data, documentData };
};

export default connect(
  mapStateToProps,
  null
)(DownloadFileContainer);
