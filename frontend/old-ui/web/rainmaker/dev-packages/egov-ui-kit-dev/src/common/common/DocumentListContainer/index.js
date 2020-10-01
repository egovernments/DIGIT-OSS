import { withStyles } from "@material-ui/core/styles";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getPurpose } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentList from "../DocumentList";

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
  componentDidUpdate() {
    const { ptDocumentsList, prepareFinalObject, ptDocumentCount } = this.props;
    const documents = get(ptDocumentsList, '[0].cards', []) || [];
    if (ptDocumentCount != documents.length) {
      prepareFinalObject('ptDocumentCount', documents.length);
    }

  }
  render() {
    const { ...rest } = this.props;
    return <DocumentList {...rest} />;
  }
}
const filterDropdownFunction = (rowObject, preparedFinalObject, filterConditon) => {
  if (!filterConditon) {
    return true;
  } else {
    if (filterConditon.parentArrayJsonPath) {
      let returnValue = false;
      const objectArray = get(preparedFinalObject, filterConditon.parentArrayJsonPath, []);
      objectArray.map(object => {
        if (rowObject.parentValue.includes(get(object, filterConditon.parentJsonpath, null))) {
          returnValue = true;
        }
      })
      return returnValue;
    }
    const objectValue = get(preparedFinalObject, filterConditon.parentJsonpath, null);
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
      const objectArray = get(preparedFinalObject, filterConditon.jsonPath, []);
      objectArray.map(object => {
        if (!filterConditon.filterValue.includes(get(object, filterConditon.arrayAttribute, null))) {
          returnValue = true;
        }
      })
      return returnValue;
    }
    const objectValue = get(preparedFinalObject, filterConditon.jsonPath, null);
    if (!filterConditon.filterValue.includes(objectValue)) {
      return true;
    } else {
      return false;
    }
  }
}
const mapStateToProps = state => {
  let preparedFinalObject = get(state, 'common.prepareFormData', {})
  let uploadedDocuments = get(preparedFinalObject, 'Properties[0].documents', []) || [];
  let uploadedDocumentTypes = uploadedDocuments.map(document => {
    let documentTypes = document.documentType && document.documentType.split('.');
    return documentTypes && Array.isArray(documentTypes) && documentTypes.length > 1 && documentTypes[1];
  })

  let ptDocumentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsContract",
    []
  );
  let ptDocumentCount = get(
    state,
    "screenConfiguration.preparedFinalObject.ptDocumentCount",
    []
  );
  ptDocumentsList.map(documentList => {
    documentList.cards.map(document => {
      if (document.enabledActions) {
        const purpose = getPurpose();
        let documentCode = document.code.split('.');
        document.disabled = document.enabledActions[purpose].disableUpload && uploadedDocumentTypes.includes(documentCode && documentCode.length > 1 && documentCode[1]) ? true : false;
        document.dropdown.disabled = document.enabledActions[purpose].disableDropdown && uploadedDocumentTypes.includes(documentCode && documentCode.length > 1 && documentCode[1]) ? true : false;
      }
      if(document.dropdown && document.dropdown.menu){
        document.dropdown.menu = document.dropdown.menu.filter(menu => filterDropdownFunction(menu, preparedFinalObject, document.dropdownFilter));
        document.dropdown.menu.map((item,key)=>{
          document.dropdown.menu[key].name = item.label;
        })
        if (document.dropdown.menu.length == 1) {
          document.dropdown.value = get(document, 'dropdown.menu[0].code', '');
        }
      }
    })
    documentList.cards = documentList.cards.filter(document => filterFunction(document, preparedFinalObject, document.filterCondition))
  })
  return { ptDocumentsList, preparedFinalObject, ptDocumentCount };
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
  )(DocumentListContainer)
);
