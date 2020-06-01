import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getFileUrl,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { basicSummary } from "./summaryResource/basicSummary";
import { scrutinySummary } from './summaryResource/scrutinySummary';
import { applicantSummary } from "./summaryResource/applicantSummary";
import { plotAndBoundaryInfoSummary } from "./summaryResource/plotAndBoundaryInfoSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { footer } from "./summaryResource/footer";
import { basicDetails } from "./applyResource/basicDetails";
import { nocSummary } from "./summaryResource/nocSummary";
import { generateBillForBPA } from "../utils/index";

import { setResidentialList } from "../egov-bpa/searchResource/functions";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "BPA - Application Summary",
    labelKey: "BPA_SUMMARY_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  },
});

const prepareDocumentsDetailsView = async (state, dispatch) => {
  let documentsPreview = [];
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.documentDetailsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0) {
      documentsPreview.push({
        title: getTransformedLocale(doc.documentCode),
        name: doc.documents[0].fileName,
        fileStoreId: doc.documents[0].fileStoreId,
        linkText: "View"
      });
    }
  });
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : [];
  documentsPreview = documentsPreview.map(doc => {
    doc["link"] = fileUrls[doc.fileStoreId];
    return doc;
  });
  dispatch(prepareFinalObject("documentDetailsPreview", documentsPreview));
};


const prepareNocDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.nocDocumentsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0) {
      documentsPreview.push({
        title: getTransformedLocale(doc.documentCode),
        name: doc.documents[0].fileName,
        fileStoreId: doc.documents[0].fileStoreId,
        linkText: "View"
      });
    }
  });
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : [];
  documentsPreview = documentsPreview.map(doc => {
    doc["link"] = fileUrls[doc.fileStoreId];
    return doc;
  });
  
  const prepareDocumentsDetailsView = async (state, dispatch) => {
    let documentsPreview = [];
    let reduxDocuments = get(
      state,
      "screenConfiguration.preparedFinalObject.documentDetailsUploadRedux",
      {}
    );
    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {
        documentsPreview.push({
          title: getTransformedLocale(doc.documentCode),
          name: doc.documents[0].fileName,
          fileStoreId: doc.documents[0].fileStoreId,
          linkText: "View"
        });
      }
    });
    let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    let fileUrls =
      fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : [];
    documentsPreview = documentsPreview.map(doc => {
      doc["link"] = fileUrls[doc.fileStoreId];
      return doc;
    });
    dispatch(prepareFinalObject("documentDetailsPreview", documentsPreview));
  };
}
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "summary",
    beforeInitScreen: (action, state, dispatch) => {
      let applicationNumber =
        // getQueryArg(window.location.href, "applicationNumber") ||
        get(
          state.screenConfiguration.preparedFinalObject,
          "BPA.applicationNo"
        );
      let tenantId =
        getQueryArg(window.location.href, "tenantId") ||
        get(
          state.screenConfiguration.preparedFinalObject,
          "BPA.landInfo.address.city"
        );
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.uploadedDocumentDetailsCard.visible",
        false
      );
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.uploadedNocDocumentDetailsCard.visible",
        false
      );
      generateBillForBPA(dispatch, applicationNumber, tenantId, "BPA.NC_APP_FEE");
      prepareNocDocumentsView(state, dispatch);
      prepareDocumentsDetailsView(state, dispatch);
      // setResidentialList(state, dispatch);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...header
              }
            }
          },
          body: getCommonCard({
            estimateSummary: estimateSummary,
            basicSummary : basicSummary,
            scrutinySummary : scrutinySummary,
            applicantSummary: applicantSummary,
            plotAndBoundaryInfoSummary : plotAndBoundaryInfoSummary,
            documentsSummary: documentsSummary,          
            nocSummary: nocSummary
          }),
          footer: footer
        }
      }
    }
  };
  
  export default screenConfig;