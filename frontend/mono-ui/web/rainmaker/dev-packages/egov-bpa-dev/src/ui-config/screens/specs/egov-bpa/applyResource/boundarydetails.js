import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getSelectField,
    getCommonContainer,

} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";

export const detailsofplot = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Details Of Plot",
            labelKey: "BPA_BOUNDARY_PLOT_DETAILS_TITLE"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    detailsOfPlotContainer: getCommonContainer({
        plotArea: {
            ...getTextField({
                label: {
                    labelName: "Plot Area",
                    labelKey: "BPA_BOUNDARY_PLOT_AREA_LABEL"
                },
                required: true,
                jsonPath: "scrutinyDetails.planDetail.plot.area",
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
        kathaNumber: {
            ...getTextField({
                label: {
                    labelName: "Khata No.",
                    labelKey: "BPA_BOUNDARY_KHATA_NO_LABEL"
                },
                placeholder: {
                    labelName: "Enter Khata No.",
                    labelKey: "BPA_BOUNDARY_KHATA_NO_PLACEHOLDER"
                },
                required: true,
                props: {
                    disabled: 'true',
                    className : "tl-trade-type"
                  },
                // // pattern: getPattern("Name") || null,
                jsonPath: "scrutinyDetails.planDetail.planInformation.khataNo",
                gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 6
                  }
            })
        },
        holdingNumber: {
            ...getTextField({
                label: {
                    labelName: "Holding No.",
                    labelKey: "BPA_BOUNDARY_HOLDING_NO_LABEL"
                },
                placeholder: {
                    labelName: "Enter Holding No.",
                    labelKey: "BPA_BOUNDARY_HOLDING_NO_PLACEHOLDER"
                },
                jsonPath: "BPA.additionalDetails.holdingNo",
                gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 6
                  }
            })
        },
        plotNo: {
            ...getTextField({
                label: {
                    labelName: "Plot No(MSP)",
                    labelKey: "BPA_BOUNDARY_PLOT_NO_LABEL"
                },
                placeholder: {
                    labelName: "Enter Plot No(MSP)",
                    labelKey: "BPA_BOUNDARY_PLOT_NO_PLACEHOLDER"
                },
                required: true,
                props: {
                    disabled: 'true',
                    className : "tl-trade-type"
                  },
                // // pattern: getPattern("Name") || null,
                jsonPath: "scrutinyDetails.planDetail.planInformation.plotNo",
                gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 6
                  }
            })
        },
        cityTown: {
            ...getSelectField({
                visible : false,
                label: {
                  labelName: "City",
                  labelKey: "BPA_CITY_LABEL"
                },
                localePrefix: {
                  moduleName: "TENANT",
                  masterName: "TENANTS"
                },
                optionLabel: "name",
                placeholder: { labelName: "Select City", labelKey: "BPA_SELECT_CITY" },
                sourceJsonPath: "citiesByModule.TL.tenants",
                jsonPath: "BPA.landInfo.address.city",
                required: true,
                props: {
                  required: true,
                  disabled: true,
                  className : "tl-trade-type"
                },
                gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 6
                  }
              }),
        },
        whetherGovOrQuasi: {
            ...getSelectField({
                visible : false,
                label: {
                    labelName: "Whether Government or Quasi Government",
                    labelKey: "BPA_BOUNDARY_GOVT_QUASI_LABEL"
                },
                placeholder: {
                    labelName: "Select Government",
                    labelKey: "BPA_BOUNDARY_GOVT_QUASI_PLACEHOLDER"
                },
                jsonPath: "BPA.govtOrQuasi",
                props: {
                    data: [
                        {
                            value: "Governments",
                            label: "Governments"
                        },
                        {
                            value: "Quasi government",
                            label: "Quasi government"
                        },
                        {
                            value: "Not applicable",
                            label: "Not applicable"
                        }
                    ],
                    optionValue: "value",
                    optionLabel: "label"
                },
                gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 6
                  }
            })
        },
        landRegDetails: {
            ...getTextField({
                label: {
                    labelName: "Land Registration Details",
                    labelKey: "BPA_BOUNDARY_LAND_REG_DETAIL_LABEL"
                },
                placeholder: {
                    labelName: "Enter Land Registration Details",
                    labelKey: "BPA_BOUNDARY_LAND_REG_DETAIL_PLACEHOLDER"
                },
                props: {
                    multiline: true,
                    rows: "4"
                  },
                jsonPath: "BPA.additionalDetails.registrationDetails",
                gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 6
                  }
            })
        },
    })
});