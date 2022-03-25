import commonConfig from "config/common.js";
import {
  getCommonContainer, getCommonHeader, getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { setServiceCategory } from "../utils";
import "./index.css";
import { newCollectionConsumerDetailsCard } from "./newCollectionResource/neCollectionConsumerDetails";
import { newCollectionFooter } from "./newCollectionResource/newCollectionFooter";
import { newCollectionServiceDetailsCard } from "./newCollectionResource/newCollectionServiceDetails";

const getData = async (action, state, dispatch) => {

  const tenantId = getTenantId();

  let requestBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
            { name: "citymodule" },
          ],
        },
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "Help" }],
        }
      ],
    },
  };

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );

    if (payload) {
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      const citymodule = get(payload, "MdmsRes.tenant.citymodule");
      const liveTenants =
        citymodule && citymodule.filter((item) => item.code === "UC");
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.tenant.citiesByModule",
          get(liveTenants[0], "tenants")
        )
      );
    }

    let helpUrl = get(payload, "MdmsRes.common-masters.Help", []).filter(
      (item) => item.code === "UC"
    );
    // dispatch(prepareFinalObject("helpFileUrl", helpUrl&&Array.isArray(helpUrl)&&helpUrl.length>1&&helpUrl[0]&&helpUrl[0].URL));

    try {
      let payload = await httpRequest(
        "post",
        "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
        "_search",
        [{ key: "tenantId", value: `${tenantId}` }],
        { }
      );
      const mohallaData =
        payload &&
        payload.TenantBoundary[0] &&
        payload.TenantBoundary[0].boundary &&
        payload.TenantBoundary[0].boundary.reduce((result, item) => {
          result.push({
            ...item,
            name: `${tenantId
              .toUpperCase()
              .replace(/[.]/g, "_")}_REVENUE_${item.code
                .toUpperCase()
                .replace(/[._:-\s\/]/g, "_")}`,
          });
          return result;
        }, []);
      dispatch(
        prepareFinalObject("applyScreenMdmsData.tenant.localities", mohallaData)
      );

      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.ConsumerLocMohalla",
          "props.suggestions",
          mohallaData
          // payload.TenantBoundary && payload.TenantBoundary[0].boundary
        )
      );
      const mohallaLocalePrefix = {
        moduleName: `${tenantId}`,
        masterName: "REVENUE",
      };

      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.ConsumerLocMohalla",
          "props.localePrefix",
          mohallaLocalePrefix
        )
      );
      let challanNo = getQueryArg(window.location.href, "consumerCode");
      if (challanNo == null) {
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.City",
            "props.value",
            getTenantId()
          )
        );
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionFooter.children.nextButton",
            "visible",
            true
          )
        );

      }
    } catch (e) {
      console.log(e);
      dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
    }
    //End of Mohalla data

    let requestBody1 = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "BillingService",
            masterDetails: [
              {
                name: "BusinessService",
                filter: "[?(@.type=='Adhoc')]",
              },
              {
                name: "TaxHeadMaster",
              },
              {
                name: "TaxPeriod",
              },
            ],
          },
        ],
      },
    };

    try {
      let payload = null;
      payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        requestBody1
      );

      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.BillingService",
          payload.MdmsRes.BillingService
        )
      );
      setServiceCategory(
        get(payload, "MdmsRes.BillingService.BusinessService", []),
        dispatch,
        state
      );
    } catch (e) {
      console.log(e);
    }

  } catch (e) {
    console.error("Unable to fetch detail", e);
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
  }
};
//for update challan
const getChallanSearchRes = async (action, state, dispatch) => {
  try {
    let challanNo = getQueryArg(window.location.href, "consumerCode");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let businessService = getQueryArg(window.location.href, "businessService");
    const searchpayload = await httpRequest(
      "post",
      `/echallan-services/eChallan/v1/_search?challanNo=${challanNo}&tenantId=${tenantId}&businessService=${businessService}`,
      "_search",
      [],
      { }
    );
    if (
      searchpayload &&
      searchpayload.challans.length > 0 &&
      searchpayload.challans[0].applicationStatus === "ACTIVE"
    ) {
      const fetchbillPayload = await httpRequest(
        "post",
        `/billing-service/bill/v2/_fetchbill?consumerCode=${challanNo}&businessService=${businessService}&tenantId=${tenantId}`,
        "",
        [],
        { }
      );
      //Set the bill detail
      fetchbillPayload &&
        dispatch(
          prepareFinalObject(
            "ChallanTaxHeads",
            get(
              fetchbillPayload,
              "Bill[0].billDetails[0].billAccountDetails",
              []
            )
          )
        );
      let bService = searchpayload.challans[0].businessService;
      searchpayload.challans[0].consumerType = bService.split(".")[0];
      searchpayload.challans[0].amount = [];

      dispatch(prepareFinalObject("Challan", searchpayload.challans));
      //Update the field status
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.header.children.challanNumber",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.header.children.challanNumber",
          "props.number",
          challanNo
        )
      );

      dispatch(
        handleField(
          "newCollection",
          "components.div.children.header.children.header.children.key",
          "props.labelKey",
          "UC_EDIT_CHALLAN_HEADER"
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.City",
          "props.value",
          tenantId
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceCategory",
          "props.disabled",
          true
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
          "props.disabled",
          true
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.toDate",
          "props.disabled",
          false
        )
      );

      let consumerDetailsDisableFldList = ["ConsumerName", "ConsumerMobileNo", "ConsumerHouseNo", "ConsumerBuilidingName", "ConsumerStreetName", "ConsumerLocMohalla", "ConsumerPinCode"];
      consumerDetailsDisableFldList.forEach(item => {

        dispatch(
          handleField(
            "newCollection",
            `components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.${item}`,
            "props.disabled",
            true
          )
        );
      });
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionFooter.children.updateChallan",
          "visible",
          true
        )
      );
      // dispatch(
      //   handleField(
      //     "newCollection",
      //     "components.div.children.newCollectionFooter.children.cancelChallan",
      //     "visible",
      //     true
      //   )
      // );

    } else {
      dispatch(toggleSnackbar(true, { labelName: "Unable to find Challan Detail. Please search with valid Challan Detail" }, "error"));
    }
  } catch (e) {
    console.error("Unable to fetch detail", e);
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
  }
};

