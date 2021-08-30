import commonConfig from "config/common.js";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import "./index.css";

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item
      };

      return result;
    }, {})
  );
};

export const checkValueForNA = value => {
  return value == null || value == undefined || value == '' ? "NA" : value;
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

const style = {
  textfieldIcon: {
    position: "relative",
    top: "25px",
    left: "-249%"
  },
  headerIcon: {
    position: "relative",
    bottom: "2px"
  }
};

export const showHideAdhocPopup = (state, dispatch) => {

  let toggle = get(
    state.screenConfiguration.screenConfig["view"],
    `components.adhocDialog.props.open`,
    false
  );

  dispatch(
    handleField("view", `components.adhocDialog`, "props.open", !toggle)
  );
};

export const commonTransform = (object, path) => {
  let data = get(object, path);
  let transformedData = {};
  data.map(a => {
    const splitList = a.code.split(".");
    let ipath = "";
    for (let i = 0; i < splitList.length; i += 1) {
      if (i != splitList.length - 1) {
        if (
          !(
            splitList[i] in
            (ipath === "" ? transformedData : get(transformedData, ipath))
          )
        ) {
          set(
            transformedData,
            ipath === "" ? splitList[i] : ipath + "." + splitList[i],
            i < splitList.length - 2 ? {} : []
          );
        }
      } else {
        get(transformedData, ipath).push(a);
      }
      ipath = splitList.slice(0, i + 1).join(".");
    }
  });
  set(object, path, transformedData);
  return object;
};

export const objectToDropdown = object => {
  let dropDown = [];
  for (var variable in object) {
    if (object.hasOwnProperty(variable)) {
      dropDown.push({ code: variable });
    }
  }
  return dropDown;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    // const parts = dateTimeString.match(
    //   /(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    // );
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};

const getStatementForDocType = docType => {
  switch (docType) {
    case "OWNERIDPROOF":
      return "TL_UPLOAD_STATEMENT1";
    case "OWNERSHIPPROOF":
      return "TL_UPLOAD_STATEMENT2";
    default:
      return "";
  }
};

export const prepareDocumentTypeObj = documents => {
  let documentsArr =
    documents.length > 0
      ? documents.reduce((documentsArr, item, ind) => {
        documentsArr.push({
          name: item,
          required: true,
          jsonPath: `Licenses[0].tradeLicenseDetail.applicationDocuments[${ind}]`,
          statement: getStatementForDocType(item)
        });
        return documentsArr;
      }, [])
      : [];
  return documentsArr;
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {
  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath,
    {}
  );
  let isFormValid = true;
  for (var variable in fields) {
    if (fields.hasOwnProperty(variable)) {
      if (
        fields[variable] &&
        fields[variable].props &&
        (fields[variable].props.disabled === undefined ||
          !fields[variable].props.disabled) &&
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            )
          },
          dispatch,
          true
        )
      ) {
        isFormValid = false;
      }
    }
  }
  return isFormValid;
};

export const epochToYmdDate = et => {
  if (!et) return null;
  if (typeof et === "string") return et;
  let d = new Date(et),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const getTodaysDateInYMD = () => {
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate() < 9 ? `0${date.getDate()+1}` : date.getDate()+1;
  date = `${date.getFullYear()}-${month}-${day}`;
  return date;
};

export const updateDropDowns = async (
  payload,
  action,
  state,
  dispatch,
  queryValue
) => {
  const structType = get(
    payload,
    "Licenses[0].tradeLicenseDetail.structureType"
  );
  if (structType) {
    set(
      payload,
      "LicensesTemp[0].tradeLicenseDetail.structureType",
      structType.split(".")[0]
    );
    try {
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.common-masters.StructureSubTypeTransformed",
          get(
            state.screenConfiguration.preparedFinalObject.applyScreenMdmsData[
            "common-masters"
            ],
            `StructureType.${structType.split(".")[0]}`,
            []
          )
        )
      );

      payload &&
        dispatch(
          prepareFinalObject(
            "LicensesTemp[0].tradeLicenseDetail.structureType",
            payload.LicensesTemp[0].tradeLicenseDetail.structureType
          )
        );
    } catch (e) {
      console.log(e);
    }
  }

  const tradeTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.TradeType",
    []
  );
  const tradeTypeDropdownData =
    tradeTypes &&
    Object.keys(tradeTypes).map(item => {
      return { code: item, active: true };
    });
  tradeTypeDropdownData &&
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
        tradeTypeDropdownData
      )
    );
  const tradeSubTypes = get(
    payload,
    "Licenses[0].tradeLicenseDetail.tradeUnits"
  );

  if (tradeSubTypes.length > 0) {
    try {
      tradeSubTypes.forEach((tradeSubType, i) => {
        const tradeCat = tradeSubType.tradeType.split(".")[0];
        const tradeType = tradeSubType.tradeType.split(".")[1];
        set(payload, `LicensesTemp.tradeUnits[${i}].tradeType`, tradeCat);
        set(payload, `LicensesTemp.tradeUnits[${i}].tradeSubType`, tradeType);

        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.TradeLicense.TradeCategoryTransformed",
            objectToDropdown(
              get(
                state.screenConfiguration.preparedFinalObject,
                `applyScreenMdmsData.TradeLicense.TradeType.${tradeCat}`,
                []
              )
            )
          )
        );

        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.TradeLicense.TradeSubCategoryTransformed",
            get(
              state.screenConfiguration.preparedFinalObject,
              `applyScreenMdmsData.TradeLicense.TradeType.${tradeCat}.${tradeType}`,
              []
            )
          )
        );
        payload &&
          dispatch(
            prepareFinalObject(
              `LicensesTemp.tradeUnits[${i}].tradeType`,
              tradeCat
            )
          );

        payload &&
          dispatch(
            prepareFinalObject(
              `LicensesTemp.tradeUnits[${i}].tradeSubType`,
              tradeType
            )
          );
      });
    } catch (e) {
      console.log(e);
    }
  }
  setOwnerShipDropDownFieldChange(state, dispatch, payload);
};

