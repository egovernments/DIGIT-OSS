"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tradeDetails = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _utils = require("egov-ui-framework/ui-config/screens/specs/utils");

var _utils2 = require("../../utils");

var _actions = require("egov-ui-framework/ui-redux/screen-configuration/actions");

var _get = require("lodash/get");

var _get2 = _interopRequireDefault(_get);

var _filter = require("lodash/filter");

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var billDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: (0, _utils.getCommonGrayCard)({
      header: (0, _utils.getCommonSubHeader)({
        labelName: "Bill Details",
        labelKey: "Bill Details" //TL_NEW_TRADE_DETAILS_TRADE_UNIT_HEADER
      }, {
        style: {
          marginBottom: 18
        }
      }),
      estimateSection: (0, _utils2.getFeesEstimateCard)({
        sourceJsonPath: "LicensesTemp[0].estimateCardData"
      })
    }),
    items: [],
    addItemLabel: {
      labelName: "ADD TRADE UNITS",
      labelKey: "TL_ADD_TRADE_UNITS"
    },
    headerName: "TradeUnits",
    headerJsonPath: "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.billDetailsCard",
    prefixSourceJsonPath: "children.cardContent.children.billDetailsCardContainer.children"
    // onMultiItemAdd: (state, muliItemContent) => {
    //   return setFieldsOnAddItem(state, muliItemContent);
    // }
  },
  type: "array"
};

var serviceDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: (0, _utils.getCommonGrayCard)({
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          head: (0, _utils.getCommonSubHeader)({
            labelName: "Service Details",
            labelKey: "Service Details" // TL_NEW_TRADE_DETAILS_HEADER_ACC
          }, {
            style: {
              marginBottom: 18
            }
          })
          // ico: {
          //   uiFramework: "custom-molecules-local",
          //   moduleName: "egov-tradelicence",
          //   componentPath: "Tooltip",
          //   props: {
          //     val: {
          //       value: "Accessories Information",
          //       key: "TL_ACCESSORIES_TOOLTIP_MESSAGE"
          //     },
          //     style: getIconStyle("headerIcon")
          //   }
          // }
        }
      },
      serviceDetailsCardContainer: (0, _utils.getCommonContainer)({
        serviceType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Service Type",
          value: "Water"
        }), {
          props: {
            value: "Water"
          }
        }),
        propertyUsageType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Property UsageType",
          value: "Water"
        })),
        connectionType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Connection Type",
          value: "Water"
        })),
        meterId: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Meter Id",
          value: "Water"
        })),
        currentMeterReading: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Current Meter Reading",
          value: "Water"
        })),
        currentMeterReadingStatus: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Current Meter Reading Status",
          value: "Water"
        })),
        lastMeterReading: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Last Meter Reading",
          value: "Water"
        })),
        meterStatus: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Last Meter Reading",
          value: "Water"
        })),
        consumption: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Consumption",
          value: "Water"
        }))
      })
    }),
    onMultiItemAdd: function onMultiItemAdd(state, muliItemContent) {
      return setFieldsOnAddItem(state, muliItemContent);
    },
    items: []
    // addItemLabel: {
    //   labelName: "ADD ACCESSORIES",
    //   labelKey: "TL_NEW_TRADE_DETAILS_BUTTON_NEW_ACC"
    // },
    // headerName: "Accessory",
    // headerJsonPath:
    //   "children.cardContent.children.header.children.head.children.Accessories.props.label",
    // sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
    // prefixSourceJsonPath:
    //   "children.cardContent.children.serviceDetailsCardContainer.children"
  },
  type: "array"
};

var propertyDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: (0, _utils.getCommonGrayCard)({
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          head: (0, _utils.getCommonSubHeader)({
            labelName: "Property Details",
            labelKey: "Property Details" // TL_NEW_TRADE_DETAILS_HEADER_ACC
          }, {
            style: {
              marginBottom: 18
            }
          })
        }
      },
      serviceDetailsCardContainer: (0, _utils.getCommonContainer)({
        serviceType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Service Type",
          value: "Water"
        })),
        propertyUsageType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Property UsageType",
          value: "Water"
        })),
        connectionType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Connection Type",
          value: "Water"
        })),
        meterId: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Meter Id",
          value: "Water"
        })),
        currentMeterReading: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Current Meter Reading",
          value: "Water"
        })),
        currentMeterReadingStatus: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Current Meter Reading Status",
          value: "Water"
        })),
        lastMeterReading: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Last Meter Reading",
          value: "Water"
        })),
        meterStatus: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Last Meter Reading",
          value: "Water"
        })),
        consumption: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Consumption",
          value: "Water"
        }))
      })
    }),
    onMultiItemAdd: function onMultiItemAdd(state, muliItemContent) {
      return setFieldsOnAddItem(state, muliItemContent);
    },
    items: []
    // addItemLabel: {
    //   labelName: "ADD ACCESSORIES",
    //   labelKey: "TL_NEW_TRADE_DETAILS_BUTTON_NEW_ACC"
    // },
    // headerName: "Accessory",
    // headerJsonPath:
    //   "children.cardContent.children.header.children.head.children.Accessories.props.label",
    // sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
    // prefixSourceJsonPath:
    //   "children.cardContent.children.serviceDetailsCardContainer.children"
  },
  type: "array"
};

var ownerDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: (0, _utils.getCommonGrayCard)({
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          head: (0, _utils.getCommonSubHeader)({
            labelName: "Owner Details",
            labelKey: "Owner Details" // TL_NEW_TRADE_DETAILS_HEADER_ACC
          }, {
            style: {
              marginBottom: 18
            }
          })
        }
      },
      serviceDetailsCardContainer: (0, _utils.getCommonContainer)({
        serviceType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Service Type",
          value: "Water"
        })),
        propertyUsageType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Property UsageType",
          value: "Water"
        })),
        connectionType: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Connection Type",
          value: "Water"
        })),
        meterId: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Meter Id",
          value: "Water"
        })),
        currentMeterReading: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Current Meter Reading",
          value: "Water"
        })),
        currentMeterReadingStatus: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Current Meter Reading Status",
          value: "Water"
        })),
        lastMeterReading: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Last Meter Reading",
          value: "Water"
        })),
        meterStatus: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Last Meter Reading",
          value: "Water"
        })),
        consumption: (0, _extends3.default)({}, (0, _utils.getLabelWithValue)({
          label: "Consumption",
          value: "Water"
        }))
      })
    }),
    onMultiItemAdd: function onMultiItemAdd(state, muliItemContent) {
      return setFieldsOnAddItem(state, muliItemContent);
    },
    items: []
    // addItemLabel: {
    //   labelName: "ADD ACCESSORIES",
    //   labelKey: "TL_NEW_TRADE_DETAILS_BUTTON_NEW_ACC"
    // },
    // headerName: "Accessory",
    // headerJsonPath:
    //   "children.cardContent.children.header.children.head.children.Accessories.props.label",
    // sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
    // prefixSourceJsonPath:
    //   "children.cardContent.children.serviceDetailsCardContainer.children"
  },
  type: "array"
};

