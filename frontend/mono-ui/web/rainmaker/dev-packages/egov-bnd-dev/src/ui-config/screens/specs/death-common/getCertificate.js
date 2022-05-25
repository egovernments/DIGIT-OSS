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
import { deathSearchCard } from "./deathSearchResources/deathSearchCard";
import { searchResults } from "./deathSearchResources/searchResults";
import "./deathSearchResources/index.css";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_DEATH_SEARCH_DOWNLOAD",
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

        dispatch(prepareFinalObject("bnd.death.tenantId", tenantId));
        set(
          action.screenConfig,
          "components.div.children.deathSearchCard.children.cardContent.children.searchContainerCommon.children.cantonmentSelect.props.isDisabled",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.deathSearchCard.children.cardContent.children.searchContainerCommon.children.gender.props.required",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.deathSearchCard.children.cardContent.children.searchContainerCommon.children.gender.required",
          false
        );
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
        id: "bndDeathSearch",
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
                ifUserRoleExists("DEATH_APPLICATION_CREATOR"),
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
                  labelKey: "ACTION_TEST_DEATH_NEW_REGISTRATION",
                }),
              },
              onClickDefination: {
                action: "page_change",
                path:
                  process.env.REACT_APP_SELF_RUNNING === "true"
                    ? `/egov-ui-framework/death-employee/newRegistration`
                    : `/death-employee/newRegistration`,
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
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45",
                  borderRadius: "inherit",
                },
              },
              onClickDefination: {
                action: "page_change",
                path: `/death-common/how-it-works-death`,
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
                  labelName: "Death How it Works",
                  labelKey: "BND_HELP",
                }),
              },
            },
          },
        },
        deathSearchCard,
        breakAfterSearch: getBreak(),
        searchResults,
      },
    },
  },
};

export default getCertificate;
