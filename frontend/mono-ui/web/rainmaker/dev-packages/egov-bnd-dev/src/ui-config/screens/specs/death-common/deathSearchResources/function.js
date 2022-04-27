import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { searchForDeath } from "../../../../../ui-utils/commons";
import { genderValues } from "../../../../../ui-utils/constants";
import { validateFields } from "../../utils";
import {
  convertEpochToDateWithTimeIST,
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping
} from "../../utils";


export const searchApiCall = async (state, dispatch) => {

  showHideTable(false, dispatch);

  let queryParams = [
    //{ key: "limit", value: "10" }
  ];

  let tenantId = get(state.screenConfiguration.preparedFinalObject,"bnd.death.tenantId");
  if(tenantId)
    queryParams.push({ key: "tenantId",value: tenantId});

  let dateOfDeath = get(state.screenConfiguration.preparedFinalObject,"bnd.death.dob");
  let fromdate = get(state.screenConfiguration.preparedFinalObject,"bnd.death.fromdate");
  let todate = get(state.screenConfiguration.preparedFinalObject,"bnd.death.todate");
  if(dateOfDeath)
  {
    queryParams.push({ key: "dateOfDeath",value: convertEpochToDate(convertDateToEpoch(dateOfDeath)).replaceAll("/","-")});
  }
  if(fromdate)
  {
    queryParams.push({ key: "fromDate",value: convertEpochToDate(convertDateToEpoch(fromdate)).replaceAll("/","-")});
  }
  if(todate)
  {
    queryParams.push({ key: "toDate",value: convertEpochToDate(convertDateToEpoch(todate)).replaceAll("/","-")});
  }
  let gender = get(state.screenConfiguration.preparedFinalObject,"bnd.death.gender");
  if(gender)
    queryParams.push({ key: "gender",value: gender});

  let registrationNo = get(state.screenConfiguration.preparedFinalObject,"bnd.death.registrationNo");
  if(registrationNo)
    queryParams.push({ key: "registrationNo",value: registrationNo});

  let hospitalId = get(state.screenConfiguration.preparedFinalObject,"bnd.death.hosptialId");
  if(hospitalId)
    queryParams.push({ key: "hospitalId",value: hospitalId});

  let mothersName = get(state.screenConfiguration.preparedFinalObject,"bnd.death.mothersName");
  if(mothersName)
    queryParams.push({ key: "motherName",value: mothersName});

  let fathersName = get(state.screenConfiguration.preparedFinalObject,"bnd.death.fathersName");
  if(fathersName)
    queryParams.push({ key: "fatherName",value: fathersName});
  
  let spouseName = get(state.screenConfiguration.preparedFinalObject,"bnd.death.spouseName");
  if(spouseName)
    queryParams.push({ key: "spouseName",value: spouseName});
  
  let name = get(state.screenConfiguration.preparedFinalObject,"bnd.death.name");
  if(name)
    queryParams.push({ key: "name",value: name});

  let searchSet1Visible = get(
    state.screenConfiguration,
    "screenConfig.getCertificate.components.div.children.deathSearchCard.children.cardContent.children.searchContainer1.visible",
    {}
  );

  const isSearchSet1Valid = validateFields(
    "components.div.children.deathSearchCard.children.cardContent.children.searchContainer1.children.details.children",
    state,
    dispatch,
    "getCertificate"
  );
  const isSearchSet2Valid = validateFields(
    "components.div.children.deathSearchCard.children.cardContent.children.searchContainer2.children.details.children",
    state,
    dispatch,
    "getCertificate"
  );
  const isSearchSetCommonValid = validateFields(
    "components.div.children.deathSearchCard.children.cardContent.children.searchContainerCommon.children",
    state,
    dispatch,
    "getCertificate"
  );

  if (!isSearchSetCommonValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields to search.",
          labelKey: "BND_COMMON_REQ_FIELDS_ERR"
        },
        "warning"
      )
    );
    return;
  }
  if (fromdate && todate ) {
    let fromdateofsearch=get(state.screenConfiguration.preparedFinalObject,"bnd.death.fromdate")
    let todateepochofsearch=get(state.screenConfiguration.preparedFinalObject,"bnd.death.todate")
    if(fromdateofsearch>todateepochofsearch)
    {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "",
          labelKey: "From Date should not be before To Date "
        },
        "warning"
      )
    );
    return;
      }
  }

  // if(!registrationNo && !hospitalId && !mothersName && !fathersName)
  // {
  //   dispatch(
  //     toggleSnackbar(
  //       true,
  //       {
  //         labelName: "Please fill enter atleast one attribute in the non mandatory list",
  //         labelKey: "BND_COMMON_REQ_FIELDS_ERR2"
  //       },
  //       "warning"
  //     )
  //   );
  //   return;
  // }

  const responseFromAPI = await searchForDeath(dispatch, queryParams)
  const deaths = (responseFromAPI && responseFromAPI.deathCerts) || [];

  const deathTableData = deaths.map(item => {
    return {
      id: get(item, "id"),
      registrationNo: get(item, "registrationno"),
      nameOfChild: get(item, "fullName"),
      dateOfdeath: get(item, "dateofdeath"),
      gender:  getGenderValue(get(item, "gender")),
      mothersName: get(item, "deathMotherInfo.fullName"),
      fathersName: get(item, "deathFatherInfo.fullName"),
      spouseName: get(item, "deathSpouseInfo.fullName"),
      action: getActionItem(get(item, "counter")),
      tenantId: get(item, "tenantid"),
      payRequired: get(item, "payRequired")
    };
  });
  dispatch(
    prepareFinalObject("bnd.death.deathSearchResponse", deaths)
  );

  // const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "searchScreenMdmsData.common-masters.uiCommonPay");
  // const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);
    
  try {
    let data = deathTableData.map(item => ({
      ['BND_COMMON_TABLE_ID']: item.id || "-",
      ['BND_COMMON_TABLE_REGNO']: item.registrationNo || "-",
      ["BND_COMMON_NAME"]: item.nameOfChild || "-",
      ['BND_DEATH_DATE']: convertEpochToDateWithTimeIST(item.dateOfdeath),
      ['BND_COMMON_GENDER']: item.gender || "-",
      ['BND_COMMON_MOTHERSNAME']: item.mothersName || "-",
      ['BND_COMMON_FATHERSNAME']: item.fathersName || "-",
      ['BND_SPOUSE_NAME_LABEL']: item.spouseName || "-",
      ['BND_COMMON_TABLE_ACTION']: item.action || "-",
      ["BUSINESS_SERVICE"]: "DEATH_CERT",
      ["TENANT_ID"]: item.tenantId,
      ["BND_VIEW_CERTIFICATE"]: "BND_VIEW_CERTIFICATE"
      //["PAYREQUIRED"]: item.payRequired,
      // ["BILL_ID"]: item.billId,
      // ["BILL_SEARCH_URL"]: searchScreenObject.url,
      // ["ADVANCE_PAYMENT"]: isAdvancePayment
    }));
    dispatch(
      handleField(
        "getCertificate",
        "components.div.children.searchResults",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        "components.div.children.searchResults",
        "props.tableData",
        deathTableData
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        "components.div.children.searchResults",
        "props.rows",
        deathTableData.length
      )
    );

    showHideTable(true, dispatch);
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
  }
}

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const getActionItem = (counter) => {
  if(counter < 1)
    return "FREE_DOWNLOAD";
  else
    return "PAY_AND_DOWNLOAD";
}

const getGenderValue = (genderCode) => {
  return genderValues[genderCode];
}