import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,

  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import UploadCard from "../UploadCard";
import "./index.css";
const themeStyles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentSubCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "10px",
    border: "#d6d6d6",
    borderStyle: "solid",
    borderWidth: "1px"
  },
  documentIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px"
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white"
  },
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none"
  },
  iconDiv: {
    display: "flex",
    alignItems: "center"
  },
  descriptionDiv: {
    alignItems: "center",
    display: "block",
    marginTop: "20px",
  },
  formControl: {
    minWidth: 250,
    padding: "0px"
  },
  fileUploadDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: "5px"
  }
});

const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    paddingBottom: "5px"
  },
  documentName: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px"
  },
  dropdownLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px"
  }
};

const requiredIcon = (
  //<sup style={{ color: "#E54D42", paddingLeft: "5px" }}>*</sup>
  <sup style={{ color: "#5b5b5b", fontSize: "12px", paddingLeft: "5px" }}>*</sup>
);

class BpaDocumentList extends Component {
  state = {
    uploadedDocIndex: 0
  };

  componentDidMount = () => {
    const {
      documentsList,
      documentDetailsUploadRedux = {},
      prepareFinalObject
    } = this.props;
    let index = 0;
    documentsList.forEach(docType => {
      docType.cards &&
        docType.cards.forEach(card => {
          if (card.subCards) {
            card.subCards.forEach(subCard => {
              let oldDocType = get(
                documentDetailsUploadRedux,
                `[${index}].documentType`
              );
              let oldDocCode = get(
                documentDetailsUploadRedux,
                `[${index}].documentCode`
              );
              let oldDocSubCode = get(
                documentDetailsUploadRedux,
                `[${index}].documentSubCode`
              );
              if (
                oldDocType != docType.code ||
                oldDocCode != card.name ||
                oldDocSubCode != subCard.name
              ) {
                documentDetailsUploadRedux[index] = {
                  documentType: docType.code,
                  documentCode: card.name,
                  documentSubCode: subCard.name
                };
              }
              index++;
            });
          } else {
            let oldDocType = get(
              documentDetailsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              documentDetailsUploadRedux,
              `[${index}].documentCode`
            );
            if (oldDocType != docType.code || oldDocCode != card.name) {
              documentDetailsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                isDocumentRequired: card.required,
                isDocumentTypeRequired: card.dropDownValues
                  ? card.dropDownValues.required
                  : false
              };
            }
            index++;
          }
        });
    });
    prepareFinalObject("documentDetailsUploadRedux", documentDetailsUploadRedux);
  };

  prepareDocumentsInEmployee = async (appDocumentList, bpaDetails, wfState) => {
    let documnts = [];
    if (appDocumentList) {
      Object.keys(appDocumentList).forEach(function (key) {
        if (appDocumentList && appDocumentList[key]) {
          documnts.push(appDocumentList[key]);
        }
      });
    }

    prepareFinalObject("documentDetailsUploadRedux", {});
    let requiredDocuments = [], uploadingDocuments = [];
    if (documnts && documnts.length > 0) {
      documnts.forEach(documents => {
        if (documents && documents.documents && documents.dropDownValues && documents.dropDownValues.value) {
          documents.documents.map(docs => {
            let doc = {};
            doc.documentType = documents.dropDownValues.value;
            doc.fileStoreId = docs.fileStoreId;
            doc.fileStore = docs.fileStoreId;
            doc.fileName = docs.fileName;
            doc.fileUrl = docs.fileUrl;
            doc.isClickable = true;
            doc.additionalDetails = {
              uploadedBy: getLoggedinUserRole(wfState),
              uploadedTime: new Date().getTime()
            }
            if (doc.id) {
              doc.id = docs.id;
            }
            uploadingDocuments.push(doc);
          })
        }
      });

      let diffDocs = [];
      bpaDetails.documents.forEach(bpaDocs => {
        if (bpaDocs && bpaDocs.id) {
          diffDocs.push(bpaDocs);
        }
      });

      if (uploadingDocuments && uploadingDocuments.length > 0) {
        uploadingDocuments.forEach(tDoc => {
          diffDocs.push(tDoc);
        })
      };

      if (bpaDetails.documents && bpaDetails.documents.length > 0) {
        bpaDetails.documents = diffDocs;
        prepareFinalObject("BPA", bpaDetails.documents);
      }
    }
  }

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex } = this.state;
    const { prepareFinalObject, documentDetailsUploadRedux, bpaDetails, bpaSendBackAcionStatus, wfState } = this.props;
    const fileUrl = await getFileUrlFromAPI(fileStoreId);
    let appDocumentList = {};
    let fileObj = {
      fileName: file.name,
      fileStoreId,
      fileUrl: Object.values(fileUrl)[0],
      isClickable: true,
      additionalDetails: {
        uploadedBy: getLoggedinUserRole(wfState),
        uploadedTime: new Date().getTime()
      }
    };
    if (documentDetailsUploadRedux[uploadedDocIndex] &&
      documentDetailsUploadRedux[uploadedDocIndex].documents) {

      documentDetailsUploadRedux[uploadedDocIndex].documents.push(fileObj);
      appDocumentList = {
        ...documentDetailsUploadRedux
      };

    } else {
      appDocumentList = {
        ...documentDetailsUploadRedux,
        [uploadedDocIndex]: {
          ...documentDetailsUploadRedux[uploadedDocIndex],
          documents: [
            fileObj
          ]
        }
      }
    }

    prepareFinalObject("documentDetailsUploadRedux", appDocumentList);

    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if (isEmployee || bpaSendBackAcionStatus) {
      this.prepareDocumentsInEmployee(appDocumentList, bpaDetails, wfState);
    }
  };

  removeDocument = (remDocIndex, docIndex) => {
    const {
      documentDetailsUploadRedux,
      prepareFinalObject,
      bpaDetails,
      documentDetailsPreview,
      bpaSendBackAcionStatus
    } = this.props;

    for (let key in documentDetailsUploadRedux) {
      if (key === `${remDocIndex}`) {
        documentDetailsUploadRedux[key].documents.splice(docIndex, 1);
      }
    }
    prepareFinalObject("documentDetailsUploadRedux", documentDetailsUploadRedux);
    this.forceUpdate();
    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if (isEmployee || bpaSendBackAcionStatus) {
      this.prepareDocumentsInEmployee(documentDetailsUploadRedux, bpaDetails, documentDetailsPreview, prepareFinalObject);
    }
  };

  handleChange = (key, event) => {
    const { documentDetailsUploadRedux, prepareFinalObject, bpaDetails, bpaSendBackAcionStatus } = this.props;
    let appDocumentList = {
      ...documentDetailsUploadRedux,
      [key]: {
        ...documentDetailsUploadRedux[key],
        dropDownValues: { value: event.target.value }
      }
    }
    prepareFinalObject(`documentDetailsUploadRedux`, appDocumentList);

    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if (isEmployee || bpaSendBackAcionStatus) {
      this.prepareDocumentsInEmployee(appDocumentList, bpaDetails);
    }
  };

  getUploadCard = (card, key) => {
    const {
      classes,
      documentDetailsUploadRedux,
      documentDetailsPreview,
      bpaDetails,
      verifierDocDetailsUpload,
      applyScreenMdmsData,
      bpaSendBackAcionStatus,
      ...rest
    } = this.props;
    let jsonPath = `documentDetailsUploadRedux[${key}].dropDownValues.value`;
    let documents;
    let data = [];
    let verifierData = [];
    {
      documentDetailsUploadRedux[key] && documentDetailsUploadRedux && documentDetailsUploadRedux[key].previewdocuments && (
        documentDetailsUploadRedux[key].previewdocuments.map((docs, documentIndex) => {
          bpaDetails.documents.map(doc => {
            if (doc && docs && doc.fileStoreId === docs.fileStoreId) {
              if (doc.wfState === "SEND_TO_CITIZEN") {
                docs.createdBy = "BPA_ARCHITECT"
              }
              else if (doc.wfState === "DOC_VERIFICATION_PENDING") {
                docs.createdBy = "BPA_DOC_VERIFIER"
              }
              else if (doc.wfState === "FIELDINSPECTION_PENDING") {
                docs.createdBy = "BPA_FIELD_INSPECTOR"
              }
              else if (doc.wfState === "NOC_VERIFICATION_PENDING") {
                docs.createdBy = "BPA_NOC_VERIFIER"
              } else {
                docs.createdBy = "BPA_ARCHITECT"
              }
              data.push(docs);
            }
          })
        })
      );
    }
    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if (isEmployee || bpaSendBackAcionStatus) {
      let code;
      card.dropDownValues.menu.map(cards => {
        code = getTransformedLocale(cards.code);
        documentDetailsPreview.map(docs => {
          if (code === docs.title) {
            verifierData.push(docs)
          }
        })
      })
    }

    if (documentDetailsUploadRedux[key]) {
      card.documents = documentDetailsUploadRedux[key].documents;
      let mergedDropDownValue = { ...card.dropDownValues, ...documentDetailsUploadRedux[key].dropDownValues }
      card.dropDownValues = mergedDropDownValue;
    }
    return (
      <React.Fragment>
        <UploadCard
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
          jsonPath={`documentDetailsUploadRedux`}
          specificStyles="bpa_doc_upload_btn"
          {...rest}
        />
      </React.Fragment>
    );
  };
  render() {
    const { classes, documentsList } = this.props;
    let index = 0;
    return (
      <div>
        {documentsList &&
          documentsList.map(container => {
            return (
              <div>
                <LabelContainer
                  labelKey={getTransformedLocale(container.title)}
                  style={styles.documentTitle}
                />
                {container.cards.map(card => {
                  return (
                    <div className={classes.documentContainer}>
                      {card.hasSubCards && (
                        <LabelContainer
                          labelKey={card.name}
                          style={styles.documentTitle}
                        />
                      )}
                      {card.hasSubCards &&
                        card.subCards.map(subCard => {
                          return (
                            <div className={classes.documentSubCard}>
                              {this.getUploadCard(subCard, index++)}
                            </div>
                          );
                        })}
                      {!card.hasSubCards && (
                        <div>{this.getUploadCard(card, index++)}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    );
  }
}

BpaDocumentList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { moduleName } = screenConfiguration;
  const documentDetailsUploadRedux = get(
    screenConfiguration.preparedFinalObject,
    "documentDetailsUploadRedux",
    {}
  );
  const documentDetailsPreview = get(
    screenConfiguration.preparedFinalObject,
    "documentDetailsPreview",
    []
  );
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  );
  const wfState = get(
    screenConfiguration.preparedFinalObject.applicationProcessInstances,
    "state"
  );
  let bpaSendBackAcionStatus = get(bpaDetails, "status") && get(bpaDetails, "status").includes("CITIZEN_ACTION_PENDING");
  return { documentDetailsUploadRedux, documentDetailsPreview, moduleName, bpaDetails, bpaSendBackAcionStatus, wfState };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(themeStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BpaDocumentList)
);