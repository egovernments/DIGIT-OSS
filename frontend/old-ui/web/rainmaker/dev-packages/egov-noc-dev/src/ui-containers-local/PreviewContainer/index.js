import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import MultiDocDetailCard from "../../ui-molecules-local/MultiDocDetailCard";
import UploadCard from "../../ui-molecules-local/UploadCard";
import "./index.css";

class PreviewContainer extends Component {
  state = {
    uploadedDocIndex: 0,
    editableDocuments: null
  };
  constructor(props) {
    super(props);
    const { finalCardsforPreview, ...rest } = this.props;
    this.state = {
      uploadedDocIndex: 0,
      editableDocuments: null,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (
      (state.editableDocuments == null &&
        props.finalCardsforPreview &&
        props.finalCardsforPreview.length > 0) ||
      (state.editableDocuments != null && state.editableDocuments.length > 0 && props.finalCardsforPreview.length > 0 &&
        (state.editableDocuments.length != props.finalCardsforPreview.length))
    ) {
      state.editableDocuments = Array(props.finalCardsforPreview.length).fill({
        editable: false,
      });
    }
  }
  getCard = (card, key) => {
    const { classes, finalCardsforPreview, ...rest } = this.props;
    if (this.state.editableDocuments)
      return (
        <React.Fragment>
          {this.state.editableDocuments &&
            this.state.editableDocuments.length > 0 &&
            (this.state.editableDocuments[key].editable ? (
              <div style={{ backgroundColor: "rgb(255,255,255)", padding: "10px", marginTop: "16px" }}><UploadCard
                docItem={card}
                docIndex={key}
                key={key.toString()}
                handleDocument={this.handleDocument}
                removeDocument={this.removeDocument}
                onUploadClick={this.onUploadClick}
                handleFileUpload={this.handleFileUpload}
                handleChange={this.handleChange}
                uploadedDocIndex={this.state.uploadedDocIndex}
                toggleEditClick={this.toggleEditClick}
                isFromPreview={true}
                jsonPath={`documentDetailsUploadRedux`}
                specificStyles="preview_upload_btn"
                {...rest}
              /></div>
            ) : (
                <MultiDocDetailCard
                  docItem={card}
                  docIndex={key}
                  key={key.toString()}
                  handleDocument={this.handleDocument}
                  removeDocument={this.removeDocument}
                  onUploadClick={this.onUploadClick}
                  handleFileUpload={this.handleFileUpload}
                  handleChange={this.handleChange}
                  uploadedDocIndex={this.state.uploadedDocIndex}
                  toggleEditClick={this.toggleEditClick}
                  {...rest}
                />
              ))}
        </React.Fragment>
      );
  };
  render() {
    const {
      finalCardsforPreview,
      documentData,
      nocDetails,
      ...rest
    } = this.props;

    return (
      <div>
        {finalCardsforPreview &&
          finalCardsforPreview.length > 0 &&
          finalCardsforPreview.map((card, index) => {
            return <div>{this.getCard(card, index)}</div>;
          })}
      </div>
    );
  }

  onUploadClick = (uploadedDocIndex) => {
    this.setState({ uploadedDocIndex });
  };
  toggleEditClick = (itemIndex) => {
    let items = [...this.state.editableDocuments];
    let item = { ...items[itemIndex] };
    item.editable = item.editable ? false : true;
    items[itemIndex] = item;
    this.setState({ editableDocuments: items });
  };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex } = this.state;
    const {
      prepareFinalObject,
      documentDetailsUploadRedux,
      finalCardsforPreview,
      nocDetails,
      wfState
    } = this.props;
    const fileUrl = await getFileUrlFromAPI(fileStoreId);
    let documentCode = finalCardsforPreview[uploadedDocIndex].dropDownValues.value;
    if (!documentCode) {
      let documentMenu = finalCardsforPreview[uploadedDocIndex].dropDownValues.menu;
      if (documentMenu && documentMenu.length > 0 && documentMenu.length == 1) {
        documentCode = documentMenu[0].code;
      } else {
        documentCode = finalCardsforPreview[uploadedDocIndex].documentCode
      }
    }
    let appDocumentList = [];

