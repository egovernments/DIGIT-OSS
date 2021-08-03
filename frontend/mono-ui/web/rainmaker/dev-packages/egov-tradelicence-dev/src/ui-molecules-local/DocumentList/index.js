import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { UploadSingleFile } from "../../ui-molecules-local";
import { handleFileUpload } from "../../ui-utils/commons";

const styles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginBottom: "16px",
    wordBreak: "break-word"
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
    opacity: 0
  }
});
const documentTitle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "16px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "19px"
};

class DocumentList extends Component {
  state = {
    uploadedDocIndex: 0,
    uploadedIndex: [],
    uploadedDocuments: [],
    fileUploadingStatus: null
  };

  componentDidMount = () => {
    let {
      prepareFinalObject,
      uploadedDocsInRedux: uploadedDocuments,
      documents
    } = this.props;
    if (uploadedDocuments && Object.keys(uploadedDocuments).length) {
      let simplified = Object.values(uploadedDocuments).map(item => item[0]);
      simplified = simplified.filter(document => document && document.fileUrl && document.fileName);
      documents = documents.filter(document => document);
      let uploadedDocumentsArranged = documents.reduce((acc, item, ind) => {
        const index = simplified.findIndex(i => i.documentType === item.code);
        index > -1 && (acc[ind] = [simplified[index]]);
        return acc;
      }, {});

      const uploadedIndex = Object.keys(uploadedDocumentsArranged).reduce(
        (res, curr) => {
          if (uploadedDocumentsArranged[curr].length > 0) {
            res.push(parseInt(curr)); //returns string so convert to integer
          }
          return res;
        },
        []
      );

      getQueryArg(window.location.href, "action") !== "edit" &&
        Object.values(uploadedDocuments).forEach((item, index) => {
          prepareFinalObject(
            `Licenses[0].tradeLicenseDetail.applicationDocuments[${uploadedIndex[index]}]`,
            { ...item[0] }
          );
        });

      this.setState({
        uploadedDocuments: uploadedDocumentsArranged,
        uploadedIndex
      });
    }
  };

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };


  showLoading = () => {
    this.setState({ fileUploadingStatus: "uploading" });
  }
  hideLoading = () => {
    this.setState({ fileUploadingStatus: null });
  }

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex, uploadedDocuments } = this.state;
    const { prepareFinalObject, documents, tenantId } = this.props;
    const { jsonPath, code } = documents[uploadedDocIndex];
    const fileUrl = await getFileUrlFromAPI(fileStoreId);
    uploadedDocuments = {
      ...uploadedDocuments,
      [uploadedDocIndex]: [
        {
          fileName: file.name,
          fileStoreId,
          fileUrl: Object.values(fileUrl)[0],
          documentType: code,
          tenantId
        }
      ]
    };
    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", {
      ...uploadedDocuments
    });
    prepareFinalObject(jsonPath, {
      fileName: file.name,
      fileStoreId,
      fileUrl: Object.values(fileUrl)[0],
      documentType: code,
      tenantId
    });
    this.setState({ uploadedDocuments });
    this.getFileUploadStatus(true, uploadedDocIndex);
    this.hideLoading();
  };

  removeDocument = remDocIndex => {
    let { uploadedDocuments } = this.state;
    const { prepareFinalObject, documents, preparedFinalObject } = this.props;
    const jsonPath = documents[remDocIndex].jsonPath;
    (getQueryArg(window.location.href, "action") === "edit" || getQueryArg(window.location.href, "action") === "EDITRENEWAL" || getQueryArg(window.location.href, "workflowService") === "EDITRENEWAL") &&
      uploadedDocuments[remDocIndex][0].id &&
      prepareFinalObject("LicensesTemp[0].removedDocs", [
        ...get(preparedFinalObject, "LicensesTemp[0].removedDocs", []),
        {
          ...uploadedDocuments[remDocIndex][0],
          active: false
        }
      ]);
    uploadedDocuments[remDocIndex] = [];
    prepareFinalObject(jsonPath, uploadedDocuments[remDocIndex]);
    prepareFinalObject(
      "LicensesTemp[0].uploadedDocsInRedux",
      uploadedDocuments
    );
    this.setState({ uploadedDocuments });
    this.getFileUploadStatus(false, remDocIndex);
  };

  getFileUploadStatus = (status, index) => {
    const { uploadedIndex } = this.state;
    if (status) {
      uploadedIndex.push(index);
      this.setState({ uploadedIndex });
    } else {
      const deletedIndex = uploadedIndex.findIndex(item => item === index);
      uploadedIndex.splice(deletedIndex, 1);
      this.setState({ uploadedIndex });
    }
  };
  render() {
    const { classes, documents, documentTypePrefix } = this.props;

    const { uploadedIndex } = this.state;
    const { fileUploadingStatus } = this.state;
    return (
      <div style={{ paddingTop: 10 }}>
        {fileUploadingStatus == "uploading" &&
          <div><LoadingIndicator></LoadingIndicator>
          </div>}
        {documents &&
          documents.map((document, key) => {
            return (
              <div
                key={key}
                id={`document-upload-${key}`}
                className={classes.documentContainer}
              >
                <Grid container={true}>
                  <Grid item={true} xs={2} sm={1} align="center">
                    {uploadedIndex.indexOf(key) > -1 ? (
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
                  <Grid item={true} xs={6} sm={6} align="left">
                    <LabelContainer
                      labelName={documentTypePrefix + document.code}
                      labelKey={documentTypePrefix + document.code}
                      style={documentTitle}
                    />
                    {document.required && (
                      <sup style={{ color: "#E54D42" }}>*</sup>
                    )}
                    <Typography variant="caption">
                      <LabelContainer
                        labelKey={document.statement}
                      />
                    </Typography>
                    <Typography variant="caption">
                      <LabelContainer
                        labelKey={document.description}
                      />
                    </Typography>
                  </Grid>
                  <Grid item={true} xs={12} sm={5} align="right">
                    <UploadSingleFile
                      classes={this.props.classes}
                      id={`upload-button-${key}`}
                      handleFileUpload={e =>
                        handleFileUpload(e, this.handleDocument, this.props.inputProps[key], this.showLoading)
                      }
                      uploaded={uploadedIndex.indexOf(key) > -1}
                      removeDocument={() => this.removeDocument(key)}
                      documents={this.state.uploadedDocuments[key]}
                      onButtonClick={() => this.onUploadClick(key)}
                      buttonLabel={this.props.buttonLabel}
                      inputProps={document.formatProps}
                    />
                  </Grid>
                </Grid>
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

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(DocumentList)
);