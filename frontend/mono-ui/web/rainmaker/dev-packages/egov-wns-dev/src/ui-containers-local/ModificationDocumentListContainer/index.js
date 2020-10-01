import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DocumentList } from "../../ui-molecules-local";
import { connect } from "react-redux";
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

class DocumentListContainer extends Component {
  render() {
    const { uploadedDocuments, ...rest } = this.props;
    return <DocumentList uploadedDocsInRedux={uploadedDocuments} {...rest} />;
  }
}

const mapStateToProps = state => {
  let documentsList = get(state, "screenConfiguration.preparedFinalObject.modificationsDocumentsContract", []);
  const documents = get(state.screenConfiguration.preparedFinalObject, "applyScreen.modificationsDocuments", []);
  const uploadedDocuments = get(state.screenConfiguration.preparedFinalObject, "displayDocs");
  return { documentsList, uploadedDocuments, documents };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(DocumentListContainer)
);