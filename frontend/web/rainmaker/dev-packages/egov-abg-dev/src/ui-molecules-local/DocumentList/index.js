import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  handleFileUpload,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { UploadSingleFile } from "../../ui-molecules-local";

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
    minWidth: 250
  },
  fileUploadDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
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

const requiredIcon = (
  <sup style={{ color: "#E54D42", paddingLeft: "5px" }}>*</sup>
);

class DocumentList extends Component {
  state = {
    uploadedDocIndex: 0,
    uploadedIndex: [],
    uploadedDocuments: [],
    selectValue: []
  };

  componentDidMount = () => {
    const {
      prepareFinalObject,
      uploadedDocsInRedux: uploadedDocuments
    } = this.props;
    if (uploadedDocuments) {
      const uploadedIndex = Object.keys(uploadedDocuments).map(item => {
        return parseInt(item); //returns string so convert to integer
      });
      this.setState({ uploadedDocuments, uploadedIndex });
    }
    Object.values(uploadedDocuments).forEach((item, index) => {
      prepareFinalObject(`noc.documents[${index}]`, { ...item[0] });
    });
  };

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex, uploadedDocuments } = this.state;
    const { prepareFinalObject, documents, tenantId } = this.props;
    const { jsonPath, name } = documents[uploadedDocIndex];
    const fileUrl = await getFileUrlFromAPI(fileStoreId);
    uploadedDocuments = {
      ...uploadedDocuments,
      [uploadedDocIndex]: [
        {
          fileName: file.name,
          fileStoreId,
          fileUrl: Object.values(fileUrl)[0],
          documentType: name,
          tenantId
        }
      ]
    };

    prepareFinalObject("nocTemp.uploadedDocsInRedux", {
      ...uploadedDocuments
    });

    prepareFinalObject(jsonPath, {
      fileName: file.name,
      fileStoreId,
      fileUrl: Object.values(fileUrl)[0],
      documentType: name,
      tenantId
    });
    this.setState({ uploadedDocuments });
    this.getFileUploadStatus(true, uploadedDocIndex);
  };

  removeDocument = remDocIndex => {
    let { uploadedDocuments } = this.state;
    const { prepareFinalObject, documents } = this.props;
    const jsonPath = documents[remDocIndex].jsonPath;
    uploadedDocuments[remDocIndex] = {};
    prepareFinalObject(jsonPath, uploadedDocuments[remDocIndex]);
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

  handleChange = (key, event) => {
    const {
      screenKey,
      componentJsonpath,
      jsonPath,
      approveCheck,
      onFieldChange,
      prepareFinalObject
    } = this.props;
    onFieldChange(
      screenKey,
      componentJsonpath,
      `props.documents[${key}].selector.value`,
      event.target.value
    );
    prepareFinalObject(
      `noc.documents[${key}].selector.value`,
      event.target.value
    );
  };

  render() {
    const { classes, documents, description } = this.props;
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
                  <Grid item={true} xs={2} sm={1} className={classes.iconDiv}>
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
                  <Grid
                    item={true}
                    xs={10}
                    sm={5}
                    md={4}
                    align="left"
                    className={classes.descriptionDiv}
                  >
                    <LabelContainer
                      labelName={document.name}
                      labelKey={document.name}
                      style={documentTitle}
                    />
                    {document.required && requiredIcon}
                    <Typography variant="caption">
                      {document.statement}
                    </Typography>
                    <Typography variant="caption">{description}</Typography>
                  </Grid>
                  <Grid item={true} xs={12} sm={6} md={4}>
                    {document.selector && (
                      <FormControl required className={classes.formControl}>
                        <InputLabel shrink htmlFor="age-label-placeholder">
                          {document.selector.inputLabel}
                        </InputLabel>
                        <Select
                          value={
                            document.selector.value ||
                            document.selector.initialValue
                          }
                          onChange={event => this.handleChange(key, event)}
                          name="selected-document"
                        >
                          {document.selector.menuItems &&
                            document.selector.menuItems.map(item => {
                              return (
                                <MenuItem value={item.value}>
                                  {item.label}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
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
                      classes={this.props.classes}
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
//   const documents = get(
//     screenConfiguration.preparedFinalObject,
//     "LicensesTemp[0].applicationDocuments",
//     []
//   );
//   const tenantId = get(
//     screenConfiguration.preparedFinalObject,
//     "LicensesTemp[0].tenantId",
//     ""
//   );
//   return { documents, tenantId };
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
