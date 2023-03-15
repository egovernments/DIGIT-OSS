import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getCommonContainer,
  getPattern,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabelWithValue,
  getBreak,
  getLabel,
  getSelectField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";
import { setProposedBuildingData } from "../../utils/index.js";

export const buildingPlanScrutinyDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Building Plan Scrutiny Application Details",
      labelKey: "BPA_APPLICATION_SCRUNITY_DETAILS_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  buildingPlanScrutinyDetailsContainer: getCommonContainer({
    buildingplanscrutinyapplicationnumber: getLabelWithValue(
      {
        labelName: "eDCR Number",
        labelKey: "BPA_EDCR_NO_LABEL"
      },
      {
        jsonPath: "scrutinyDetails.edcrNumber"
      }
    ),

    uploadedfile: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "downloadFile",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 3
      },
      props: {
          label: {
            labelName: "Uploaded Diagram",
            labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM"
          },
          linkDetail: {
            labelName: "uploadedDiagram.dxf",
            labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM_DXF"
          },
          jsonPath: "scrutinyDetails.updatedDxfFile",
      },
      type: "array"
    },
    scrutinyreport: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "downloadFile",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 3
    },
    props: {
        label: {
          labelName: "Scrutiny Report",
          labelKey: "BPA_BASIC_DETAILS_SCRUTINY_REPORT"
        },
        linkDetail: {
          labelName: "ScrutinyReport.pdf",
          labelKey: "BPA_BASIC_DETAILS_SCRUTINY_REPORT_PDF"
        },
        jsonPath: "scrutinyDetails.planReport",
      },
    type: "array"
    }
  })
});

export const proposedBuildingDetails = getCommonCard({
  headertitle: getCommonTitle(
    {
      labelName: "Block wise occupancy /sub occupancy and usage details",
      labelKey: "BPA_APPLICATION_BLOCK_WISE_OCCUPANCY_SUB_OCCUPANCY_USAGE_TITLE"
    },
    {
      style: {
        marginBottom: 10
      }
    }
  ),
  buildingheaderDetails : getCommonContainer({
    header: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
          style: {
            fontSize: "18px",
            paddingLeft: "10px",
            paddingTop: "14px"
          }
        },
      children: {
        proposedLabel: getLabel({
          labelName: "Proposed Building Details",
          labelKey: "BPA_APPLICATION_PROPOSED_BUILDING_LABEL"
        })
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
    },
    occupancyType: {
      ...getSelectField({
        label: {
          labelName: "Occupancy Type",
          labelKey: "BPA_OCCUPANCY_TYPE"
        },
        placeholder: {
          labelName: "Select Occupancy Type",
          labelKey: "BPA_OCCUPANCY_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "BPA",
          masterName: "OCCUPANCYTYPE"
        },
        jsonPath: "BPA.occupancyType",
        sourceJsonPath: "applyScreenMdmsData.BPA.OccupancyType",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true,
          className: "tl-trade-type"
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let path = action.componentJsonpath.replace(
          /.occupancyType/,
          //".proposedContainer.children.component.props.scheama.children.cardContent.children.children.subOccupancyType"
          ".subOccupancyType"
        );
        let occupancyType = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.SubOccupancyType",
          []
        );
        let subOccupancyType = occupancyType.filter(item => {
          return item.active && (item.occupancyType).toUpperCase() === (action.value).toUpperCase();
        });
        dispatch(handleField("apply", path, "props.data", subOccupancyType));
        // dispatch(prepareFinalObject("BPA.additionalDetails.isCharitableTrustBuilding", false));
      }
    },
  }),
  proposedContainer: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    visible: true,
    props: {
      className: "mymuicontainer",
    },
    children: {
      component: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
          hasAddItem: false,
          scheama: getCommonContainer({
            applicantContainer: getCommonContainer({

              header: getLabel(
                "Block",
                "",
                {
                  jsonPath: "edcr.blockDetail[0].titleData",
                  style: {
                    width: "50%",
                    marginTop: "5px"
                  }
                }
              ),
              subOccupancyType: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-bpa",
                componentPath: "AutosuggestContainer",
                // required: true,
                props: {
                  style: {
                    width: "100%",
                    cursor: "pointer"
                  },
                  label: {
                    labelName: "Sub Occupancy Type",
                    labelKey: "BPA_SUB_OCCUP_TYPE_LABEL"
                  },
                  placeholder: {
                    labelName: "Select Sub Occupancy Type",
                    labelKey: "BPA_SUB_OCCUP_TYPE_PLACEHOLDER"
                  },
                  localePrefix: {
                    moduleName: "BPA",
                    masterName: "SUBOCCUPANCYTYPE"
                  },
                  jsonPath: "edcr.blockDetail[0].occupancyType",
                  sourceJsonPath: "edcr.blockDetail[0].suboccupancyData",
                  labelsFromLocalisation: true,
                  suggestions: [],
                  fullwidth: true,
                  required: false,
                  isMulti: true,
                  inputLabelProps: {
                    shrink: true
                  }
                },
                gridDefination: {
                  xs: 12,
                  sm: 12,
                  md: 6
                }
              },
              proposedBuildingDetailsContainer: {
                uiFramework: "custom-molecules-local",
                moduleName: "egov-bpa",
                componentPath: "Table",
                props: {
                  className: "mymuitable",
                  jsonPath: "edcr.blockDetail[0].blocks",
                  style: { marginBottom: 20 },
                  columns: [
                    { key: "Floor Description", name: "BPA_COMMON_TABLE_COL_FLOOR_DES"},
                    { key: "Level", name: "BPA_COMMON_TABLE_COL_FLOOR_LEVEL"},
                    { key: "Occupancy/Sub Occupancy", name: "BPA_COMMON_TABLE_COL_OCCUP"},
                    { key: "Buildup Area", name: "BPA_COMMON_TABLE_COL_BUILD_AREA"},
                    { key: "Floor Area", name: "BPA_COMMON_TABLE_COL_FLOOR_AREA"},
                    { key: "Carpet Area", name: "BPA_COMMON_TABLE_COL_CARPET_AREA"}
                ],
                  title: "",
                  options: {
                    filterType: "dropdown",
                    responsive: "stacked",
                    selectableRows: false,
                    pagination: false,
                    selectableRowsHeader: false,
                    sortFilterList: false,
                    sort: false,
                    filter: false,
                    search: false,
                    print: false,
                    download: false,
                    viewColumns: false,
                    rowHover: false
                  }
                }
              },
            }),
          }),
          items: [],
          isReviewPage: true,
          prefixSourceJsonPath: "children.applicantContainer.children",
          sourceJsonPath: "edcr.blockDetail",
        },
        type: "array"
      },
      breakP: getBreak(),
      breakq: getBreak()
    }
  }
});