const newCollection = {
  uiFramework: "material-ui",
  name: "newCollection",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(toggleSpinner());

    const tenantId = getTenantId();
    const locale = getLocale() || "en_IN";
    dispatch(fetchLocalizationLabel(locale, tenantId, tenantId));
    //Flush previous data 
    dispatch(prepareFinalObject("ChallanTaxHeads", []))
    dispatch(prepareFinalObject("Challan", []));
    getData(action, state, dispatch);
    if (getQueryArg(window.location.href, "consumerCode") != null) {
      getChallanSearchRes(action, state, dispatch);
    }
    dispatch(toggleSpinner());
    return action;


  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "newCollection",
      },
      children: {
        header: getCommonContainer({
          header: getCommonHeader({
            labelName: "New Challan",
            labelKey: "UC_COMMON_HEADER",
          }),
          challanNumber: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-uc",
            componentPath: "ApplicationNoContainer",
            props: {
              number: "NA",
              label: {
                labelKey: "PAYMENT_UC_CONSUMER_CODE",
              }
            },
            visible: false
          },
        }),

        buttonDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "searchreceipt-commonButton",
            style: { textAlign: "right", display: "block" },
          },
          children: {
            searchChallan: {
              componentPath: "Button",
              props: {
                variant: "outlined",
                color: "primary",
                className: "gen-challan-btn",
                // style: {
                //   color: "primary",
                //   borderRadius: "2px",
                //   width: "250px",
                //   height: "48px",
                //   marginRight: "16px",
                // },
                //className: "uc-searchAndPayBtn-button",
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "Challan Search",
                  labelKey: "ACTION_TEST_CHALLAN_SEARCH",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  openChallanSearchForm(state, dispatch);
                },
              },
            },
            searchAndPayBtn: {
              componentPath: "Button",
              //visible: enableButton,
              props: {
                variant: "outlined",
                color: "primary",
                className: "gen-challan-btn",
                // style: {
                //   color: "primary",
                //   borderRadius: "2px",
                //   width: "250px",
                //   height: "48px",
                //   marginRight: "16px"
                // }
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "Search And Pay",
                  labelKey: "UC_SEARCHANDPAY_LABEL"
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  openPayBillForm(state, dispatch);
                }
              }
            },

          },
        },

        newCollectionConsumerDetailsCard,
        newCollectionServiceDetailsCard,
        newCollectionFooter,
      },
    },
  },
};

export default newCollection;



const openChallanSearchForm = (state, dispatch) => {
  const path = `/uc/searchChallan`;
  dispatch(setRoute(path));
};

const openPayBillForm = (state, dispatch) => {
  const path = `/abg/billSearch`;
  dispatch(setRoute(path));
};
