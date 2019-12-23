import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getSelectField,
    getCommonContainer,

} from "egov-ui-framework/ui-config/screens/specs/utils";
export const boundaryDetails = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Boundary Details",
            labelKey: "BPA_BOUNDARY_DETAILS_TITLE"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    boundaryDetailsConatiner: getCommonContainer({
        circle: {
            ...getSelectField({
                label: {
                    labelName: "Circle",
                    labelKey: "BPA_BOUNDARY_CIRCLE_LABEL"
                },
                placeholder: {
                    labelName: "Select Circle",
                    labelKey: "BPA_BOUNDARY_CIRCLE_PLACEHOLDER"
                },
                required: true,
                jsonPath: "BPAs[0].BPADetails.boundarydetails.circle",
                props: {
                    className: "hr-generic-selectfield",
                    data: [
                        {
                            value: "Circle 1",
                            label: "Circle 1"
                        },
                        {
                            value: "Circle 2",
                            label: "Circle 2"
                        }
                    ],
                    optionValue: "value",
                    optionLabel: "label"
                }
            })
        },
        revenueward: {
            ...getSelectField({
                label: {
                    labelName: "Revenue Ward",
                    labelKey: "BPA_BOUNDARY_REVENUE_WARD_LABEL"
                },
                placeholder: {
                    labelName: "Select Revenue Ward",
                    labelKey: "BPA_BOUNDARY_REVENUE_WARD_PLACEHOLDER"
                },
                required: true,
                jsonPath: "BPAs[0].BPADetails.boundarydetails.revenueward",
                props: {
                    className: "hr-generic-selectfield",
                    data: [
                        {
                            value: "Ward 1",
                            label: "Ward 1"
                        },
                        {
                            value: "Ward 2",
                            label: "Ward 2"
                        }
                    ],
                    optionValue: "value",
                    optionLabel: "label"
                }
            })
        },
    })
});

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
                    disabled: 'true'
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
                // // pattern: getPattern("Name") || null,
                jsonPath: "scrutinyDetails.planDetail.planInformation.khataNo"
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
                required: true,
                // // pattern: getPattern("Name") || null,
                jsonPath: "BPAs[0].BPADetails.plotdetails.holdingnumber"
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
                // // pattern: getPattern("Name") || null,
                jsonPath: "scrutinyDetails.planDetail.planInformation.plotNo"
            })
        },
        cityTown: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-bpa",
            componentPath: "AutosuggestContainer",
            jsonPath: "BPAs[0].BPADetails.plotdetails.citytown",
            required: true,
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            },
            props: {
              style: {
                width: "100%",
                cursor: "pointer"
              },
              isDisabled : true,
              localePrefix: {
                moduleName: "TENANT",
                masterName: "TENANTS"
              },
              className: "citizen-city-picker",
              label: {
                labelName: "City/Town",
                labelKey: "BPA_BOUNDARY_CITY_TOWN_LABEL"
              },
              placeholder: { labelName: "Select City/Town", labelKey: "BPA_BOUNDARY_CITY_TOWN_PLACEHOLDER" },
              jsonPath: "BPAs[0].BPADetails.plotdetails.citytown",
              labelsFromLocalisation: true,
              fullwidth: true,
              required: true,
              inputLabelProps: {
                shrink: true
              }
            }
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
                // // pattern: getPattern("Name") || null,
                jsonPath: "BPAs[0].BPADetails.plotdetails.landregdetails"
            })
        },
        whetherGovOrQuasi: {
            ...getSelectField({
                label: {
                    labelName: "Whether Government or Quasi Government",
                    labelKey: "BPA_BOUNDARY_GOVT_QUASI_LABEL"
                },
                placeholder: {
                    labelName: "Select Government",
                    labelKey: "BPA_BOUNDARY_GOVT_QUASI_PLACEHOLDER"
                },
                jsonPath: "BPAs[0].BPADetails.plotdetails.govorquasi",
                props: {
                    className: "hr-generic-selectfield",
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
                }
            })
        }
    })
});