export const setOwnerShipDropDownFieldChange = (state, dispatch, payload) => {
  let tradeSubOwnershipCat = get(
    payload,
    "Licenses[0].tradeLicenseDetail.subOwnerShipCategory"
  );
  let tradeOwnershipCat = "";
  if (tradeSubOwnershipCat) {
    tradeOwnershipCat = tradeSubOwnershipCat.split(".")[0];
  } else {
    tradeOwnershipCat = get(
      state.screenConfiguration.preparedFinalObject,
      "applyScreenMdmsData.common-masters.OwnerShipCategoryTransformed[0].code",
      ""
    );
    tradeSubOwnershipCat = get(
      state.screenConfiguration.preparedFinalObject,
      `applyScreenMdmsData.common-masters.OwnerShipCategory.${tradeOwnershipCat}[0].code`,
      ""
    );
    set(
      payload,
      "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
      tradeSubOwnershipCat
    );
    payload &&
      dispatch(
        prepareFinalObject(
          "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
          payload.Licenses[0].tradeLicenseDetail.subOwnerShipCategory
        )
      );
  }

  set(
    payload,
    "LicensesTemp[0].tradeLicenseDetail.ownerShipCategory",
    tradeOwnershipCat
  );

  try {
    payload &&
      dispatch(
        prepareFinalObject(
          "LicensesTemp[0].tradeLicenseDetail.ownerShipCategory",
          payload.LicensesTemp[0].tradeLicenseDetail.ownerShipCategory
        )
      );
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.common-masters.subOwnerShipCategoryTransformed",
        get(
          state.screenConfiguration.preparedFinalObject,
          `applyScreenMdmsData.common-masters.OwnerShipCategory.${tradeOwnershipCat}`,
          []
        )
      )
    );

    //handlefield for Type of OwnerShip while setting drop down values as beforeFieldChange won't be callled
    if (tradeOwnershipCat === "INDIVIDUAL") {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.ownerInfoInstitutional",
          "visible",
          false
        )
      );
    } else {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.ownerInfoInstitutional",
          "visible",
          true
        )
      );
    }

    //handlefield for type of sub ownership while setting drop down values as beforeFieldChange won't be callled

    if (tradeSubOwnershipCat === "INDIVIDUAL.SINGLEOWNER") {
      const ownerInfoCards = get(
        state.screenConfiguration.screenConfig.apply, //hardcoded to apply screen
        "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard.props.items"
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "props.hasAddItem",
          false
        )
      );
      if (ownerInfoCards && ownerInfoCards.length > 1) {
        const singleCard = ownerInfoCards.slice(0, 1); //get the first element if multiple cards present

        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
            "props.items",
            singleCard
          )
        );
        dispatch(
          prepareFinalObject(
            "Licenses[0].tradeLicenseDetail.owners",
            get(
              state.screenConfiguration.preparedFinalObject,
              "Licenses[0].tradeLicenseDetail.owners"
            ).slice(0, 1)
          )
        );
      }
    }

    if (tradeSubOwnershipCat === "INDIVIDUAL.MULTIPLEOWNERS") {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "props.hasAddItem",
          true
        )
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export const showHideBreakupPopup = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.breakUpDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.breakUpDialog", "props.open", !toggle)
  );
};

