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
    const { ...rest } = this.props;
    return <DocumentList {...rest} />;
  }
}

const mapStateToProps = state => {
  let documentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsContract",
    []
  );
  if(documentsList.length > 0) {
    documentsList.map(docList => {
      docList.cards.map(document => {
        if(document && document.dropdown && document.dropdown.menu){
          document.dropdown.menu.map((item,key)=>{
            document.dropdown.menu[key].name = item.label;
          })
        }
      })
    })
  }
  return { documentsList };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(DocumentListContainer)
);
