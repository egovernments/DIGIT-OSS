import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getCommonContainer,
  getPattern,
  getLabelWithValue,
  getBreak,
  getSelectField,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";
import { getOcEdcrDetails } from "../../utils";
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const basicDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Basic Details",
      labelKey: "BPA_BASIC_DETAILS_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  basicDetailsContainer: getCommonContainer({
    ocScrutinynumber: getTextField({
      label: {
        labelName: "Occupancy Certificate Scrutiny Number",
        labelKey: "BPA_OC_SCRUTINY_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Occupancy Certificate Scrutiny Number",
        labelKey: "BPA_OC_SCRUTINY_NUMBER_PLACEHOLDER"
      },
      required: true,
      title: {
        value: "Please search scrutiny details linked to the scrutiny number",
        key: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_SEARCH_TITLE"
      },
      infoIcon: "info_circle",
      pattern: "^[a-zA-Z0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "BPA.edcrNumber",
      iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51",
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch, fieldInfo) => {
            getOcEdcrDetails(state, dispatch, fieldInfo);
          }
        }
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    dummyDiv2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      visible: true,
      props: {
        disabled: true,
      }
    },
    applicationType: getSelectField({
      label: {
        labelName: "Application Type",
        labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
      },
      props: {
        disabled: true,
        className: "tl-trade-type"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      required: true,
      jsonPath: "BPA.applicationType",
      sourceJsonPath: "applyScreenMdmsData.BPA.ApplicationType",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    // riskType: getTextField({
    //   label: {
    //     labelName: "Risk Type",
    //     labelKey: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL"
    //   },
    //   localePrefix: {
    //     moduleName: "WF",
    //     masterName: "BPA"
    //   },
    //   jsonPath: "BPA.riskType",
    //   required: true,
    //   gridDefination: {
    //     xs: 12,
    //     sm: 12,
    //     md: 6
    //   },
    //   props: {
    //     disabled: true,
    //     className: "tl-trade-type"
    //   }
    // }),
    riskType: getSelectField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      props: {
        disabled: true,
        className : "tl-trade-type",
        optionValue: "code",
        optionLabel: "code",
      },
      jsonPath: "BPA.riskType",
      data: [
        {
          code: "LOW",
          label: "WF_BPA_LOW"
        },
        {
          code: "MEDIUM",
          label: "WF_BPA_MEDIUM"
        },
        {
          code: "HIGH",
          label: "WF_BPA_HIGH"
        }
      ],
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    servicetype: getSelectField({
      label: {
        labelName: "Service type",
        labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select service type",
        labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_PLACEHOLDER"
      },
      props: {
        disabled: true,
        className: "tl-trade-type"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      required: true,
      jsonPath: "BPA.serviceType",
      sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    applicationdate: getDateField({
      label: {
        labelName: "Application Date",
        labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
      },
      jsonPath: "BPAs.appdate",
      props: {
        disabled: true,
        className: "tl-trade-type"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    applicantName: getTextField({
      label: {
        labelName: "Applicant Name",
        labelKey: "EDCR_SCRUTINY_NAME_LABEL"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true,
        className: "tl-trade-type"
      },
      pattern: getPattern("Name"),
      jsonPath: "BPA.applicantName"
    }),
    stakeHolderName: getTextField({
      label: {
        labelName: "Stake Holder Name",
        labelKey: "EDCR_SH_NAME_LABEL"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true,
        className: "tl-trade-type"
      },
      pattern: getPattern("Name"),
      jsonPath: "BPA.appliedBy"
    }),
    remarks: getTextField({
      label: {
        labelName: "Remarks",
        labelKey: "BPA_BASIC_DETAILS_REMARKS_LABEL"
      },
      placeholder: {
        labelName: "Enter Remarks Here",
        labelKey: "BPA_BASIC_DETAILS_REMARKS_PLACEHOLDER"
      },
      jsonPath: "BPA.additionalDetails.remarks",
      props: {
        multiline: true,
        rows: "4"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    buildingPermitNum: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "downloadFile",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        label: {
          labelName: "Building Permit Number",
          labelKey: "EDCR_BUILDING_PERMIT_NUM_LABEL"
        },
        linkDetail: {
          labelName: "",
          labelKey: ""
        },
        jsonPath: "BPA.permitNumberLink",
      },
      type: "array"
    }
  })
});

export const buildingPlanScrutinyDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Occupancy certificate scrutiny details",
      labelKey: "BPA_OC_CER_SCRUNITY_DETAILS_TITLE"
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
        jsonPath: "ocScrutinyDetails.edcrNumber"
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
        jsonPath: "ocScrutinyDetails.updatedDxfFile",
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
        jsonPath: "ocScrutinyDetails.planReport",
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
          labelName: "Actual Building details",
          labelKey: "BPA_ACTUAL_BUILDING_DETAILS_LABEL"
        })
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
    },
    occupancyTypeLabel: getLabelWithValue(
      {
        labelName: "Occupancy Type",
        labelKey: "BPA_OCCUPANCY_TYPE"
      },
      {
        localePrefix: {
          moduleName: "BPA",
          masterName: "OCCUPANCYTYPE"
        },
        jsonPath: "scrutinyDetails.planDetail.occupancies[0].typeHelper.type.code",
      }
    ),
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
            buildingDetailsContainer: getCommonContainer({

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
              subOccupancyTypeLabel: getLabelWithValue(
                {
                  labelName: "Sub Occupancy Type",
                  labelKey: "BPA_SUB_OCCUP_TYPE_LABEL"
                },
                {
                  jsonPath: `edcr.blockDetail[0]`,
                  callBack: value => {
                      let returnVAlue;
                      if (value && value.occupancyType && value.occupancyType.length) {
                          returnVAlue = "";
                          let occupancy = value.occupancyType;
                          for (let tp = 0; tp < occupancy.length; tp++) {
                              if (tp === (occupancy.length - 1)) {
                                  returnVAlue += getLocaleLabels(getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`), getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`)) //occupancy[tp].label;
                              } else {
                                  returnVAlue += getLocaleLabels(getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`), getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`)) + "," //occupancy[tp].label + ",";
                              }
                          }
                      }
                      return returnVAlue || "NA";
                  },
                }
              ),
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
          prefixSourceJsonPath: "children.buildingDetailsContainer.children",
          sourceJsonPath: "edcr.blockDetail",
        },
        type: "array"
      },
      breakP: getBreak(),
      breakq: getBreak()
    }
  }
});

export const abstractProposedBuildingDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Actual building abstract",
      labelKey: "BPA_ACTUAL_BUILDING_ABSTRACT_HEADER"
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
            jsonPath: "ocScrutinyDetails.planDetail.virtualBuilding.totalBuitUpArea",
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
        numOfFloors: {
          ...getTextField({
            label: {
              labelName: "Total Floor Area",
              labelKey: "BPA_APPLICATION_NO_OF_FLOORS"
            },
            jsonPath: "ocScrutinyDetails.planDetail.blocks[0].building.totalFloors",
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
        highFromGroundLevel: {
          ...getTextField({
            label: {
              labelName: "Total Carpet Area",
              labelKey: "BPA_APPLICATION_HIGH_FROM_GROUND"
            },
            jsonPath: "ocScrutinyDetails.planDetail.blocks[0].building.buildingHeight",
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
        }
      })

    }
  }
});
