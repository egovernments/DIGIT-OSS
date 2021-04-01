import React, { Component } from "react";
import { UploadFile, UploadedDocument } from "../../ui-atoms";
import { withStyles } from "@material-ui/core/styles";
import { handleFileUpload } from "../../ui-utils/commons";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none !important"
  }
});
class UploadMultipleFiles extends Component {
  state = {
    documents: []
  };
  componentDidMount = () => {
    const { documents } = this.props;
    documents  && Array.isArray(documents) && this.setState({ documents });
  };

  componentWillReceiveProps = nextProps => {
    const { documents } = nextProps || [];
    documents  && Array.isArray(documents) && this.setState({ documents });
  };

  handleDocument = (file, fileStoreId) => {
    let { documents } = this.state;
    const { maxFiles, prepareFinalObject, jsonPath } = this.props;

    if (documents && Array.isArray(documents) && documents.length + 1 > maxFiles) {
      alert(`Can only upload ${maxFiles} files`);
    } else {
      documents.push({
        fileName: file.name,
        fileStoreId,
        documentType: `Document - ${documents && documents.length + 1}`
      });
      documents.slice(0, maxFiles);
      prepareFinalObject(jsonPath, documents);
      this.setState({ documents });
    }
  };

  removeDocument = index => {
    let { documents } = this.state;
    const { prepareFinalObject, jsonPath } = this.props;
    documents.splice(index, 1);
    prepareFinalObject(jsonPath, documents);
    this.setState({ documents });
  };

  render() {
    const { documents } = this.state;
    return (
      <div>
        {documents  && Array.isArray(documents) && 
          documents.map((document, index) => {
            return (
              <div style={{ marginTop: 10 }} key={index}>
                <UploadedDocument
                  document={document}
                  removeDocument={() => this.removeDocument(index)}
                />
              </div>
            );
          })}
        <UploadFile
          buttonProps={{
            variant: "outlined",
            color: "primary",
            style: { marginLeft: 0, marginTop: 10 }
          }}
          handleFileUpload={e =>
            handleFileUpload(e, this.handleDocument, this.props)
          }
          inputProps={{ multiple: true, ...this.props.inputProps }}
          classes={this.props.classes}
          buttonLabel={this.props.buttonLabel}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { jsonPath } = ownprops;
  const documents = get(
    state.screenConfiguration.preparedFinalObject,
    jsonPath
  );
  return { documents };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadMultipleFiles)
);
