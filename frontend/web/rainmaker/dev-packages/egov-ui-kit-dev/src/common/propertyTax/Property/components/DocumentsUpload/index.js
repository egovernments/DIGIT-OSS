import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentListContainer from "../../../../common/DocumentListContainer";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../utils/api";
import get from "lodash/get";
import {fetchDocuments} from "egov-ui-kit/redux/mdms/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

class DocumentsUpload extends Component {
  
 prepareDocumentsUploadData = (documents=[]) => {
 
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
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "PT_MUTATION_SELECT_DOC_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
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
    // const { prepareFinalObject } = this.props;
     let tenantId = getTenantId();
    // let mdmsBody = {
    //   MdmsCriteria: {
    //     tenantId: tenantId,
    //     moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "Documents" }] }],
    //   },
    // };
    // try {
     
    //  let payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody, [], {}, true);
    //   prepareFinalObject("applyScreenMdmsData", payload.MdmsRes);
    //   prepareDocumentsUploadData( payload.MdmsRes.PropertyTax.Documents);
    // } catch (e) {
    //   console.log(e);
    // }
   let respo=await this.props.fetchDocuments(tenantId);
   const { Documents=[] } = this.props;
    if(respo){
      
    }
  };
  componentDidMount(){
    this.getMdmsData();
  }
  render() {
    const{Documents,documentsContract}=this.props;
    if(Documents.length>0&&documentsContract.length==0){
      this.prepareDocumentsUploadData(Documents);
    }
    const listProps = {
      documents:documentsContract,
      
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "PT_MUTATION_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE",
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
      },
      maxFileSize: 6000,
    };
    
    return <DocumentListContainer {...listProps}></DocumentListContainer>;
  }
}
const mapStateToProps = state => {
  const { screenConfiguration,mdms } = state;
  
  const { preparedFinalObject={} } = screenConfiguration;
  const {documentsContract=[]} =preparedFinalObject;
 const {applyScreenMdmsData={}}= mdms;
  const {PropertyTax={}}=applyScreenMdmsData;
  const {Documents=[]}=PropertyTax;



  return { Documents,documentsContract};
};
const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
    fetchDocuments:(tenantId)=>dispatch(fetchDocuments(tenantId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DocumentsUpload);
