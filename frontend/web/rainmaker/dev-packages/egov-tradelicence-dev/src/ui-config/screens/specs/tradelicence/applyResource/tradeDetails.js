import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getIconStyle,
  objectToDropdown,
  getTodaysDateInYMD,
  getFinancialYearDates,
  getNextMonthDateInYMD,
  setFilteredTradeTypes,
  getUniqueItemsFromArray,
  fillOldLicenseData,
  getTradeTypeDropdownData
} from "../../utils";
import {
  prepareFinalObject as pFO,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import filter from "lodash/filter";
import "./index.css";

const tradeUnitCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    
    scheama: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "Trade Unit  ",
          labelKey: "TL_NEW_TRADE_DETAILS_TRADE_UNIT_HEADER"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      tradeUnitCardContainer: getCommonContainer(
        {
          tradeCategory: {
            ...getSelectField({
              label: {
                labelName: "Trade Category",
                labelKey: "TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"
              },
              placeholder: {
                labelName: "Select Trade Category",
                labelKey: "TL_NEW_TRADE_DETAILS_TRADE_CAT_PLACEHOLDER"
              },
              required: true,
              jsonPath: "LicensesTemp.tradeUnits[0].tradeType",
              localePrefix: {
                moduleName: "TRADELICENSE",
                masterName: "TRADETYPE"
              },
              props: {
                jsonPathUpdatePrefix: "LicensesTemp.tradeUnits",
                setDataInField: true,
                className:"applicant-details-error"
              },
              sourceJsonPath:
                "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
              gridDefination: {
                xs: 12,
                sm: 4
              }
            }),
            beforeFieldChange: (action, state, dispatch) => {
              try {
                dispatch(
                  pFO(
                    "applyScreenMdmsData.TradeLicense.TradeCategoryTransformed",
                    objectToDropdown(
                      get(
                        state.screenConfiguration.preparedFinalObject,
                        `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${
                          action.value
                        }`,
                        []
                      )
                    )
                  )
                );
                let componentPath = action.componentJsonpath.split(".");

                let index = action.componentJsonpath
                  .split("[")[1]
                  .split("]")[0];
                componentPath.pop();
                componentPath.push("tradeType");
                componentPath = componentPath.join(".");
                dispatch(
                  handleField(
                    "apply",
                    componentPath,
                    "props.data",
                    objectToDropdown(
                      get(
                        state.screenConfiguration.preparedFinalObject,
                        `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${
                          action.value
                        }`,
                        []
                      )
                    )
                  )
                );
                let tradeCat = get(
                  state.screenConfiguration.preparedFinalObject,
                  `LicensesTemp.tradeUnits[${parseInt(index)}].tradeType`
                );
                if (tradeCat != action.value) {
                  dispatch(
                    pFO(
                      `LicensesTemp.tradeUnits[${parseInt(
                        index
                      )}].tradeSubType`,
                      ""
                    )
                  );
                  dispatch(
                    pFO(
                      `Licenses[0].tradeLicenseDetail.tradeUnits[${parseInt(
                        index
                      )}].tradeType`,
                      ""
                    )
                  );
                }
              } catch (e) {
                console.log(e);
              }
            }
          },
          tradeType: {
            ...getSelectField({
              label: {
                labelName: "Trade Type",
                labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"
              },
              placeholder: {
                labelName: "Select Trade Type",
                labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_PLACEHOLDER"
              },
              required: true,
              localePrefix: {
                moduleName: "TRADELICENSE",
                masterName: "TRADETYPE"
              },
              jsonPath: "LicensesTemp.tradeUnits[0].tradeSubType",
              props: {
                jsonPathUpdatePrefix: "LicensesTemp.tradeUnits",
                className:"applicant-details-error"
              },
              sourceJsonPath:
                "applyScreenMdmsData.TradeLicense.TradeCategoryTransformed",
              gridDefination: {
                xs: 12,
                sm: 4
              }
            }),
            beforeFieldChange: (action, state, dispatch) => {
              try {
                let cardIndex = action.componentJsonpath
                  .split("items[")[1]
                  .split("]")[0];
                let tradeCategory = get(
                  state.screenConfiguration.preparedFinalObject,
                  `LicensesTemp.tradeUnits[${cardIndex}].tradeType`,
                  ""
                );
                dispatch(
                  pFO(
                    "applyScreenMdmsData.TradeLicense.TradeSubCategoryTransformed",
                    get(
                      state.screenConfiguration.preparedFinalObject,
                      `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${tradeCategory}.${
                        action.value
                      }`,
                      []
                    )
                  )
                );
                let componentPath = action.componentJsonpath.split(".");
                componentPath.pop();
                componentPath.push("tradeSubType");
                componentPath = componentPath.join(".");
                dispatch(
                  handleField(
                    "apply",
                    componentPath,
                    "props.data",
                    get(
                      state.screenConfiguration.preparedFinalObject,
                      `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${tradeCategory}.${
                        action.value
                      }`,
                      []
                    )
                  )
                );
              } catch (e) {
                console.log(e);
              }
            }
          },
          tradeSubType: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-tradelicence",
            componentPath: "AutosuggestContainer",
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
            required: true,
            gridDefination: {
              xs: 12,
              sm: 4
            },
            props: {
              style: {
                width: "100%",
                cursor: "pointer"
              },
              label: {
                labelName: "Trade Sub-Type",
                labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
              },
              
              placeholder: {
                labelName: "Select Trade Sub-Type",
                labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_PLACEHOLDER"
              },
              jsonPath:
                "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
              sourceJsonPath:
                "applyScreenMdmsData.TradeLicense.TradeSubCategoryTransformed",
              setDataInField: true,
              labelsFromLocalisation: true,
              localePrefix: {
                moduleName: "TRADELICENSE",
                masterName: "TRADETYPE"
              },
              fullwidth: true,
              required: true,
              inputLabelProps: {
                shrink: true
              }
            },
            beforeFieldChange: (action, state, dispatch) => {
              try {
                let cardIndex = action.componentJsonpath
                  .split("items[")[1]
                  .split("]")[0];
                const tradeSubTypes = get(
                  state.screenConfiguration,
                  "preparedFinalObject.Licenses[0].tradeLicenseDetail.tradeUnits",
                  []
                );
                const alreadySelected =
                  tradeSubTypes &&
                  tradeSubTypes.find((item, i) => {
                    if (item.tradeType === action.value && cardIndex != i)
                      return true;
                  });
                if (alreadySelected) {
                  dispatch(
                    toggleSnackbar(
                      true,
                      {
                        labelName:
                          "This trade type is already selected, Please select another",
                        labelKey: "TL_TRADE_TYPE_ALREADY_SELECTED"
                      },
                      "warning"
                    )
                  );

                  action.value = null;
                } else {
                  let tradeType = get(
                    state.screenConfiguration.preparedFinalObject,
                    `LicensesTemp.tradeUnits[${cardIndex}].tradeType`,
                    ""
                  );
                  let tradeCategory = get(
                    state.screenConfiguration.preparedFinalObject,
                    `LicensesTemp.tradeUnits[${cardIndex}].tradeSubType`,
                    ""
                  );
                  let tradeSubCategories = get(
                    state.screenConfiguration.preparedFinalObject,
                    `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${tradeType}.${tradeCategory}`,
                    []
                  );
                  tradeSubCategories = getUniqueItemsFromArray(
                    tradeSubCategories,
                    "code"
                  );
                  let currentObject = filter(tradeSubCategories, {
                    code: action.value
                  });
                  if (currentObject[0].uom !== null) {
                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOM"
                        ),
                        "props.value",
                        currentObject[0].uom
                      )
                    );
                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOMValue"
                        ),
                        "props.required",
                        true
                      )
                    );
                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOMValue"
                        ),
                        "props.disabled",
                        false
                      )
                    );
                  } else {
                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOMValue"
                        ),
                        "props.required",
                        false
                      )
                    );

                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOMValue"
                        ),
                        "props.disabled",
                        true
                      )
                    );

                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOM"
                        ),
                        "props.value",
                        ""
                      )
                    );
                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOMValue"
                        ),
                        "props.value",
                        ""
                      )
                    );

                    dispatch(
                      pFO(
                        `Licenses[0].tradeLicenseDetail.tradeUnits[${cardIndex}].uom`,
                        null
                      )
                    );
                    dispatch(
                      pFO(
                        `Licenses[0].tradeLicenseDetail.tradeUnits[${cardIndex}].uomValue`,
                        null
                      )
                    );
                    dispatch(
                      handleField(
                        "apply",
                        action.componentJsonpath.replace(
                          "tradeSubType",
                          "tradeUOMValue"
                        ),
                        "props.error",
                        false
                      )
                    );
                  }
                }
              } catch (e) {
                console.log(e);
              }
            }
          },
          tradeUOM: getTextField({
            label: {
              labelName: "UOM (Unit of Measurement)",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
            },
            placeholder: {
              labelName: "UOM",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
            },
            // required: true,
            props: {
              disabled: true
            },
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }),
          tradeUOMValue: getTextField({
            label: {
              labelName: "UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
            },
            placeholder: {
              labelName: "Enter UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_PLACEHOLDER"
            },
            required: true,
            props: {
              disabled: true,
              setDataInField: true,
              jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue"
            },
            pattern: getPattern("UOMValue"),
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          })
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
      labelName: "ADD TRADE UNITS",
      labelKey: "TL_ADD_TRADE_UNITS"
    },
    headerName: "TradeUnits",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.tradeUnitCardContainer.children",
    onMultiItemAdd: (state, muliItemContent) => {
      return setFieldsOnAddItem(state, muliItemContent);
    }
  },
  type: "array"
};

const accessoriesCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          head: getCommonSubHeader(
            {
              labelName: "Accessories",
              labelKey: "TL_NEW_TRADE_DETAILS_HEADER_ACC"
            },
            {
              style: {
                marginBottom: 18
              }
            }
          ),
          ico: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-tradelicence",
            componentPath: "Tooltip",
            props: {
              val: {
                value: "Accessories Information",
                key: "TL_ACCESSORIES_TOOLTIP_MESSAGE"
              },
              style: getIconStyle("headerIcon")
            }
          }
        }
      },
      accessoriesCardContainer: getCommonContainer({
        accessoriesName: {
          ...getSelectField({
            label: {
              labelName: "Accessories",
              labelKey: "TL_NEW_TRADE_DETAILS_ACC_LABEL"
            },
            placeholder: {
              labelName: "Select Accessories",
              labelKey: "TL_NEW_TRADE_DETAILS_ACC_PLACEHOLDER"
            },
            localePrefix: {
              moduleName: "TRADELICENSE",
              masterName: "ACCESSORIESCATEGORY"
            },
            jsonPath:
              "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory",
            sourceJsonPath:
              "applyScreenMdmsData.TradeLicense.AccessoriesCategory",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }),
          beforeFieldChange: (action, state, dispatch) => {
            try {
              let accessories = get(
                state.screenConfiguration.preparedFinalObject,
                `applyScreenMdmsData.TradeLicense.AccessoriesCategory`,
                []
              );
              let currentObject = filter(accessories, {
                code: action.value
              });
              const currentUOMField = get(
                state.screenConfiguration.screenConfig.apply,
                action.componentJsonpath,
                []
              );
              var jsonArr = currentUOMField.jsonPath.split(".");
              jsonArr.pop();

              let currentUOMValueFieldPath = action.componentJsonpath.split(
                "."
              );
              currentUOMValueFieldPath.pop();
              currentUOMValueFieldPath = currentUOMValueFieldPath.join(".");
              if (currentObject[0].uom) {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOM`,
                    "props.value",
                    currentObject[0].uom
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "props.disabled",
                    false
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "required",
                    true
                  )
                );
              } else {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "required",
                    false
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOM`,
                    "props.value",
                    ""
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "props.value",
                    ""
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "props.disabled",
                    true
                  )
                );
                dispatch(pFO(`${jsonArr.join(".")}.uom`, null));
                dispatch(pFO(`${jsonArr.join(".")}.uomValue`, null));
              }
              if (action.value) {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesCount`,
                    "props.disabled",
                    false
                  )
                );
              } else {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesCount`,
                    "props.disabled",
                    true
                  )
                );
              }
            } catch (e) {
              console.log(e);
            }
          }
        },
        accessoriesUOM: getTextField({
          label: {
            labelName: "UOM (Unit of Measurement)",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
          },
          placeholder: {
            labelName: "UOM",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
          },
          // required: true,
          props: {
            disabled: true
          },
          jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom",
          gridDefination: {
            xs: 12,
            sm: 4
          }
        }),
        accessoriesUOMValue: {
          ...getTextField({
            label: {
              labelName: "UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
            },
            placeholder: {
              labelName: "Enter UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_PLACEHOLDER"
            },
            pattern: getPattern("UOMValue"),
            props: {
              className:"applicant-details-error",
              disabled: true,
              setDataInField: true,
              jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue"
            },
            required: true,
            jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          })
        },
        accessoriesCount: {
          ...getTextField({
            label: {
              labelName: "Accessory Count",
              labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT"
            },
            placeholder: {
              labelName: "Enter accessory count",
              labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT_PLACEHOLDER"
            },
            pattern: getPattern("NoOfEmp"),
            props: {
              className:"applicant-details-error",
              setDataInField: true,
              jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count",
              disabled: true
            },
            required: true,
            defaultValue: 1,
            jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          })
        }
      })
    }),
    onMultiItemAdd: (state, muliItemContent) => {
      return setFieldsOnAddItem(state, muliItemContent);
    },
    items: [],
    addItemLabel: {
      labelName: "ADD ACCESSORIES",
      labelKey: "TL_NEW_TRADE_DETAILS_BUTTON_NEW_ACC"
    },
    headerName: "Accessory",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
    prefixSourceJsonPath:
      "children.cardContent.children.accessoriesCardContainer.children"
  },
  type: "array"
};

