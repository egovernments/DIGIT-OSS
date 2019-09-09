import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import map from "lodash/map";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

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
              required: true,
              jsonPath: "Employee[0].jurisdictions[0].hierarchy",
              sourceJsonPath: "createScreenMdmsData.hierarchyList",
              props: {
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name"
              }
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
                // console.log(crawlBoundaryData.label);
                boundaryList.push({
                  value: crawlBoundaryData.label,
                  label: crawlBoundaryData.label
                });
                crawlBoundaryData = get(crawlBoundaryData, "children[0]", null);
              }
              // dispatch(
              //   prepareFinalObject(
              //     "createScreenMdmsData.boundaryList",
              //     boundaryList
              //   )
              // );
              dispatch(
                handleField(
                  "create",
                  action.componentJsonpath.replace(
                    ".hierarchy",
                    ".boundaryType"
                  ),
                  "props.data",
                  boundaryList
                )
              );
              // console.log("!!!!!!!ASD", action, hierarchyIndex);
              // return action;
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
              required: true,
              jsonPath: "Employee[0].jurisdictions[0].boundaryType",
              // sourceJsonPath: "createScreenMdmsData.boundaryList",
              props: {
                className: "hr-generic-selectfield",
                // data: [
                //   {
                //     value: "Block",
                //     label: "Block"
                //   },
                //   {
                //     value: "Zone",
                //     label: "Zone"
                //   }
                // ],
                optionValue: "value",
                optionLabel: "label",
                hasLocalization: false
              }
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

              // GET BOUNDARY "TYPE" LIST FROM PFO
              // let boundaryList = get(
              //   state.screenConfiguration.preparedFinalObject,
              //   `createScreenMdmsData.boundaryList`,
              //   []
              // );
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
                    return { value: item.code, label: item.name };
                  });
              } else {
                processedBoundaryData = [
                  {
                    value: get(
                      tenantBoundary[hierarchyIndex],
                      "boundary.code",
                      ""
                    ),
                    label: get(
                      tenantBoundary[hierarchyIndex],
                      "boundary.name",
                      ""
                    )
                  }
                ];
              }
              // dispatch(
              //   prepareFinalObject(
              //     "createScreenMdmsData.processedBoundaryDataList",
              //     processedBoundaryData
              //   )
              // );
              dispatch(
                handleField(
                  "create",
                  action.componentJsonpath.replace(
                    ".boundaryType",
                    ".boundary"
                  ),
                  "props.data",
                  processedBoundaryData
                )
              );
              // console.log(
              //   arrayCrawler(crawlingData, boundaryIndex).flat(boundaryIndex)
              // );
            }
          },
          boundary: {
            ...getSelectField({
              label: { labelName: "Boundary", labelKey: "HR_BOUNDARY_LABEL" },
              placeholder: {
                labelName: "Select Boundary",
                labelKey: "HR_BOUNDARY_PLACEHOLDER"
              },
              required: true,
              jsonPath: "Employee[0].jurisdictions[0].boundary",
              // sourceJsonPath: "createScreenMdmsData.processedBoundaryDataList",
              props: {
                className: "hr-generic-selectfield",
                // data: [
                //   {
                //     value: "B1",
                //     label: "Block 1"
                //   },
                //   {
                //     value: "B2",
                //     label: "Block 2"
                //   }
                // ],
                hasLocalization: false,
                optionValue: "value",
                optionLabel: "label"
              }
            })
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
});
