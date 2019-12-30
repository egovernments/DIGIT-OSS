import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getCommonContainer,
  getPattern,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabelWithValue,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";

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
        labelName: "Building permit application Number",
        labelKey: "BPA_APPLICATION_BUILDING_PERMIT_NO_LABEL"
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
    blockWiseContainer: getCommonContainer({
      residential: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "AutosuggestContainer",
        jsonPath: "BPAs[0].BPADetails.blockwiseusagedetails.residential",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          localePrefix: {
            moduleName: "BPA",
            masterName: "BLOCK"
          },
          className: "citizen-city-picker",
          label: { labelName: "Residential", labelKey: "BPA_APPLICATION_RESIDENTIAL_LABEL" },
          placeholder: {
          labelName: "Select Occupancy",
          labelKey: "BPA_APPLICATION_OCCUPANCY_PLACEHOLDER"
          },
          jsonPath: "BPAs[0].BPADetails.blockwiseusagedetails.residential",
          sourceJsonPath:
            "BPA.blocks",
          labelsFromLocalisation: true,
          fullwidth: true,
          required: true,
          inputLabelProps: {
            shrink: true
          }
        }
      },
    }),
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
          disabled: 'true'
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
          data: [
            {
              "Floor Description": "Ground Floor",
              "Level": 0,
              "Occupancy/Sub Occupancy": "Individual residential",
              "Buildup Area": 52.22,
              "Floor Area": 51,
              "Carpet Area": 49
            },
            {
              "Floor Description": "First Floor",
              "Level": 0,
              "Occupancy/Sub Occupancy": "Individual residential",
              "Buildup Area": 52.22,
              "Floor Area": 51,
              "Carpet Area": 49
            }
          ],
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
              disabled: 'true'
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
              disabled: 'true'
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
              disabled: 'true'
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
