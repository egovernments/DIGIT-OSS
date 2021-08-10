import { getCommonCard, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import { generatePTMAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generatePTMAcknowledgement";
import { getCommonTenant } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getSearchResults } from "../../../../ui-utils/commons";
import { downloadCertificateForm, downloadReceitForm, getpayments, prepareDocumentsView, searchBill, showHideMutationDetailsCard } from "../utils/index";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import { mutationSummary } from "./applyResourceMutation/mutationSummary";
import { downloadPrintContainer } from "./functions";
import { transfereeInstitutionSummary, transfereeSummary } from "./searchPreviewResource/transfereeSummary";
import { transferorInstitutionSummary, transferorSummary } from "./searchPreviewResource/transferorSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { propertySummary } from "./summaryResource/propertySummary";
import { registrationSummary } from './summaryResource/registrationSummary';
import "./index.css";

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application Details",
    labelKey: "PT_MUTATION_APPLICATION_DETAILS"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber"),
      label: {
        labelValue: "Application No.",
        labelKey: "PT_MUTATION_APPLICATION_NO"
      }
    }
  }
});


const setDownloadMenu = (state, dispatch, tenantId, applicationNumber) => {
  /** MenuButton data based on status */
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.Property.status"
  );
  let downloadMenu = [];
  let printMenu = [];
  let certificateDownloadObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state, "screenConfiguration.preparedFinalObject.Properties"), "ptmutationcertificate", tenantId, applicationNumber);
    },
    leftIcon: "book"
  };
  let certificatePrintObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state, "screenConfiguration.preparedFinalObject.Properties"), "ptmutationcertificate", tenantId, applicationNumber, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      downloadReceitForm( tenantId, applicationNumber,"download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      downloadReceitForm( tenantId, applicationNumber, 'print');
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      generatePTMAcknowledgement(get(
        state,
        "screenConfiguration.preparedFinalObject", {}), `mutation-acknowledgement-${applicationNumber}.pdf`);
      // generatePdfFromDiv("download", applicationNumber, "#material-ui-cardContent")
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      generatePTMAcknowledgement(get(
        state,
        "screenConfiguration.preparedFinalObject", {}), 'print');
      // generatePdfFromDiv("print", applicationNumber, "#material-ui-cardContent")
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "ACTIVE":
      downloadMenu = [
        certificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        certificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "INWORKFLOW":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.printMenu",
      "props.data.menu",
      printMenu
    )
  );
  /** END */
};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const response = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "acknowledgementIds", value: applicationNumber }
  ]);
  const properties = get(response, "Properties", []);
  const propertyId = get(response, "Properties[0].propertyId", []);

  const auditResponse = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "propertyIds", value: propertyId }, {
      key: "audit",
      value: true
    }
  ]);
  let property = (properties && properties.length > 0 && properties[0]) || {};

  if (!property.workflow) {
    let workflow = {
      id: null,
      tenantId: getQueryArg(window.location.href, "tenantId"),
      businessService: "PT.MUTATION",
      businessId: getQueryArg(window.location.href, "applicationNumber"),
      action: "",
      moduleName: "PT",
      state: null,
      comment: null,
      documents: null,
      assignes: null
    };
    property.workflow = workflow;

  }

  if (property && property.owners && property.owners.length > 0) {

    let ownersTemp = [];
    let owners = [];
    property.owners.map(owner => {
      owner.documentUid = owner.documents ? owner.documents[0].documentUid : "NA";
      owner.documentType = owner.documents ? owner.documents[0].documentType : "NA";
      if (owner.status == "ACTIVE") {

        ownersTemp.push(owner);
      } else {
        owners.push(owner);
      }
    });

    property.ownersInit = owners;
    property.ownersTemp = ownersTemp;
  }
  property.ownershipCategoryTemp = property.ownershipCategory;
  property.ownershipCategoryInit = 'NA';
  // Set Institution/Applicant info card visibility
  if (
    get(
      response,
      "Properties[0].ownershipCategory",
      ""
    ).startsWith("INSTITUTION")
  ) {
    property.institutionTemp = property.institution;

    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.transfereeSummary",
        "visible",
        false
      )
    );
  } else {

    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.transfereeInstitutionSummary",
        "visible",
        false
      )
    );
  }


  let transfereeOwners = get(
    property,
    "ownersTemp", []
  );
  let transferorOwners = get(
    property,
    "ownersInit", []
  );
  let transfereeOwnersDid = true;
  let transferorOwnersDid = true;
  transfereeOwners.map(owner => {
    if (owner.ownerType != 'NONE') {
      transfereeOwnersDid = false;
    }
  })
  transferorOwners.map(owner => {
    if (owner.ownerType != 'NONE') {
      transferorOwnersDid = false;
    }

  })
  if (transferorOwnersDid) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.transferorSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentType",
        "props.style.display",
        'none'
      )
    );
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.transferorSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentID",
        "props.style.display",
        'none'
      )
    );

  }
  if (transfereeOwnersDid) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerDocumentId",
        "props.style.display",
        'none'
      )
    );
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentType",
        "props.style.display",
        'none'
      )
    );

  }

  if (auditResponse && Array.isArray(get(auditResponse, "Properties", [])) && get(auditResponse, "Properties", []).length > 0) {
    const propertiesAudit = get(auditResponse, "Properties", []);

    const propertyIndex=property.status ==  'ACTIVE' ? 1:0;
    const previousActiveProperty = propertiesAudit.filter(property => property.status == 'ACTIVE').sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];


    property.ownershipCategoryInit = previousActiveProperty.ownershipCategory;
    property.ownersInit = previousActiveProperty.owners.filter(owner => owner.status == "ACTIVE");

    if (property.ownershipCategoryInit.startsWith("INSTITUTION")) {
      property.institutionInit = previousActiveProperty.institution;

      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.transferorSummary",
          "visible",
          false
        )
      );
    } else {

      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.transferorInstitutionSummary",
          "visible",
          false
        )
      );
    }
  }


  // auditResponse
  dispatch(prepareFinalObject("Property", property));
  dispatch(prepareFinalObject("documentsUploadRedux", property.documents));
  prepareDocumentsView(state, dispatch);

  await loadPdfGenerationData(applicationNumber, tenantId);
  setDownloadMenu(state, dispatch, tenantId, applicationNumber);
};
export const setData = async (state, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "acknowledgementIds", value: applicationNumber }
  ]);

  dispatch(prepareFinalObject("Properties", get(response, "Properties", [])));
  let queryObj = [
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCodes",
      value: applicationNumber
    },
    {
      key: "businessService",
      value: 'PT.MUTATION'
    }
  ];
  const responsePayments = await getpayments(queryObj)
  dispatch(prepareFinalObject("Payments", get(responsePayments, "Payments", [])));
}