var tradeDetails = exports.tradeDetails = (0, _utils.getCommonCard)({
  // header: getCommonTitle(
  //   {
  //     labelName: "Trade Details",
  //     labelKey: "TL_NEW_TRADE_DETAILS_PROV_DET_HEADER"
  //   },
  //   {
  //     style: {
  //       marginBottom: 18
  //     }
  //   }
  // ),
  tradeDetailsConatiner: (0, _utils.getCommonContainer)({
    // financialYear: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Financial Year",
    //       labelKey: "TL_FINANCIAL_YEAR_LABEL"
    //     },
    //     placeholder: {
    //       labelName: "Select Financial Year",
    //       labelKey: "TL_FINANCIAL_YEAR_PLACEHOLDER"
    //     },
    //     required: true,
    //     visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
    //     jsonPath: "Licenses[0].financialYear",
    //     sourceJsonPath: "applyScreenMdmsData.egf-master.FinancialYear",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 6
    //     }
    //   })
    // },
    // dummyDiv: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Div",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    //   visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
    //   props: {
    //     disabled: true
    //   }
    // },
    // applicationType: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Application Type",
    //       labelKey: "TL_APPLICATION_TYPE_LABEL"
    //     },
    //     placeholder: {
    //       labelName: "Select Application Type",
    //       labelKey: "TL_APPLICATION_TYPE_PLACEHOLDER"
    //     },
    //     required: true,
    //     localePrefix: {
    //       moduleName: "TradeLicense",
    //       masterName: "ApplicationType"
    //     },
    //     jsonPath:
    //       "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
    //     sourceJsonPath: "applyScreenMdmsData.TradeLicense.ApplicationType",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 6
    //     }
    //   }),
    //   beforeFieldChange: (action, state, dispatch) => {
    //     if (action.value === "APPLICATIONTYPE.RENEWAL") {
    //       dispatch(
    //         handleField(
    //           "apply",
    //           "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo",
    //           "props.required",
    //           true
    //         )
    //       );
    //     } else {
    //       dispatch(
    //         handleField(
    //           "apply",
    //           "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo",
    //           "props.required",
    //           false
    //         )
    //       );
    //     }
    //   }
    // },
    // oldLicenseNo: getTextField({
    //   label: {
    //     labelName: "Old License No",
    //     labelKey: "TL_OLD_LICENSE_NO"
    //   },
    //   placeholder: {
    //     labelName: "Enter Old License No",
    //     labelKey: ""
    //   },
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    //   iconObj: {
    //     iconName: "search",
    //     position: "end",
    //     color: "#FE7A51",
    //     onClickDefination: {
    //       action: "condition",
    //       callBack: (state, dispatch) => {
    //         fillOldLicenseData(state, dispatch);
    //       }
    //     }
    //   },
    //   title: {
    //     value: "Fill the form by searching your old approved trade license",
    //     key: "TL_OLD_TL_NO"
    //   },
    //   infoIcon: "info_circle",
    //   jsonPath: "Licenses[0].oldLicenseNumber"
    // }),
    // tradeLicenseType: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "License Type",
    //       labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"
    //     },
    //     placeholder: {
    //       labelName: "Select License Type",
    //       labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_PLACEHOLDER"
    //     },
    //     required: true,
    //     jsonPath: "Licenses[0].licenseType",
    //     localePrefix: {
    //       moduleName: "TRADELICENSE",
    //       masterName: "LICENSETYPE"
    //     },
    //     props: {
    //       disabled: true,
    //       value: "PERMANENT",
    //       className: "tl-trade-type"
    //     },
    //     sourceJsonPath: "applyScreenMdmsData.TradeLicense.licenseType"
    //   }),
    //   beforeFieldChange: (action, state, dispatch) => {
    //     if (action.value === "TEMPORARY") {
    //       dispatch(
    //         handleField(
    //           "apply",
    //           "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
    //           "visible",
    //           true
    //         )
    //       );
    //       dispatch(
    //         handleField(
    //           "apply",
    //           "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeFromDate",
    //           "visible",
    //           true
    //         )
    //       );
    //     } else {
    //       dispatch(
    //         handleField(
    //           "apply",
    //           "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
    //           "visible",
    //           false
    //         )
    //       );
    //       dispatch(
    //         handleField(
    //           "apply",
    //           "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeFromDate",
    //           "visible",
    //           false
    //         )
    //       );
    //       // dispatch(pFO("Licenses[0].validFrom", null));
    //       // dispatch(pFO("Licenses[0].validTo", null));
    //     }
    //   }
    // },
    // tradeName: getTextField({
    //   label: {
    //     labelName: "Name of Trade",
    //     labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Example Diljit Da Dhaba",
    //     labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_PLACEHOLDER"
    //   },
    //   required: true,
    //   pattern: getPattern("TradeName"),
    //   jsonPath: "Licenses[0].tradeName"
    // }),
    // tradeFromDate: {
    //   ...getDateField({
    //     label: {
    //       labelName: "From Date",
    //       labelKey: "TL_COMMON_FROM_DATE_LABEL"
    //     },
    //     placeholder: {
    //       labelName: "Trade License From Date",
    //       labelName: "TL_TRADE_LICENCE_FROM_DATE"
    //     },
    //     required: true,
    //     pattern: getPattern("Date"),
    //     jsonPath: "Licenses[0].validFrom",
    //     props: {
    //       inputProps: {
    //         min: getTodaysDateInYMD(),
    //         max: getFinancialYearDates("yyyy-mm-dd").endDate
    //       }
    //     }
    //   }),
    //   visible: false
    // },
    // tradeToDate: {
    //   ...getDateField({
    //     label: { labelName: "To Date", labelKey: "TL_COMMON_TO_DATE_LABEL" },
    //     placeholder: {
    //       labelName: "Trade License From Date",
    //       labelKey: "TL_TRADE_LICENCE_TO_DATE"
    //     },
    //     required: true,
    //     pattern: getPattern("Date"),
    //     jsonPath: "Licenses[0].validTo",
    //     props: {
    //       inputProps: {
    //         min: getNextMonthDateInYMD(),
    //         max: getFinancialYearDates("yyyy-mm-dd").endDate
    //       }
    //     }
    //   }),
    //   visible: false
    // },
    // tradeStructureType: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Structure Type",
    //       labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL"
    //     },
    //     placeholder: {
    //       labelName: "Select Structure Type",
    //       labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_TYPE_PLACEHOLDER"
    //     },
    //     localePrefix: {
    //       moduleName: "common-masters",
    //       masterName: "STRUCTURETYPE"
    //     },
    //     required: true,
    //     jsonPath: "LicensesTemp[0].tradeLicenseDetail.structureType",
    //     sourceJsonPath:
    //       "applyScreenMdmsData.common-masters.StructureTypeTransformed"
    //   }),
    //   beforeFieldChange: (action, state, dispatch) => {
    //     try {
    //       dispatch(
    //         pFO(
    //           "applyScreenMdmsData.common-masters.StructureSubTypeTransformed",
    //           get(
    //             state.screenConfiguration.preparedFinalObject
    //               .applyScreenMdmsData["common-masters"],
    //             `StructureType.${action.value}`,
    //             []
    //           )
    //         )
    //       );
    //       // dispatch(pFO("Licenses[0].tradeLicenseDetail.structureType", null));
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }
    // },
    // tradeStructureSubType: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Structure Sub Type",
    //       labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL"
    //     },
    //     placeholder: {
    //       labelName: "Select Structure Sub Type",
    //       labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_PLACEHOLDER"
    //     },
    //     required: true,
    //     localePrefix: {
    //       moduleName: "common-masters",
    //       masterName: "STRUCTURETYPE"
    //     },
    //     jsonPath: "Licenses[0].tradeLicenseDetail.structureType",
    //     sourceJsonPath:
    //       "applyScreenMdmsData.common-masters.StructureSubTypeTransformed"
    //   }),
    //   beforeFieldChange: (action, state, dispatch) => {
    //     const tradeTypes = setFilteredTradeTypes(
    //       state,
    //       dispatch,
    //       get(
    //         state.screenConfiguration.preparedFinalObject,
    //         "Licenses[0].licenseType",
    //         "PERMANENT"
    //       ),
    //       action.value
    //     );
    //     const tradeTypeDropdownData = getTradeTypeDropdownData(tradeTypes);
    //     tradeTypeDropdownData &&
    //       dispatch(
    //         pFO(
    //           "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
    //           tradeTypeDropdownData
    //         )
    //       );
    //   }
    // },
    // tradeCommencementDate: getDateField({
    //   label: {
    //     labelName: "Trade Commencement Date",
    //     labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Enter Trade Commencement Date",
    //     labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_PLACEHOLDER"
    //   },
    //   required: true,
    //   pattern: getPattern("Date"),
    //   jsonPath: "Licenses[0].commencementDate"
    // }),
    // tradeGSTNo: getTextField({
    //   label: {
    //     labelName: "Trade GST No.",
    //     labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Enter Trade GST No.",
    //     labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_PLACEHOLDER"
    //   },
    //   pattern: getPattern("GSTNo"),
    //   jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.gstNo"
    // }),
    // tradeOperationalArea: getTextField({
    //   label: {
    //     labelName: "Operatonal Area (Sq Ft)",
    //     labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Enter Operatonal Area in Sq Ft",
    //     labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_PLACEHOLDER"
    //   },
    //   pattern: getPattern("OperationalArea"),
    //   jsonPath: "Licenses[0].tradeLicenseDetail.operationalArea"
    // }),
    // tradeNoOfEmployee: getTextField({
    //   label: {
    //     labelName: "No. Of Employee",
    //     labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Enter No. Of Employee",
    //     labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_PLACEHOLDER"
    //   },
    //   pattern: getPattern("NoOfEmp"),
    //   jsonPath: "Licenses[0].tradeLicenseDetail.noOfEmployees"
    // })
  }),
  billDetailsCard: billDetailsCard,
  serviceDetailsCard: serviceDetailsCard,
  propertyDetails: propertyDetails,
  ownerDetails: ownerDetails
});

