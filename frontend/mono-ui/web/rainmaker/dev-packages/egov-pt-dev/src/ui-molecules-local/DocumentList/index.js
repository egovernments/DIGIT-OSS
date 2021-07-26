import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl, getFileUrlFromAPI, getQueryArg, getTransformedLocale, handleFileUpload } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { AutosuggestContainer } from "../../ui-containers-local";
import { UploadSingleFile } from "../../ui-molecules-local";

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
    display: "flex",
    alignItems: "center"
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
  <sup style={{ color: "#E54D42", paddingLeft: "5px" }}>*</sup>
);

class DocumentList extends Component {
  state = {
    uploadedDocIndex: 0,
    fileUploadingStatus: null
  };

  componentDidMount = () => {
    const {
      preparedFinalObject,
      documentsList,
      documentsUploadRedux = {},
      prepareFinalObject
    } = this.props;
    const isEdit = getQueryArg(window.location.href, "action") === "edit";
    let index = 0;
    documentsList.forEach(docType => {
      docType.cards &&
        docType.cards.forEach(card => {
          if (card.subCards) {
            card.subCards.forEach(subCard => {
              let oldDocType = get(
                documentsUploadRedux,
                `[${index}].documentType`
              );
              let oldDocCode = get(
                documentsUploadRedux,
                `[${index}].documentCode`
              );
              let oldDocSubCode = get(
                documentsUploadRedux,
                `[${index}].documentSubCode`
              );
              if (
                oldDocType != docType.code ||
                oldDocCode != card.name ||
                oldDocSubCode != subCard.name
              ) {
                documentsUploadRedux[index] = {
                  documentType: docType.code,
                  documentCode: card.name,
                  documentSubCode: subCard.name
                };
              }
              index++;
            });
          } else {
            let oldDocType = get(
              documentsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              documentsUploadRedux,
              `[${index}].documentCode`
            );
            if (oldDocType != docType.code || oldDocCode != card.name) {
              documentsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                isDocumentRequired: card.required,
                isDocumentTypeRequired: card.dropdown
                  ? card.dropdown.required
                  : false
              };
            }
            index++;
          }
        });
    });
    prepareFinalObject("ptmDocumentsUploadRedux", documentsUploadRedux);
    prepareFinalObject(
      "ptmDocumentsUploadRedux.2.dropdown.value",
      `${get(preparedFinalObject, 'ptmDocumentsUploadRedux.2.documentCode', '')}.${get(preparedFinalObject, 'Property.additionalDetails.reasonForTransfer', '')}`
    )
    if (isEdit && get(preparedFinalObject, 'DocumentsPrefill', false)) {
      this.prefillDocuments();
    }
  };

  showLoading = () => {
    this.setState({ fileUploadingStatus: "uploading" });
  }
  hideLoading = () => {
    this.setState({ fileUploadingStatus: null });
  }

  prefillDocuments = async () => {
    let { preparedFinalObject, documentsUploadRedux, prepareFinalObject } = this.props;
    const propertyDocs = get(preparedFinalObject, 'Property.documents', []);
    let fileStoreIds = propertyDocs.map(document => document.fileStoreId);
    let fileUrls = fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    Object.keys(documentsUploadRedux).map(keys => {
      propertyDocs.map(doc => {
        if (doc.documentType.includes(documentsUploadRedux[keys].documentCode)) {
          documentsUploadRedux[keys].documents = [{
            fileStoreId: doc.fileStoreId,
            fileUrl: (fileUrls &&
              fileUrls[doc.fileStoreId] &&
              getFileUrl(fileUrls[doc.fileStoreId])) ||
              "",
            fileName:
              (fileUrls[doc.fileStoreId] &&
                decodeURIComponent(
                  getFileUrl(fileUrls[doc.fileStoreId])
                    .split("?")[0]
                    .split("/")
                    .pop()
                    .slice(13)
                )) ||
              `Document - ${index + 1}`
          }]
          if (get(documentsUploadRedux[keys], 'dropdown.value', null) == null) {
            documentsUploadRedux[keys] = { ...documentsUploadRedux[keys], dropdown: { value: doc.documentType } };
          } else if (get(documentsUploadRedux[keys], 'dropdown.value', null) !== doc.documentType) {
            delete documentsUploadRedux[keys].documents;
          }
        }
      })
    })
    prepareFinalObject("ptmDocumentsUploadRedux", documentsUploadRedux);
    prepareFinalObject("DocumentsPrefill", false);
  }

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex } = this.state;
    const { prepareFinalObject, documentsUploadRedux } = this.props;
    const fileUrl = await getFileUrlFromAPI(fileStoreId);

    prepareFinalObject("ptmDocumentsUploadRedux", {
      ...documentsUploadRedux,
      [uploadedDocIndex]: {
        ...documentsUploadRedux[uploadedDocIndex],
        documents: [
          {
            fileName: file.name,
            fileStoreId,
            fileUrl: Object.values(fileUrl)[0]
          }
        ]
      }
    });
    this.hideLoading();
  };

  removeDocument = remDocIndex => {
    const { prepareFinalObject } = this.props;
    prepareFinalObject(
      `ptmDocumentsUploadRedux.${remDocIndex}.documents`,
      undefined
    );
    this.forceUpdate();
  };

  handleChange = (key, event) => {
    const { documentsUploadRedux, prepareFinalObject } = this.props;
    prepareFinalObject(`ptmDocumentsUploadRedux`, {
      ...documentsUploadRedux,
      [key]: {
        ...documentsUploadRedux[key],
        dropdown: { value: event.target.value }
      }
    });
  };

  getUploadCard = (card, key) => {
    const { classes, documentsUploadRedux } = this.props;
    let jsonPath = `ptmDocumentsUploadRedux[${key}].dropdown.value`;
    return (
      <Grid container={true}>
        <Grid item={true} xs={2} sm={1} className={classes.iconDiv}>
          {documentsUploadRedux[key] && documentsUploadRedux[key].documents ? (
            <div className={classes.documentSuccess}>
              <Icon>
                <i class="material-icons">done</i>
              </Icon>
            </div>
          ) : (
            <div className={classes.documentIcon}>
              <span>{key + 1}</span>
            </div>
          )}
        </Grid>
        <Grid
          item={true}
          xs={10}
          sm={5}
          md={4}
          align="left"
          className={classes.descriptionDiv}
        >
          <LabelContainer
            labelKey={getTransformedLocale(card.name)}
            style={styles.documentName}
          />
          {card.required && requiredIcon}
        </Grid>
        <Grid item={true} xs={12} sm={6} md={4}>
          {card.dropdown && (
            <AutosuggestContainer
              select={true}
              label={{ labelKey: getTransformedLocale(card.dropdown.label) }}
              placeholder={{ labelKey: card.dropdown.label }}
              data={card.dropdown.menu}
              disabled={card.dropdown.disabled}
              optionValue="code"
              optionLabel="label"
              required={card.required}
              onChange={event => this.handleChange(key, event)}
              jsonPath={jsonPath}
              className="autocomplete-dropdown"
              labelsFromLocalisation={true}
            />
          )}
        </Grid>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={3}
          className={classes.fileUploadDiv}
        >
          <UploadSingleFile
            id={`jk-document-id-${key}`}
            classes={this.props.classes}
            handleFileUpload={e =>
              handleFileUpload(e, this.handleDocument, this.props, this.showLoading)
            }
            uploaded={
              documentsUploadRedux[key] && documentsUploadRedux[key].documents
                ? true
                : false
            }
            removeDocument={() => this.removeDocument(key)}
            documents={
              documentsUploadRedux[key] && documentsUploadRedux[key].documents
            }
            onButtonClick={() => this.onUploadClick(key)}
            inputProps={this.props.inputProps}
            buttonLabel={this.props.buttonLabel}
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, documentsList, DocumentsPrefill } = this.props;
    let index = 0;
    const { fileUploadingStatus } = this.state;
    return (
      <div>
        {fileUploadingStatus == "uploading" &&
          <div><LoadingIndicator></LoadingIndicator>
          </div>}
        {DocumentsPrefill && <div></div>}
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

DocumentList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { moduleName, preparedFinalObject } = screenConfiguration;
  const { DocumentsPrefill = false, ptmDocumentsUploadRedux = {} } = preparedFinalObject;

  return { documentsUploadRedux: ptmDocumentsUploadRedux, preparedFinalObject, moduleName, DocumentsPrefill };
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
  )(DocumentList)
);