export const tradeDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Trade Details",
      labelKey: "TL_NEW_TRADE_DETAILS_PROV_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  tradeDetailsConatiner: getCommonContainer({
    financialYear: {
      ...getSelectField({
        label: {
          labelName: "Financial Year",
          labelKey: "TL_FINANCIAL_YEAR_LABEL"
        },
        placeholder: {
          labelName: "Select Financial Year",
          labelKey: "TL_FINANCIAL_YEAR_PLACEHOLDER"
        },
        required: true,
        visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
        jsonPath: "Licenses[0].financialYear",
        sourceJsonPath: "applyScreenMdmsData.egf-master.FinancialYear",
        gridDefination: {
          xs: 12,
          sm: 6
        }
      })
    },
    dummyDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      props: {
        disabled: true
      }
    },
    applicationType: {
      ...getSelectField({
        label: {
          labelName: "Application Type",
          labelKey: "TL_APPLICATION_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Application Type",
          labelKey: "TL_APPLICATION_TYPE_PLACEHOLDER"
        },
        required: true,
        localePrefix: {
          moduleName: "TradeLicense",
          masterName: "ApplicationType"
        },
        jsonPath:
          "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
        sourceJsonPath: "applyScreenMdmsData.TradeLicense.ApplicationType",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props:{
          className:"applicant-details-error"
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "APPLICATIONTYPE.RENEWAL") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo",
              "props.required",
              true
            )
          );
        } else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo",
              "props.required",
              false
            )
          );
        }
      }
    },
    oldLicenseNo: getTextField({
      label: {
        labelName: "Old License No",
        labelKey: "TL_OLD_LICENSE_NO"
      },
      placeholder: {
        labelName: "Enter Old License No",
        labelKey: ""
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51",
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            fillOldLicenseData(state, dispatch);
          }
        }
      },
      title: {
        value: "Fill the form by searching your old approved trade license",
        key: "TL_OLD_TL_NO"
      },
      infoIcon: "info_circle",
      jsonPath: "Licenses[0].oldLicenseNumber"
    }),
    tradeLicenseType: {
      ...getSelectField({
        label: {
          labelName: "License Type",
          labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select License Type",
          labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_PLACEHOLDER"
        },
        required: true,
        jsonPath: "Licenses[0].licenseType",
        localePrefix: {
          moduleName: "TRADELICENSE",
          masterName: "LICENSETYPE"
        },
        props: {
          disabled: true,
          value: "PERMANENT",
          className: "tl-trade-type"
        },
        sourceJsonPath: "applyScreenMdmsData.TradeLicense.licenseType"
      }),
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "TEMPORARY") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeFromDate",
              "visible",
              true
            )
          );
        } else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeFromDate",
              "visible",
              false
            )
          );
          // dispatch(pFO("Licenses[0].validFrom", null));
          // dispatch(pFO("Licenses[0].validTo", null));
        }
      }
    },
    tradeName: getTextField({
      label: {
        labelName: "Name of Trade",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_LABEL"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Example Diljit Da Dhaba",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("TradeName"),
      jsonPath: "Licenses[0].tradeName"
    }),
    tradeFromDate: {
      ...getDateField({
        label: {
          labelName: "From Date",
          labelKey: "TL_COMMON_FROM_DATE_LABEL"
        },
        placeholder: {
          labelName: "Trade License From Date",
          labelName: "TL_TRADE_LICENCE_FROM_DATE"
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "Licenses[0].validFrom",
        props: {
          className:"applicant-details-error",
          inputProps: {
            min: getTodaysDateInYMD(),
            max: getFinancialYearDates("yyyy-mm-dd").endDate
          }
        }
      }),
      visible: false
    },
    tradeToDate: {
      ...getDateField({
        label: { labelName: "To Date", labelKey: "TL_COMMON_TO_DATE_LABEL" },
        placeholder: {
          labelName: "Trade License From Date",
          labelKey: "TL_TRADE_LICENCE_TO_DATE"
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "Licenses[0].validTo",
        props: {
          inputProps: {
            min: getNextMonthDateInYMD(),
            max: getFinancialYearDates("yyyy-mm-dd").endDate
          }
        }
      }),
      visible: false
    },
    tradeStructureType: {
      ...getSelectField({
        label: {
          labelName: "Structure Type",
          labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Structure Type",
          labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_TYPE_PLACEHOLDER"
        },
        props:{
          className:"applicant-details-error"
        },
        localePrefix: {
          moduleName: "common-masters",
          masterName: "STRUCTURETYPE"
        },
        required: true,
        jsonPath: "LicensesTemp[0].tradeLicenseDetail.structureType",
        sourceJsonPath:
          "applyScreenMdmsData.common-masters.StructureTypeTransformed"
      }),
      beforeFieldChange: (action, state, dispatch) => {
        try {
          dispatch(
            pFO(
              "applyScreenMdmsData.common-masters.StructureSubTypeTransformed",
              get(
                state.screenConfiguration.preparedFinalObject
                  .applyScreenMdmsData["common-masters"],
                `StructureType.${action.value}`,
                []
              )
            )
          );
          // dispatch(pFO("Licenses[0].tradeLicenseDetail.structureType", null));
        } catch (e) {
          console.log(e);
        }
      }
    },
    tradeStructureSubType: {
      ...getSelectField({
        label: {
          labelName: "Structure Sub Type",
          labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Select Structure Sub Type",
          labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_PLACEHOLDER"
        },
        required: true,
        localePrefix: {
          moduleName: "common-masters",
          masterName: "STRUCTURETYPE"
        },
        jsonPath: "Licenses[0].tradeLicenseDetail.structureType",
        sourceJsonPath:
          "applyScreenMdmsData.common-masters.StructureSubTypeTransformed"
      }),
      beforeFieldChange: (action, state, dispatch) => {
        const tradeTypes = setFilteredTradeTypes(
          state,
          dispatch,
          get(
            state.screenConfiguration.preparedFinalObject,
            "Licenses[0].licenseType",
            "PERMANENT"
          ),
          action.value
        );
        const tradeTypeDropdownData = getTradeTypeDropdownData(tradeTypes);
        tradeTypeDropdownData &&
          dispatch(
            pFO(
              "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
              tradeTypeDropdownData
            )
          );
      }
    },
    tradeCommencementDate: getDateField({
      label: {
        labelName: "Trade Commencement Date",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Trade Commencement Date",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("Date"),
      jsonPath: "Licenses[0].commencementDate"
    }),
    tradeGSTNo: getTextField({
      label: {
        labelName: "Trade GST No.",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_LABEL"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Trade GST No.",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_PLACEHOLDER"
      },
      pattern: getPattern("GSTNo"),
      jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.gstNo"
    }),
    tradeOperationalArea: getTextField({
      label: {
        labelName: "Operatonal Area (Sq Ft)",
        labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_LABEL"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Operatonal Area in Sq Ft",
        labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_PLACEHOLDER"
      },
      pattern: getPattern("OperationalArea"),
      jsonPath: "Licenses[0].tradeLicenseDetail.operationalArea"
    }),
    tradeNoOfEmployee: getTextField({
      label: {
        labelName: "No. Of Employee",
        labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_LABEL"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter No. Of Employee",
        labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_PLACEHOLDER"
      },
      pattern: getPattern("NoOfEmp"),
      jsonPath: "Licenses[0].tradeLicenseDetail.noOfEmployees"
    })
  }),
  tradeUnitCard,
  accessoriesCard
});