var setFieldsOnAddItem = function setFieldsOnAddItem(state, multiItemContent) {
  var preparedFinalObject = JSON.parse(JSON.stringify(state.screenConfiguration.preparedFinalObject));
  for (var variable in multiItemContent) {
    var value = (0, _get2.default)(preparedFinalObject, multiItemContent[variable].props.jsonPath);
    if (multiItemContent[variable].props.setDataInField && value) {
      if (multiItemContent[variable].props.jsonPath.split(".")[0] === "LicensesTemp" && multiItemContent[variable].props.jsonPath.split(".").pop() === "tradeType") {
        var tradeTypeData = (0, _get2.default)(preparedFinalObject, "applyScreenMdmsData.TradeLicense.TradeType", []);
        var tradeTypeDropdownData = tradeTypeData && tradeTypeData.TradeType && Object.keys(tradeTypeData.TradeType).map(function (item) {
          return { code: item, active: true };
        });
        multiItemContent[variable].props.data = tradeTypeDropdownData;
        var data = tradeTypeData[value];
        if (data) {
          multiItemContent["tradeType"].props.data = undefined.objectToDropdown(data);
        }
      } else if (multiItemContent[variable].props.jsonPath.split(".").pop() === "tradeType") {
        var _data = (0, _get2.default)(preparedFinalObject, "applyScreenMdmsData.TradeLicense.TradeType." + value.split(".")[0] + "." + value.split(".")[1]);
        if (_data) {
          multiItemContent[variable].props.data = _data;
        }
      } else if (multiItemContent[variable].props.jsonPath.split(".").pop() === "uomValue" && value > 0) {
        multiItemContent[variable].props.disabled = false;
        multiItemContent[variable].props.required = true;
      }
    }
    if (multiItemContent[variable].props.setDataInField && multiItemContent[variable].props.disabled) {
      if (multiItemContent[variable].props.jsonPath.split(".").pop() === "uomValue") {
        var disabledValue = (0, _get2.default)(state.screenConfiguration.screenConfig["apply"], multiItemContent[variable].componentJsonpath + ".props.disabled", true);
        multiItemContent[variable].props.disabled = disabledValue;
      }
    }
  }
  return multiItemContent;
};