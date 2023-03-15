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
import MultiDocDetailCard from "../../ui-molecules-local/MultiDocDetailCard";
import groupBy from "lodash/groupBy";

class DownloadFileContainerForFI extends React.Component {
  state = {
    data : []
  };
   componentDidMount = async () =>  {

    let { docs, documentData, bpaDetails, ...rest } = this.props;
    let fiDocumentsPreview = [];
    docs && docs.forEach(fiDoc => {    
      fiDocumentsPreview.push({
        documentCode: (fiDoc.documentType).split('.')[0]+"_"+(fiDoc.documentType).split('.')[1],
        title: getTransformedLocale(fiDoc.documentType),
        fileStoreId: fiDoc.fileStoreId,
        linkText: "View",
        additionalDetails: fiDoc.additionalDetails
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
    let cards = [];
    let documentCards = groupBy(docs, 'documentCode');
    documentCards && Object.keys(documentCards).map((doc)=>{
         let finalCard ={
          documentCode:doc,
          documents:documentCards[doc],
          wfState:documentCards[doc].wfState,
          readOnly:true
         }
         cards.push(finalCard);
    });
    this.setState({data:cards});
  }
  getCard = (card, key) => {
      return (
        <React.Fragment>
              <MultiDocDetailCard
                docItem={card}
                docIndex={key}
                key={key.toString()}
              />
        </React.Fragment>
      );
  };
  render() {
    const { documentData, bpaDetails, ...rest } = this.props;
    return (<div> 
        {this.state.data &&
        this.state.data.length > 0 &&
        this.state.data.map((card, index) => {
          return <div>{this.getCard(card, index)}</div>;
        })}
    </div>);
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