export const setFilteredTradeTypes = (
  state,
  dispatch,
  licenseType,
  structureSubtype
) => {
  const tradeTypeBSlab = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.TradeLicense.TradeType",
    []
  );
  const mdmsTradeTypes = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.TradeLicense.MdmsTradeType",
    []
  );
  try {
    if (tradeTypeBSlab.length > 0 && mdmsTradeTypes.length > 0) {
      const mdmsTTTransformed = mdmsTradeTypes.reduce((acc, item) => {
        item.code && (acc[item.code] = item);
        return acc;
      }, {});
      let tradeTypeList = [];
      tradeTypeBSlab.length > 0 &&
        tradeTypeBSlab.forEach(item => {
          if (
            item.code &&
            mdmsTTTransformed[item.code] &&
            mdmsTTTransformed[item.code].applicationDocument
          ) {
            tradeTypeList.push({
              ...item,
              applicationDocument:
                mdmsTTTransformed[item.code].applicationDocument
            });
          }
        });
      if (tradeTypeList && tradeTypeList.length > 0) {
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.TradeLicense.TradeType",
            tradeTypeList
          )
        );
        let filteredList =
          tradeTypeList &&
          tradeTypeList.length > 0 &&
          tradeTypeList.filter(item => {
            if (
              item.licenseType === licenseType &&
              item.structureType === structureSubtype
            )
              return true;
          });
        let tradeTypeTransformed = commonTransform(
          { TradeType: [...filteredList] },
          "TradeType"
        );
        tradeTypeTransformed.TradeType &&
          dispatch(
            prepareFinalObject(
              "applyScreenMdmsData.TradeLicense.TradeType",
              tradeTypeTransformed.TradeType
            )
          );
        return tradeTypeTransformed;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const showCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["search"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("search", "components.cityPickerDialog", "props.open", !toggle)
  );
};

export const createEmployee = (state, dispatch) => {
  const hrmsPickerFlag = get( state.screenConfiguration.preparedFinalObject, "hrmsPickerFlag", false);
  let isCityPickerValid = true;
  if(hrmsPickerFlag) {
    isCityPickerValid = validateFields(
      "components.cityPickerDialog.children.dialogContent.children.popup.children.cityPicker.children",
      state,
      dispatch,
      "search"
    );
    if(!isCityPickerValid) isCityPickerValid = false; 
  }

  if(isCityPickerValid) {
    let tenantId = get(
      state.screenConfiguration.preparedFinalObject,
      "citiesByModule.tenantId"
    ) || get(
      state.screenConfiguration.preparedFinalObject,
      "citiesByModule.tenantId.value"
    );
    tenantId=tenantId?tenantId:getTenantId();
    get(state.screenConfiguration.preparedFinalObject, "Employee") &&
      dispatch(prepareFinalObject("Employee", []));
    get(
      state.screenConfiguration.preparedFinalObject,
      "hrms.reviewScreen.furnishedRolesList"
    ) && dispatch(prepareFinalObject("hrms.reviewScreen.furnishedRolesList", ""));
    const tenantIdQueryString = tenantId ? `?tenantId=${tenantId}` : "";
    const createUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/hrms/create${tenantIdQueryString}`
        : `/hrms/create${tenantIdQueryString}`;
    dispatch(setRoute(createUrl));
  }
};

// HRMS
export const toggleDeactivateDialog = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["view"],
    "components.deactivateEmployee.props.open",
    false
  );
  dispatch(
    handleField("view", "components.deactivateEmployee", "props.open", !toggle)
  );
};

// HRMS GET STATE ADMIN ROLE
export const getAdminRole = state => {
  let userInfo = JSON.parse(getUserInfo());
  const currentUserRoles = get(userInfo, "roles");

  /** REMOVE THESE 2 HARDCODES after moving StateInfo object to localStorage */
  const configAdminRoles = JSON.parse(
    get(
      state,
      "common.stateInfoById[0].roleMapping.hrmsAdmin",
      '["HRMS_ADMIN"]'
    )
  );
  const stateTenantId = get(
    state,
    "common.stateInfoById[0].code",
    commonConfig.tenantId
  );
  /** END */

  let hasAdminRole = false;
  Array.isArray(currentUserRoles) &&
    currentUserRoles.forEach(role => {
      if (
        Array.isArray(configAdminRoles) &&
        configAdminRoles.includes(role.code) &&
        role.tenantId === stateTenantId
      ) {
        hasAdminRole = true;
      }
    });
  return { hasAdminRole: hasAdminRole, configAdminRoles: configAdminRoles };
};


export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};
