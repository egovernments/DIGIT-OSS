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
  let documentsList = get(state, "screenConfiguration.preparedFinalObject.documentsContract", []);
  let applicationStatus = get(state.screenConfiguration.preparedFinalObject, "applyScreen.applicationStatus", "");
  let disabledCheck = false;
  if(applicationStatus === "PENDING_FOR_CONNECTION_ACTIVATION") { disabledCheck = true }
  if(documentsList && documentsList.length > 0) {
    documentsList.forEach(document => {
      document.cards.forEach(card => {
        if(disabledCheck) card.disabled = true;
        else card.disabled = false;
      })
    })
  }
  const documents = get(state.screenConfiguration.preparedFinalObject, "applyScreen.documents", []);
  const uploadedDocuments = get(state.screenConfiguration.preparedFinalObject, "displayDocs");
  return { documentsList, uploadedDocuments, documents };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(DocumentListContainer)
);