    let fileObj = {
      fileName: file.name,
      name: file.name,
      fileStoreId,
      fileUrl: Object.values(fileUrl)[0],
      isClickable: true,
      link: Object.values(fileUrl)[0],
      title: documentCode,
      documentType: documentCode,
      additionalDetails: {
        uploadedBy: getLoggedinUserRole(wfState),
        uploadedTime: new Date().getTime()
      }

    };
    if (
      finalCardsforPreview[uploadedDocIndex] &&
      finalCardsforPreview[uploadedDocIndex].documents
    ) {
      finalCardsforPreview[uploadedDocIndex].documents.push(fileObj);
      appDocumentList = [...finalCardsforPreview];
    } else {
      finalCardsforPreview[uploadedDocIndex]["documents"] = [fileObj];
      appDocumentList = [...finalCardsforPreview];
    }
    if (Array.isArray(nocDetails)) {
      if (nocDetails.length > 0) {
        if (nocDetails[0].documents) {
          nocDetails[0].documents.push(fileObj);
        } else {
          nocDetails[0].documents = [fileObj];
        }
      }
    } else {
      if (nocDetails.documents) {
        nocDetails.documents.push(fileObj);
      } else {
        nocDetails.documents = [fileObj];
      }
    }

    prepareFinalObject("Noc", nocDetails);
    prepareFinalObject("finalCardsforPreview", appDocumentList);
    prepareFinalObject("documentDetailsUploadRedux", appDocumentList);
  };

  removeDocument = (cardIndex, uploadedDocIndex) => {
    const { prepareFinalObject, finalCardsforPreview, nocDetails } = this.props;
    let uploadedDocs = [];
    let fileTobeRemoved =
      finalCardsforPreview[cardIndex].documents[uploadedDocIndex];

    if (Array.isArray(nocDetails)) {
      if (nocDetails.length > 0) {
        uploadedDocs = nocDetails[0].documents;
        uploadedDocs = this.getFinalDocsAfterRemovingDocument(uploadedDocs);
        nocDetails[0].documents = uploadedDocs;
      }
    } else {
      uploadedDocs = nocDetails.documents;
      uploadedDocs = this.getFinalDocsAfterRemovingDocument(
        uploadedDocs,
        fileTobeRemoved
      );
      nocDetails.documents = uploadedDocs;
    }

    finalCardsforPreview[cardIndex].documents.splice(uploadedDocIndex, 1);

    prepareFinalObject("Noc", nocDetails);
    prepareFinalObject("finalCardsforPreview", finalCardsforPreview);
    prepareFinalObject("documentDetailsUploadRedux", finalCardsforPreview);

    this.forceUpdate();
  };

  getFinalDocsAfterRemovingDocument = (docs, file) => {
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].fileStoreId == file.fileStoreId) {
        docs.splice(i, 1);
        break;
      }
    }
    return docs;
  };

  handleChange = (key, event) => {
    const { prepareFinalObject, finalCardsforPreview } = this.props;
    let appDocumentList = [];

    appDocumentList = [...finalCardsforPreview];
    appDocumentList[key].dropDownValues.value = event.target.value;
    prepareFinalObject("finalCardsforPreview", appDocumentList);
    prepareFinalObject("documentDetailsUploadRedux", appDocumentList);
  };
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;

  const documentDetailsUploadRedux = get(
    screenConfiguration.preparedFinalObject,
    "documentDetailsUploadRedux",
    []
  );
  const finalCardsforPreview = get(
    screenConfiguration.preparedFinalObject,
    "finalCardsforPreview",
    []
  );

  const nocDetails = get(screenConfiguration.preparedFinalObject, "Noc", {});
  const wfState = get(
    screenConfiguration.preparedFinalObject.applicationProcessInstances,
    "state"
  );

  return { documentDetailsUploadRedux, finalCardsforPreview, nocDetails, wfState };
};
const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(PreviewContainer);