const setFieldsOnAddItem = (state, multiItemContent) => {
  const preparedFinalObject = JSON.parse(
    JSON.stringify(state.screenConfiguration.preparedFinalObject)
  );
  for (var variable in multiItemContent) {
    const value = get(
      preparedFinalObject,
      multiItemContent[variable].props.jsonPath
    );
    if (multiItemContent[variable].props.setDataInField && value) {
      if (
        multiItemContent[variable].props.jsonPath.split(".")[0] ===
          "LicensesTemp" &&
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
          "tradeType"
      ) {
        const tradeTypeData = get(
          preparedFinalObject,
          `applyScreenMdmsData.TradeLicense.TradeType`,
          []
        );
        const tradeTypeDropdownData =
          tradeTypeData &&
          tradeTypeData.TradeType &&
          Object.keys(tradeTypeData.TradeType).map(item => {
            return { code: item, active: true };
          });
        multiItemContent[variable].props.data = tradeTypeDropdownData;
        const data = tradeTypeData[value];
        if (data) {
          multiItemContent["tradeType"].props.data = this.objectToDropdown(
            data
          );
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "tradeType"
      ) {
        const data = get(
          preparedFinalObject,
          `applyScreenMdmsData.TradeLicense.TradeType.${value.split(".")[0]}.${
            value.split(".")[1]
          }`
        );
        if (data) {
          multiItemContent[variable].props.data = data;
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
          "uomValue" &&
        value > 0
      ) {
        multiItemContent[variable].props.disabled = false;
        multiItemContent[variable].props.required = true;
      }
    }
    if (
      multiItemContent[variable].props.setDataInField &&
      multiItemContent[variable].props.disabled
    ) {
      if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "uomValue"
      ) {
        const disabledValue = get(
          state.screenConfiguration.screenConfig["apply"],
          `${multiItemContent[variable].componentJsonpath}.props.disabled`,
          true
        );
        multiItemContent[variable].props.disabled = disabledValue;
      }
    }
  }
  return multiItemContent;
};