const getPropertyConfigurationMDMSData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getCommonTenant(),
      moduleDetails: [
        {
          moduleName: "PropertyTax",
          masterDetails: [{ name: "PropertyConfiguration" }]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    let propertyConfiguation = get(payload, "MdmsRes.PropertyTax.PropertyConfiguration");
    dispatch(prepareFinalObject("PropertyConfiguration", propertyConfiguation));
    showHideMutationDetailsCard(action, state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    // dispatch(unMountScreen("propertySearch"));
    // dispatch(unMountScreen("apply"));
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(prepareFinalObject("Property", {}));
    setSearchResponse(state, dispatch, applicationNumber, tenantId);
    loadUlbLogo(tenantId);
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "PT.MUTATION" }
    ];
   setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    // Hide edit buttons
    setData(state, dispatch, applicationNumber, tenantId);
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.registrationSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.transferorSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.transferorInstitutionSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );

    // set(
    //   action,
    //   "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
    //   false
    // );
    const printCont = downloadPrintContainer(
      action,
      state,
      dispatch,
      status,
      applicationNumber,
      tenantId
    );

    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    );
    getPropertyConfigurationMDMSData(action, state, dispatch);
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
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...titlebar
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              }
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          props: {
            dataPath: "Property",
            moduleName: "PT.MUTATION",
            updateUrl: "/property-services/property/_update"
          }
        },
        body: getCommonCard({
          pdfHeader: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-pt",
            componentPath: "pdfHeader"
          },
          propertySummary: propertySummary,
          transferorSummary: transferorSummary,
          transferorInstitutionSummary: transferorInstitutionSummary,
          transfereeSummary: transfereeSummary,
          transfereeInstitutionSummary: transfereeInstitutionSummary,
          mutationSummary: mutationSummary,
          registrationSummary: registrationSummary,
          documentsSummary: documentsSummary
        })
      }
    }
  }
};

export default screenConfig;
