import {
  getBreak,
  getCommonHeader,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions"; //returns action object
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import { get, set } from "lodash";
import { ifUserRoleExists, loadHospitals, loadMdmsData } from "./../utils";
import { birthSearchCard } from "./birthSearchResources/birthSearchCard";
import { searchResults } from "./birthSearchResources/searchResults";
import "./birthSearchResources/index.css";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD",
});

const getCertificate = {
  uiFramework: "material-ui",
  name: "getCertificate",
  beforeInitScreen: (action, state, dispatch) => {
    loadMdmsData(action, state, dispatch).then((response) => {
      const tenants = get(response, "MdmsRes.tenant.tenants");
      //Requires City Module Updations of MDMS? tobechanged
      let jpFilter = "$[?(@.code != 'pb')]";
      let onlyCBs = jp.query(tenants, jpFilter);
      if (!(process.env.REACT_APP_NAME === "Citizen")) {
        let tenantId = getTenantId();
        let currentCbFilter = "$[?(@.code == '" + tenantId + "')]";
        onlyCBs = jp.query(onlyCBs, currentCbFilter);

        dispatch(prepareFinalObject("bnd.birth.tenantId", tenantId));
        loadHospitals(action, state, dispatch, "death", tenantId).then(
          (response) => {
            if (
              response &&
              response.MdmsRes &&
              response.MdmsRes["birth-death-service"] &&
              response.MdmsRes["birth-death-service"].hospitalList
            ) {
              const hptList =
                response.MdmsRes["birth-death-service"].hospitalList;
              const newList = [
                ...hptList.filter((hos) => hos.active),
                {
                  hospitalName: "Others",
                },
              ];
              for (let hospital of newList) {
                hospital.code = hospital.hospitalName;
                hospital.name = hospital.hospitalName;
              }
              dispatch(prepareFinalObject("bnd.allHospitals", newList));
            } else {
              dispatch(
                prepareFinalObject("bnd.allHospitals", [
                  { code: "Others", name: "Others" },
                ])
              );
            }
          }
        );
        set(
          action.screenConfig,
          "components.div.children.birthSearchCard.children.cardContent.children.searchContainerCommon.children.cantonmentSelect.props.isDisabled",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.birthSearchCard.children.cardContent.children.searchContainerCommon.children.gender.props.required",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.birthSearchCard.children.cardContent.children.searchContainerCommon.children.gender.required",
          false
        );
      }
      onlyCBs.sort((a, b) => (a.code > b.code ? 1 : -1));
      dispatch(prepareFinalObject("bnd.allTenants", onlyCBs));
    });

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css bd-search-header",
        id: "bndBirthSearch",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          props: {
            className: "bd-btn-hiw",
          },
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
            groupBillButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right",
              },
              visible:
                process.env.REACT_APP_NAME !== "Citizen" &&
                ifUserRoleExists("BIRTH_APPLICATION_CREATOR"),
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },
              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },
                ButtonLabel: getLabel({
                  labelName: "Group Bills",
                  labelKey: "ACTION_TEST_BIRTH_NEW_REGISTRATION",
                }),
              },
              onClickDefination: {
                action: "page_change",
                path:
                  process.env.REACT_APP_SELF_RUNNING === "true"
                    ? `/egov-ui-framework/birth-employee/newRegistration`
                    : `/birth-employee/newRegistration`,
              },
            },
            howitWorksButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right",
              },
              visible: false,
              props: {
                //variant: "outlined",
                color: "primary",
                className: "bd-btn-hiw",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45",
                  borderRadius: "inherit",
                },
              },
              onClickDefination: {
                action: "page_change",
                path: `/birth-common/how-it-works-birth`,
              },
              children: {
                helpButtonIcon: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "help-circle",
                  },
                },
                helpButtonLabel: getLabel({
                  labelName: "Birth How it Works",
                  labelKey: "BND_HELP",
                }),
              },
            },
          },
        },
        birthSearchCard,
        breakAfterSearch: getBreak(),
        searchResults,
      },
    },
  },
};

export default getCertificate;
