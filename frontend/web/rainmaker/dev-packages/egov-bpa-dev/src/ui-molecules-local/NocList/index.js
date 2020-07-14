import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import UploadCard from "../UploadCard";

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
  <sup style={{ color: "#5b5b5b", fontSize: "12px", paddingLeft: "5px" }}>*</sup>
);

class NocList extends Component {
  state = {
    uploadedDocIndex: 0,
    nocDocumentsUploadRedux: []
  };

  componentDidMount = () => {
    const {
      documentsList,
      prepareFinalObject
    } = this.props;
    const { nocDocumentsUploadRedux } = this.state;
    let index = 0;
    documentsList.forEach(docType => {
      docType.cards &&
        docType.cards.forEach(card => {
          if (card.subCards) {
            card.subCards.forEach(subCard => {
              let oldDocType = get(
                nocDocumentsUploadRedux,
                `[${index}].documentType`
              );
              let oldDocCode = get(
                nocDocumentsUploadRedux,
                `[${index}].documentCode`
              );
              let oldDocSubCode = get(
                nocDocumentsUploadRedux,
                `[${index}].documentSubCode`
              );
              if (
                oldDocType != docType.code ||
                oldDocCode != card.name ||
                oldDocSubCode != subCard.name
              ) {
                nocDocumentsUploadRedux[index] = {
                  documentType: docType.code,
                  documentCode: card.name,
                  documentSubCode: subCard.name
                };
              }
              index++;
            });
          } else {
            let oldDocType = get(
              nocDocumentsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              nocDocumentsUploadRedux,
              `[${index}].documentCode`
            );
            if (oldDocType != docType.code || oldDocCode != card.name) {
              nocDocumentsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                isDocumentRequired: card.required,
                isDocumentTypeRequired: card.dropDownValues
                  ? card.dropDownValues.required
                  : false
              };
              if (card && card.dropDownValues && card.dropDownValues.menu && card.dropDownValues.menu.length == 1) {
                nocDocumentsUploadRedux[index].dropDownValues = {};
                nocDocumentsUploadRedux[index].dropDownValues.value = card.dropDownValues.menu[0].code
              }
            }
            index++;
          }
        });
    });
    this.setState({ ...this.state, "nocDocumentsUploadRedux": nocDocumentsUploadRedux });
  };

  prepareDocumentsInEmployee = async (nocDocuments, bpaDetails) => {
    let documnts = [];
    if (nocDocuments) {
      Object.keys(nocDocuments).forEach(function (key) {
        if (nocDocuments && nocDocuments[key]) {
          documnts.push(nocDocuments[key]);
        }
      });
    }

    let finalDocs = [];
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
            doc.additionalDetails = docs.additionalDetails;
            if (doc.id) {
              doc.id = docs.id;
            }
            if (bpaDetails.additionalDetails) {

              finalDocs.push(doc);
            }
          })
        }
      });
      this.props.dispatch(prepareFinalObject(this.props.jsonPath, finalDocs));
    }
  }

  distinct = (value, index, self) => {
    return self.indexOf(value) === index
  };

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex, nocDocumentsUploadRedux } = this.state;
    const { prepareFinalObject, bpaDetails, wfState } = this.props;
    const fileUrl = getFileUrlFromAPI(fileStoreId).then(fileUrl);
    let nocDocuments = {};
    if (nocDocumentsUploadRedux[uploadedDocIndex] && nocDocumentsUploadRedux[uploadedDocIndex].documents) {
      nocDocumentsUploadRedux[uploadedDocIndex].documents.push({
        fileName: file.name,
        fileStoreId,
        fileUrl: Object.values(fileUrl)[0],
        isClickable: true,
        additionalDetails: {
          uploadedBy: getLoggedinUserRole(wfState),
          uploadedTime: new Date().getTime()
        }
      });
      nocDocuments = {
        ...nocDocumentsUploadRedux
      };
    } else {
      nocDocuments = {
        ...nocDocumentsUploadRedux,
        [uploadedDocIndex]: {
          ...nocDocumentsUploadRedux[uploadedDocIndex],
          documents: [
            {
              fileName: file.name,
              fileStoreId,
              fileUrl: Object.values(fileUrl)[0],
              isClickable: true,
              additionalDetails: {
                uploadedBy: getLoggedinUserRole(wfState),
                uploadedTime: new Date().getTime()
              }
            }
          ]
        }
      }
    }

    this.setState({ ...this.state, "nocDocumentsUploadRedux": nocDocuments });

    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true

    if (isEmployee) {
      this.prepareDocumentsInEmployee(nocDocuments, bpaDetails);
    }

  };

  removeDocument = (remDocIndex, docIndex) => {
    const { prepareFinalObject, bpaDetails } = this.props;
    const { nocDocumentsUploadRedux } = this.state;
    for (let key in nocDocumentsUploadRedux) {
      if (key === `${remDocIndex}`) {
        nocDocumentsUploadRedux[key].documents.splice(docIndex, 1);
      }
    }
    this.setState({ ...this.state, "nocDocumentsUploadRedux": nocDocumentsUploadRedux });
    this.forceUpdate();
    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true
    if (isEmployee) {
      this.prepareDocumentsInEmployee(nocDocumentsUploadRedux, bpaDetails);
    }
  };

  handleChange = (key, event) => {
    const { prepareFinalObject, bpaDetails } = this.props;
    const { nocDocumentsUploadRedux } = this.state;
    let nocDocuments = {
      ...nocDocumentsUploadRedux,
      [key]: {
        ...nocDocumentsUploadRedux[key],
        dropDownValues: { value: event.target.value }
      }
    };
    this.setState({ ...this.state, "nocDocumentsUploadRedux": nocDocuments });

    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true

    if (isEmployee) {
      this.prepareDocumentsInEmployee(nocDocuments, bpaDetails);
    }

  };

  getUploadCard = (card, key) => {
    const { classes, ...rest } = this.props;
    const { nocDocumentsUploadRedux } = this.state;
    let value = (nocDocumentsUploadRedux[key] && nocDocumentsUploadRedux[key].dropDownValues) ? nocDocumentsUploadRedux[key].dropDownValues.value : "";
    let jsonPath = `${this.props.jsonPath}-${key + 1}`;
    if (nocDocumentsUploadRedux[key]) {
      card.documents = nocDocumentsUploadRedux[key].documents;
      let mergedDropDownValue = { ...card.dropDownValues, ...nocDocumentsUploadRedux[key].dropDownValues }
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
          ids={jsonPath}
          jsonPath={`nocDocumentsUploadRedux`}
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

NocList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { moduleName } = screenConfiguration;
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  );
  const wfState = get(
    screenConfiguration.preparedFinalObject.applicationProcessInstances,
    "state"
  );
  return { moduleName, bpaDetails, wfState };
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
  )(NocList)
);