export const demolitiondetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Demolition Details",
      labelKey: "BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  demolitionDetailsContainer: getCommonContainer({
    demolitionArea: {
      ...getTextField({
        label: {
          labelName: "Demolition Area",
          labelKey: "BPA_APPLICATION_DEMOLITION_AREA_LABEL"
        },
        jsonPath: "scrutinyDetails.planDetail.planInformation.demolitionArea",
        props: {
          disabled: 'true',
          className : "tl-trade-type"
        }
      })
    }
  })
});

export const abstractProposedBuildingDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Proposed Building Abstract",
      labelKey: "BPA_PROPOSED_BUILDING_ABSTRACT_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  proposedContainer: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    visible: true,
    children: {
      breakPending: getBreak(),
      totalBuildUpAreaDetailsContainer: getCommonContainer({
        totalBuildupArea: {
          ...getTextField({
            label: {
              labelName: "Total Buildup Area (sq.mtrs)",
              labelKey: "BPA_APPLICATION_TOTAL_BUILDUP_AREA"
            },
            jsonPath: "scrutinyDetails.planDetail.virtualBuilding.totalBuitUpArea",
            props: {
              disabled: 'true',
              className: "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
        // isCharitableTrustBuilding: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-bpa",
        //   componentPath: "BpaCheckboxContainer",
        //   jsonPath: "BPA.additionalDetails.isCharitableTrustBuilding",
        //   props: {
        //     label: {
        //       labelName: "Is Charitable TrustBuilding ?",
        //       labelKey: "BPA_IS_CHARITABLE_TRUSTBUILDING_LABEL"
        //     },
        //     jsonPath: "BPA.additionalDetails.isCharitableTrustBuilding"
        //   },
        //   gridDefination: {
        //     xs: 12,
        //     sm: 12,
        //     md: 6
        //   },
        //   type: "array"
        // },
        numOfFloors: {
          ...getTextField({
            label: {
              labelName: "Total Floor Area",
              labelKey: "BPA_APPLICATION_NO_OF_FLOORS"
            },
            jsonPath: "scrutinyDetails.planDetail.blocks[0].building.totalFloors",
            props: {
              disabled: 'true',
              className: "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
        // isAffordableHousingScheme: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-bpa",
        //   componentPath: "BpaCheckboxContainer",
        //   props: {
        //     label: {
        //       labelName: "Is Affordable Housing Scheme ?",
        //       labelKey: "BPA_IS_AFFRORADABLE_HOUSING_LABEL"
        //     },
        //     jsonPath: "BPA.additionalDetails.isAffordableHousingScheme"
        //   },
        //   gridDefination: {
        //     xs: 12,
        //     sm: 12,
        //     md: 6
        //   },
        //   type: "array"
        // },
        highFromGroundLevel: {
          ...getTextField({
            label: {
              labelName: "Total Carpet Area",
              labelKey: "BPA_APPLICATION_HIGH_FROM_GROUND"
            },
            jsonPath: "scrutinyDetails.planDetail.blocks[0].building.buildingHeight",
            props: {
              disabled: 'true',
              className: "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
        // annualExpectedExpenditure: getTextField({
        //   label: {
        //     labelName: "Annual Expected Expenditure",
        //     labelKey: "BPA_ANNUAL_EXPECTED_EXPENDITURE_LABEL"
        //   },
        //   placeholder: {
        //     labelName: "Enter Annual Expected Expenditure",
        //     labelKey: "BPA_ANNUAL_EXPECTED_EXPENDITURE_PLACEHOLDER"
        //   },
        //   pattern: getPattern("Amount"),
        //   required: true,
        //   jsonPath: "BPA.additionalDetails.annualExpectedExpenditure",
        //   gridDefination: {
        //     xs: 12,
        //     sm: 12,
        //     md: 6
        //   }
        // }),
      })

    }
  }
});
