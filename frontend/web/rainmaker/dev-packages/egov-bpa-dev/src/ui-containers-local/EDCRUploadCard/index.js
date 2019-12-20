import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import {
  getFileUrlFromAPI,
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import { handleFileUpload } from "../../ui-utils/commons";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { UploadSingleFile } from "../../ui-molecules-local";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

const styles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginBottom: "16px"
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
// const S3_BUCKET = {
//   endPoint: "filestore/v1/files"
// };

class DocumentList extends Component {
  state = {
    uploadedDocIndex: 0,
    uploadedIndex: [],
    uploadedDocuments: []
  };

  componentDidMount = () => {
    let {
      prepareFinalObject,
      uploadedDocsInRedux: uploadedDocuments,
      documents
    } = this.props;
    if (uploadedDocuments && Object.keys(uploadedDocuments).length) {
      let simplified = Object.values(uploadedDocuments).map(item => item[0]);
      let uploadedDocumentsArranged = documents.reduce((acc, item, ind) => {
        const index = simplified.findIndex(i => i.documentType === item.name);
        !isUndefined(index) && (acc[ind] = [simplified[index]]);
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
      this.setState({
        uploadedDocuments: uploadedDocumentsArranged,
        uploadedIndex
      });
    }
    // getQueryArg(window.location.href, "action") !== "edit" &&
    //   Object.values(uploadedDocuments).forEach((item, index) => {
    //     prepareFinalObject(
    //       `Licenses[0].tradeLicenseDetail.applicationDocuments[${index}]`,
    //       { ...item[0] }
    //     );
    //   });
  };

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  handleDocument = async file => {
    let { uploadedDocIndex, uploadedDocuments } = this.state;
    const { prepareFinalObject, documents, tenantId } = this.props;
    const { jsonPath, name } = documents[uploadedDocIndex];
    uploadedDocuments = {
      ...uploadedDocuments,
      [uploadedDocIndex]: [
        {
          fileName: file.name,
          documentType: file.name
        }
      ]
    };

    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", {
      ...uploadedDocuments
    });
    prepareFinalObject(jsonPath, file);
    this.setState({ uploadedDocuments });
    this.getFileUploadStatus(true, uploadedDocIndex);
  };

  removeDocument = remDocIndex => {
    let { uploadedDocuments } = this.state;
    const { prepareFinalObject, documents, preparedFinalObject } = this.props;
    const jsonPath = documents[remDocIndex].jsonPath;
    getQueryArg(window.location.href, "action") === "edit" &&
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
    const { classes, documents, documentTypePrefix, description } = this.props;
    const { uploadedIndex } = this.state;
    return (
      <div style={{ paddingTop: 10 }}>
        {documents &&
          documents.map((document, key) => {
            return (
              <div
                key={key}
                id={`document-upload-${key}`}
                className={classes.documentContainer}
              >
                <Grid container={true}>
                  <Grid item={true} xs={6} sm={6} align="left">
                    <LabelContainer
                      labelName={documentTypePrefix + document.name}
                      labelKey={documentTypePrefix + document.name}
                      style={documentTitle}
                    />
                    {document.required && (
                      <sup style={{ color: "#E54D42" }}>*</sup>
                    )}
                    <Typography variant="caption">
                      <LabelContainer
                        labelName={description.labelName}
                        labelKey={description.labelKey}
                      />
                      {/* {description} */}
                    </Typography>
                  </Grid>
                  <Grid item={true} xs={12} sm={5} align="right">
                    <UploadSingleFile
                      classes={this.props.classes}
                      id={`upload-button-${key}`}
                      handleFileUpload={e =>
                        handleFileUpload(e, this.handleDocument, this.props)
                      }
                      uploaded={uploadedIndex.indexOf(key) > -1}
                      removeDocument={() => this.removeDocument(key)}
                      documents={this.state.uploadedDocuments[key]}
                      onButtonClick={() => this.onUploadClick(key)}
                      inputProps={this.props.inputProps}
                      buttonLabel={this.props.buttonLabel}
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

// const mapStateToProps = state => {
//   const { screenConfiguration } = state;
// const documents = get(
//   screenConfiguration.preparedFinalObject,
//   "LicensesTemp[0].applicationDocuments",
//   []
// );
// const tenantId = get(
//   screenConfiguration.preparedFinalObject,
//   "LicensesTemp[0].tenantId",
//   ""
// );
//   return { screenConfiguration };
// };

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
