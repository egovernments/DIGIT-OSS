import React, { Component } from "react";
import { MultiDownloadCard } from "egov-ui-framework/ui-molecules";
import { connect } from "react-redux";
import get from "lodash/get";
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
    state.screenConfiguration.preparedFinalObject,    "documentsUploadRedux",
    []
  );
  let keys = Object.keys(uploadedDocData)

  uploadedDocData = keys.map(key => uploadedDocData[key])

  const documentData =
    uploadedDocData &&
    uploadedDocData.map(item => {
      if (item.title && item.fileStoreId && item.name && item.link && item.linkText) {
        return {
          ...item
        }
      }
      else {
        return {
          title: item.documentCode,
          //   title: `PT_${item.title}`,
          link: item.documents && item.documents[0].fileUrl && item.documents[0].fileUrl.split(",")[0],
          //   link: item.link,
          linkText: "View",
          name: item.documents && item.documents[0] && item.documents[0].fileName,
          //name: item.name
        };
      }
    });
 

  const data = ownProps.data
    ? ownProps.data
    : get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath, []);
  return { data, documentData };
};

export default connect(
  mapStateToProps,
  null
)(DownloadFileContainer);
