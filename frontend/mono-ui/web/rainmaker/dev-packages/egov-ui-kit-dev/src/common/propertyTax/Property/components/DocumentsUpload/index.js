import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { fetchDocuments } from "egov-ui-kit/redux/mdms/actions";
import { getCommonTenant } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentListContainer from "../../../../common/DocumentListContainer";


class DocumentsUpload extends Component {

  prepareDocumentsUploadData = (documents = []) => {

    documents = documents.filter(item => {
      return item.active;
    });
    let documentsContract = [];
    let tempDoc = {};
    documents.forEach(doc => {
      let card = {};
      card["code"] = doc.documentType;
      card["title"] = doc.documentType;
      card["cards"] = [];
      tempDoc[doc.documentType] = card;
    });

    documents.forEach(doc => {
      // Handle the case for multiple muildings

      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      // doc.additionalDetails=doc.additionalDetails?doc.additionalDetails:{};
      // doc.additionalDetails.enabledActions={};
      // doc.additionalDetails.enabledActions.assess={disableUpload:true,disableDropdown:true};
      // doc.additionalDetails.enabledActions.reassess={disableUpload:true,disableDropdown:true};
      // doc.additionalDetails.enabledActions.update={disableUpload:true,disableDropdown:true};
      // doc.additionalDetails.enabledActions.create={disableUpload:false,disableDropdown:false};
      if (doc.additionalDetails && doc.additionalDetails.filterCondition) {
        card["filterCondition"] = doc.additionalDetails.filterCondition;
      }
      if (doc.additionalDetails && doc.additionalDetails.dropdownFilter) {
        card["dropdownFilter"] = doc.additionalDetails.dropdownFilter;
      }
      if (doc.additionalDetails && doc.additionalDetails.enabledActions) {
        card["enabledActions"] = doc.additionalDetails.enabledActions;
      }
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "PT_MUTATION_SELECT_DOC_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          let menuItem = { code: item.code, label: getTransformedLocale(item.code) };
          if (item.parentValue) {
            menuItem['parentValue'] = item.parentValue;
          }
          return { ...menuItem };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);

    });

    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });

    this.props.prepareFinalObject("documentsContract", documentsContract);
  };

  getMdmsData = async () => {

    //  let tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
    let tenantId = getCommonTenant();
    let respo = await this.props.fetchDocuments(tenantId);
    const { Documents = [] } = this.props;
    if (respo) {

    }
  };
  componentDidMount() {
    this.props.prepareFinalObject("documentsContract", []);
    this.getMdmsData();
  }
  render() {
    const { Documents, documentsContract } = this.props;
    if (Documents.length > 0 && documentsContract.length == 0) {
      this.prepareDocumentsUploadData(Documents);
    }
    const listProps = {
      documents: documentsContract,

      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "PT_MUTATION_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE",
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
      },
      maxFileSize: 5000,
    };

    return <DocumentListContainer {...listProps}></DocumentListContainer>;
  }
}
const mapStateToProps = state => {
  const { screenConfiguration, mdms } = state;

  const { preparedFinalObject = {} } = screenConfiguration;
  const { documentsContract = [] } = preparedFinalObject;
  const { applyScreenMdmsData = {} } = mdms;
  const { PropertyTax = {} } = applyScreenMdmsData;
  const { Documents = [] } = PropertyTax;



  return { Documents, documentsContract };
};
const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
    fetchDocuments: (tenantId) => dispatch(fetchDocuments(tenantId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DocumentsUpload);
