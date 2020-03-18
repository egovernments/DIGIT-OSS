import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DocumentList } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

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
    const { ...rest } = this.props;
    return <DocumentList {...rest} />;
  }
 
}


const mapStateToProps = state => {
let   preparedFinalObject=get(state,'screenConfiguration.preparedFinalObject',{})
const reasonForTransfer=get(preparedFinalObject,'Property.additionalDetails.reasonForTransfer','');
  let documentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsContract",
    []
  );
  documentsList.map(documentList=>{
    documentList.cards.map(document=>{
      if(document.code.includes("TRANSFERREASONDOCUMENT")){
        document.dropdown.value=reasonForTransfer;
        document.dropdown.disabled=true;
      }
    })
  })
  return { documentsList ,preparedFinalObject};
};
const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DocumentListContainer)
);
