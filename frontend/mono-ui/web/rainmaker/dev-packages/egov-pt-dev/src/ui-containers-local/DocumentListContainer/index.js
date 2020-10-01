import { withStyles } from "@material-ui/core/styles";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import { DocumentList } from "../../ui-molecules-local";

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
// parentValue
const filterDropdownFunction = (rowObject, preparedFinalObject, filterConditon) => {
  if (!filterConditon) {
    return true;
  } else {
    if (filterConditon.parentArrayJsonPath) {
      let returnValue = false;
      const objectArray = get(preparedFinalObject, filterConditon.parentArrayJsonPath, []);
      objectArray.map(object => {
        if (rowObject.parentValue.includes(object[filterConditon.parentJsonpath])) {
          returnValue = true;
        }
      })
      return returnValue;
    }
    const objectValue = get(preparedFinalObject, filterConditon.parentJsonpath, '');
    if (rowObject.parentValue.includes(objectValue)) {
      return true;
    } else {
      return false;
    }
  }
}
const filterFunction = (rowObject, preparedFinalObject, filterConditon) => {
  if (!filterConditon) {
    return true;
  } else {
    if (filterConditon.onArray) {
      let returnValue = false;
      let objectArray = get(preparedFinalObject, filterConditon.jsonPath, []);
      if (filterConditon.arrayAttribute == "ownerType") {
        objectArray = objectArray.filter(object => {
          return !(object.isDeleted === false)
        })
      }

      objectArray.map(object => {
        if (!filterConditon.filterValue.includes(object[filterConditon.arrayAttribute])) {
          returnValue = true;
        }
      })
      return returnValue;
    }
    const objectValue = get(preparedFinalObject, filterConditon.jsonPath, '');
    if (!filterConditon.filterValue.includes(objectValue)) {
      return true;
    } else {
      return false;
    }
  }
}
const mapStateToProps = state => {
  let preparedFinalObject = get(state, 'screenConfiguration.preparedFinalObject', {})
  const reasonForTransfer = get(preparedFinalObject, 'Property.additionalDetails.reasonForTransfer', '');
  let documentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsContract",
    []
  );
  documentsList.map(documentList => {
    documentList.cards.map(document => {
      if (document.code.includes("TRANSFERREASONDOCUMENT")) {
        document.dropdown.value = reasonForTransfer;
        document.dropdown.disabled = true;
      }
      document.dropdown.menu = document.dropdown.menu.filter(menu => filterDropdownFunction(menu, preparedFinalObject, document.dropdownFilter));
      document.dropdown.menu.map((item, key) => {
        document.dropdown.menu[key].name = item.label;
      });
    });
    documentList.cards = documentList.cards.filter(document => filterFunction(document, preparedFinalObject, document.filterCondition));
  });
  return { documentsList, preparedFinalObject };
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
