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
          label: 'Uploaded Diagram',
          linkDetail : 'uploadedDiagram.dxf',
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
        label: 'Scrutiny Report',
        linkDetail: 'ScrutinyReport.pdf',
        jsonPath: "scrutinyDetails.planReport",
      },
    type: "array"
    }
  })
});

export const blockWiseOccupancyAndUsageDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Block wise occupancy /sub occupancy and usage details",
      labelKey: "BPA_APPLICATION_BLOCK_WISE_OCCUPANCY_SUB_OCCUPANCY_USAGE_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  blockWiseOccupancyAndUsageDetailscontainer: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "Block 1",
        labelKey: "BPA_APPLICATION_BLOCK1_LABEL"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    applicantTypeSelection: getCommonContainer({
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
            className : "tl-trade-type"
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let path = action.componentJsonpath.replace(
            /.occupancyType$/,
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
          dispatch(prepareFinalObject("BPA.additionalDetails.isCharitableTrustBuilding",false));
        }
      },
      subOccupancyType: {
        ...getSelectField({
          label: {
            labelName: "Sub Occupancy Type",
            labelKey: "BPA_SUB_OCCUP_TYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Sub Occupancy Type",
            labelKey: "BPA_SUB_OCCUP_TYPE_PLACEHOLDER"
          },
          jsonPath: "BPA.subOccupancyType",
          localePrefix: {
            moduleName: "BPA",
            masterName: "SUBOCCUPANCYTYPE"
          },
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props: {
            className: "applicant-details-error textfield-enterable-selection"
          }
        }),
      },
      // annualExpectedExpenditure : getTextField({
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
      //   jsonPath:
      //     "BPA.additionalDetails.annualExpectedExpenditure",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 12,
      //     md: 6
      //   }
      // }),
      // isCharitableTrustBuilding: {
      //   uiFramework: "custom-containers-local",
      //   moduleName: "egov-bpa",
      //   componentPath: "BpaCheckboxContainer",
      //   jsonPath: "BPA.additionalDetail.isPrimaryOwner",
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
      // isAffordableHousingScheme: {
      //   uiFramework: "custom-containers-local",
      //   moduleName: "egov-bpa",
      //   componentPath: "BpaCheckboxContainer",
      //   jsonPath: "BPA.additionalDetail.isAffordableHousingScheme",
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
      // }
    }),
    // blockWiseContainer: getCommonContainer({
    //   residential: {
    //     uiFramework: "custom-containers-local",
    //     moduleName: "egov-bpa",
    //     componentPath: "AutosuggestContainer",
    //     jsonPath: "BPAs[0].BPADetails.blockwiseusagedetails.residential",
    //     required: true,
    //     gridDefination: {
    //       xs: 12,
    //       sm: 12,
    //       md: 3
    //     },
    //     props: {
    //       style: {
    //         width: "100%",
    //         cursor: "pointer"
    //       },
    //       localePrefix: {
    //         moduleName: "BPA",
    //         masterName: "BLOCK"
    //       },
    //       className: "citizen-city-picker",
    //       label: { labelName: "Residential", labelKey: "BPA_APPLICATION_RESIDENTIAL_LABEL" },
    //       placeholder: {
    //       labelName: "Select Occupancy",
    //       labelKey: "BPA_APPLICATION_OCCUPANCY_PLACEHOLDER"
    //       },
    //       jsonPath: "BPAs[0].BPADetails.blockwiseusagedetails.residential",
    //       sourceJsonPath:
    //         "BPA.blocks",
    //       labelsFromLocalisation: true,
    //       fullwidth: true,
    //       required: true,
    //       inputLabelProps: {
    //         shrink: true
    //       }
    //     }
    //   },
    // }),
    break: getBreak()
  })
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

export const proposedBuildingDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Proposed Building Details",
      labelKey: "BPA_APPLICATION_PROPOSED_BUILDING_LABEL"
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
      proposedBuildingDetailsContainer: {
        uiFramework: "custom-molecules-local",
        moduleName: "egov-bpa",
        componentPath: "Table",
        props: {
          data : setProposedBuildingData,
          columns: {
            "Floor Description": {},
            "Level": {},
            "Occupancy/Sub Occupancy": {},
            "Buildup Area": {},
            "Floor Area": {},
            "Carpet Area": {}
          },
          title: "Builtup and Carpet Area Details",
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
            viewColumns: false
          }
        }
      },
      breakP: getBreak(),
      breakq: getBreak(),
      totalBuildUpAreaDetailsContainer: getCommonContainer({
        totalBuildupArea: {
          ...getTextField({
            label: {
              labelName: "Total Buildup Area (sq.mtrs)",
              labelKey: "BPA_APPLICATION_TOTAL_BUILDUP_AREA"
            },
            required: true,
            jsonPath:
              "scrutinyDetails.planDetail.blocks[0].building.totalBuitUpArea",
            props: {
              disabled: 'true',
              className : "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
        numOfFloors: {
          ...getTextField({
            label: {
              labelName: "Number Of Floors",
              labelKey: "BPA_APPLICATION_NO_OF_FLOORS"
            },
            required: true,
            jsonPath: "scrutinyDetails.planDetail.blocks[0].building.totalFloors",
            props: {
              disabled: 'true',
              className : "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
        highFromGroundLevel: {
          ...getTextField({
            label: {
              labelName: "High From Ground Level From Mumty (In Mtrs)",
              labelKey: "BPA_APPLICATION_HIGH_FROM_GROUND"
            },
            required: true,
            jsonPath:
              "scrutinyDetails.planDetail.blocks[0].building.buildingHeight",
            props: {
              disabled: 'true',
              className : "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        }
      })
    }
  }
});
