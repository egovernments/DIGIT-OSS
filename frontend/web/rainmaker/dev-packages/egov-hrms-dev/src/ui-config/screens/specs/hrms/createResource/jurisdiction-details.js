import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonContainer,
  getSelectField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";


const arrayCrawler = (arr, n) => {
  if (n == 1) {
    return arr.map(item => {
      return { code: item.code, name: item.name };
    });
  } else
    return arr.map(item => {
      return arrayCrawler(item.children, n - 1);
    });
};

const jurisdictionDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      jnDetailsCardContainer: getCommonContainer(
        {
          hierarchy: {
            ...getSelectField({
              label: { labelName: "Hierarchy", labelKey: "HR_HIERARCHY_LABEL" },
              placeholder: {
                labelName: "Select Hierarchy",
                labelKey: "HR_HIERARCHY_PLACEHOLDER"
              },
              localePrefix: {
                moduleName: "EGOV_LOCATION",
                masterName: "TENANTBOUNDARY"
              },
              required: true,
              gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
              },
              jsonPath: "Employee[0].jurisdictions[0].hierarchy",
              sourceJsonPath: "createScreenMdmsData.hierarchyList",
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let tenantBoundary = get(
                state.screenConfiguration.preparedFinalObject,
                `createScreenMdmsData.egov-location.TenantBoundary`,
                []
              );
              let hierarchyList = get(
                state.screenConfiguration.preparedFinalObject,
                `createScreenMdmsData.hierarchyList`,
                []
              );

              // GETTING BOUNDARY DATA FOR SELECTED HIERARCHY
              let hierarchyIndex = hierarchyList.findIndex(
                x => x.code == action.value
              );
              let selectedBoundaryData = get(
                state.screenConfiguration.preparedFinalObject,
                `createScreenMdmsData.egov-location.TenantBoundary[${hierarchyIndex}].boundary`,
                []
              );

              // AFTER SELECTION OF HIERARCHY CRAWL BOUNDARY DATA TO GET THE BOUNDARY TYPES
              let boundaryList = [];
              let crawlBoundaryData = selectedBoundaryData;
              while (crawlBoundaryData != null) {
                boundaryList.push({
                  code: crawlBoundaryData.label,
                  name: crawlBoundaryData.label
                });
                crawlBoundaryData = get(crawlBoundaryData, "children[0]", null);
              }
               
              dispatch(
                handleField(
                  "create",
                  action.componentJsonpath.replace(
                    ".hierarchy",
                    ".boundaryType"
                  ),
                  "props.data",
                  [boundaryList[0]]
                )
              );
            }
          },
          boundaryType: {
            ...getSelectField({
              label: {
                labelName: "Boundary Type",
                labelKey: "HR_BOUNDARY_TYPE_LABEL"
              },
              placeholder: {
                labelName: "Select Boundary Type",
                labelKey: "HR_BOUNDARY_TYPE_PLACEHOLDER"
              },
              localePrefix: {
                moduleName: "EGOV_LOCATION",
                masterName: "BOUNDARYTYPE"
              },
              required: true,
              gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
              },
              jsonPath: "Employee[0].jurisdictions[0].boundaryType"
            }),
            beforeFieldChange: (action, state, dispatch) => {
              // GET COMPLETE EGOV-LOCATION DATA FROM PFO
              let tenantBoundary = get(
                state.screenConfiguration.preparedFinalObject,
                `createScreenMdmsData.egov-location.TenantBoundary`,
                []
              );
              // GET HIERARCHY LIST FROM PFO
              let hierarchyList = get(
                state.screenConfiguration.preparedFinalObject,
                `createScreenMdmsData.hierarchyList`,
                []
              );
              // GET BOUNDARY LIST FROM SOURCE DATA OF THAT THIS SPECIFIC DROPDOWN (W.R.T Multiitem)
              let boundaryList = get(
                state.screenConfiguration.screenConfig.create,
                `${action.componentJsonpath}.props.data`,
                []
              );
              // GET THE CURRENT CARD NUMBER WHICH IS BEING CHANGED
              let cardNumber = action.componentJsonpath
                .match(/\[[0-9]*\]/g)
                .toString()
                .replace(/^\[|\]$/g, "");
              let selectedHierarchy = get(
                state.screenConfiguration.preparedFinalObject,
                `Employee[0].jurisdictions[${cardNumber}].hierarchy`,
                ""
              );
              // GET THE INDEX OF CURRENTLY SELECTED HIERARCHY FROM HIERARCHY LIST
              // SO AS TO GET THE BOUNDARY DATA FOR THAT HIERARCHY FROM tenantBoundary
              let hierarchyIndex = hierarchyList.findIndex(
                x => x.code == selectedHierarchy
              );
              // GET THE INDEX / LEVEL OF THE BOUNDARY TYPE SO AS TO CRAWL DATA
              let boundaryIndex = boundaryList.findIndex(
                x => x.value == action.value
              );
              // GET THE SPECIFIC DATA WHICH HAS TO BE CRAWLED
              let crawlingData = get(
                tenantBoundary[hierarchyIndex],
                "boundary.children",
                []
              );

              // A RECURSIVE FUNCTION WHICH CRAWLS THE DATA, FLATTENS ARRAY AND RETURNS A LIST
              // OF PROCESSED BOUNDARY DATA.
              let processedBoundaryData = [];
              if (boundaryIndex > 0) {
                processedBoundaryData = arrayCrawler(
                  crawlingData,
                  boundaryIndex
                )
                  .flat(boundaryIndex)
                  .map(item => {
                    return { code: item.code, name: item.name };
                  });
              } else {
                processedBoundaryData = [
                  {
                    code: get(
                      tenantBoundary[hierarchyIndex],
                      "boundary.code",
                      ""
                    ),
                    name: get(
                      tenantBoundary[hierarchyIndex],
                      "boundary.name",
                      ""
                    )
                  }
                ];
              }

              let multiTenant =  get(
                state.screenConfiguration.preparedFinalObject,
                `createScreenMdmsData.tenant.tenants`,
                []
              );
              dispatch(
                handleField(
                  "create",
                  action.componentJsonpath.replace(
                    ".boundaryType",
                    ".boundary"
                  ),
                  "props.data",
                  multiTenant
                  // processedBoundaryData
                )
              );
            }
          },
          boundary: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-hrms",
            componentPath: "AutosuggestContainer",
            jsonPath: "Employee[0].jurisdictions[0].boundary",
            props: {
              className: "hr-generic-selectfield autocomplete-dropdown",
              optionValue: "value",
              optionLabel: "label",
              label: { labelName: "Boundary", labelKey: "HR_BOUNDARY_LABEL" },
              placeholder: {
                labelName: "Select Boundary",
                labelKey: "HR_BOUNDARY_PLACEHOLDER"
              },
              localePrefix: {
                moduleName: "TENANT",
                masterName: "TENANTS"
              },
              required: true,
              required: true,
              isClearable: true,
              labelsFromLocalisation: true,
              jsonPath: "Employee[0].jurisdictions[0].boundary",
            },
            required: true,
            // sourceJsonPath: "createScreenMdmsData.hierarchyList",
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            },
          },
          role: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-hrms",
        componentPath: "AutosuggestContainer",
        jsonPath: "Employee[0].jurisdictions[0].roles",
        required: true,
        props: {
          className:"autocomplete-dropdown hrms-role-dropdown",
          label: { labelName: "Role", labelKey: "HR_ROLE_LABEL" },
          placeholder: {
            labelName: "Select Role",
            labelKey: "HR_ROLE_PLACEHOLDER"
          },
          jsonPath: "Employee[0].jurisdictions[0].roles",
          sourceJsonPath: "createScreenMdmsData.furnishedRolesList",
          labelsFromLocalisation: true,
          suggestions: [],
          fullwidth: true,
          required: true,
          inputLabelProps: {
            shrink: true
          },
          localePrefix: {
            moduleName: "ACCESSCONTROL_ROLES",
            masterName: "ROLES"
          },
          isMulti: true,
        },
        gridDefination: {
          xs: 12,
          sm: 6
        }
      }
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    items: [],
    addItemLabel: {
      labelName: "ADD JURISDICTION",
      labelKey: "HR_ADD_JURISDICTION"
    },
    headerName: "Jurisdiction",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Employee[0].jurisdictions",
    prefixSourceJsonPath:
      "children.cardContent.children.jnDetailsCardContainer.children"
  },
  type: "array"
};

export const jurisdictionDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Jurisdiction Details",
      labelKey: "HR_JURIS_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  jurisdictionDetailsCard
}, {
  style: {
    overflow: "visible"
  }
});
