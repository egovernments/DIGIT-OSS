import React  from "react";
import  MultiDownloadCard  from "../../ui-molecules-local/MultiDownloadCard";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.scss";
import {
  getTransformedLocale,
  getFileUrl,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";

class DownloadFileContainerForFI extends React.Component {
  state = {
    data : []
  };
   componentDidMount = async () =>  {

    let { docs, documentData, bpaDetails, ...rest } = this.props;
    let fiDocumentsPreview = [];
    docs.forEach(fiDoc => {        
      fiDocumentsPreview.push({
        title: getTransformedLocale(fiDoc.documentType),
        fileStoreId: fiDoc.fileStoreId,
        linkText: "View"
      });
    })
  
    let fileStoreIds = jp.query(fiDocumentsPreview, "$.*.fileStoreId");
    let fileUrls =
      fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
      docs = fiDocumentsPreview.map((doc, index) => {
      doc["link"] =
        (fileUrls &&
          fileUrls[doc.fileStoreId] &&
          getFileUrl(fileUrls[doc.fileStoreId])) ||
        "";
      doc["name"] =
        (fileUrls[doc.fileStoreId] &&
          decodeURIComponent(
            getFileUrl(fileUrls[doc.fileStoreId])
              .split("?")[0]
              .split("/")
              .pop()
              .slice(13)
          )) ||
        `Document - ${index + 1}`;
        return doc;
    });
    this.setState({data:docs});
  }
  render() {
    const { documentData, bpaDetails, ...rest } = this.props;
    return (<div> { this.state.data && (
      <MultiDownloadCard data={this.state.data} {...rest} />
    )}</div>);
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const docs = get(
    screenConfiguration.preparedFinalObject,
    ownProps.jsonPath,
    []
  );
  const documentData = get(
    screenConfiguration.preparedFinalObject,
    "documentDetailsUploadRedux",
    []
  );
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  );
  return { docs, documentData, bpaDetails };
};

export default connect(
  mapStateToProps,
  null
)(DownloadFileContainerForFI);
