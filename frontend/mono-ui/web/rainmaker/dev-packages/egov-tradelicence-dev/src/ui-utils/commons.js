import commonConfig from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField, prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { uploadFile } from "egov-ui-framework/ui-utils/api";
import {
  acceptedFiles, getFileUrl,
  getFileUrlFromAPI, getMultiUnits, getQueryArg, setBusinessServiceDataToLocalStorage,
  enableField, disableField ,enableFieldAndHideSpinner, getObjectValues
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import compact from "lodash/compact";
import store from "redux/store";
import {
  convertDateToEpoch,
  getCurrentFinancialYear, getTranslatedLabel,
  ifUserRoleExists,
  getUniqueItemsFromArray
} from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";

export const updateTradeDetails = async requestBody => {
  try {
    const payload = await httpRequest(
      "post",
      "/tl-services/v1/_update",
      "",
      [],
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const getSearchResults = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/tl-services/v1/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    enableFieldAndHideSpinner('search',"components.div.children.tradeLicenseApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton",store.dispatch);
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

const setDocsForEditFlow = async (state, dispatch) => {
  let applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.applicationDocuments",
    []
  );
  /* To change the order of application documents similar order of mdms order*/
  const mdmsDocs = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.documentObj[0].allowedDocs",
    []
  );
  let orderedApplicationDocuments = mdmsDocs.map(mdmsDoc => {
    let applicationDocument = {}
    applicationDocuments&&applicationDocuments.map(appDoc => {
      if (appDoc.documentType == mdmsDoc.documentType) {
        applicationDocument = { ...appDoc }
      }
    })
    return applicationDocument;
  }
  ).filter(docObj => Object.keys(docObj).length > 0)
  applicationDocuments = [...orderedApplicationDocuments];
  dispatch(
    prepareFinalObject("Licenses[0].tradeLicenseDetail.applicationDocuments", applicationDocuments)
  );

  let uploadedDocuments = {};
  let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          fileName:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                getFileUrl(fileUrlPayload[item.fileStoreId])
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`,
          fileStoreId: item.fileStoreId,
          fileUrl: Object.values(fileUrlPayload)[index],
          documentType: item.documentType,
          tenantId: item.tenantId,
          id: item.id
        }
      ];
    });
  dispatch(
    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", uploadedDocuments)
  );
};

const generateNextFinancialYear = state => {
  const currentFY = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].financialYear"
  );
  const financialYears = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.egf-master.FinancialYear",
    []
  );
  const currrentFYending = financialYears.filter(item => item.code === currentFY)[0]
    .endingDate;

  const nectYearObject = financialYears.filter(item => item.startingDate === currrentFYending)[0];
  return nectYearObject ? nectYearObject.code : getCurrentFinancialYear();

};

export const updatePFOforSearchResults = async (
  action,
  state,
  dispatch,
  queryValue,
  tenantId
) => {
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId ? tenantId : getTenantId()
    },
    { key: "applicationNumber", value: queryValue }
  ];
  const isPreviouslyEdited = getQueryArg(window.location.href, "edited");
  const payload = !isPreviouslyEdited
    ? await getSearchResults(queryObject)
    : {
      Licenses: get(state.screenConfiguration.preparedFinalObject, "Licenses")
    };
  // const payload = await getSearchResults(queryObject)
  // getQueryArg(window.location.href, "action") === "edit" &&
  //   (await setDocsForEditFlow(state, dispatch));

  if (payload && payload.Licenses) {
    
    let ownersInitial=get(payload.Licenses[0],'tradeLicenseDetail.owners',[]);
    set(payload.Licenses[0],'tradeLicenseDetail.owners',ownersInitial.filter(owner=>owner.userActive));
    dispatch(prepareFinalObject("Licenses[0]", payload.Licenses[0]));
    dispatch(prepareFinalObject("LicensesTemp[0].oldOwners",  [...payload.Licenses[0].tradeLicenseDetail.owners]));
    const structureTypes=get(payload,'Licenses[0].tradeLicenseDetail.structureType','').split('.')||[];
    const structureType=structureTypes&&Array.isArray(structureTypes)&&structureTypes.length>0&&structureTypes[0]||'none';
    const structureSubType=get(payload,'Licenses[0].tradeLicenseDetail.structureType','')||'none'
    const selectedValues=[{
      structureType:structureType,
      structureSubType: structureSubType
    }]
    dispatch(
      prepareFinalObject("DynamicMdms.common-masters.structureTypes.selectedValues", selectedValues));
      // dispatch(
        // prepareFinalObject("DynamicMdms.common-masters.structureTypes.structureSubTypeTransformed.allDropdown[0]", getObjectValues(get(state.screenConfiguration.preparedFinalObject,`applyScreenMdmsData.common-masters.StructureType.structureTypesTransformed.${structureType}`,[]))));

      let dropDownValues = getObjectValues(get(state.screenConfiguration.preparedFinalObject,`DynamicMdms.common-masters.structureTypes.structureTypesTransformed.${structureType}`,[]));
      let structureSubTypeDropValues = [];
      if (dropDownValues && dropDownValues.length === 0) {
        dropDownValues = get(state.screenConfiguration.preparedFinalObject,`applyScreenMdmsData.common-masters.StructureType`,[]);
        if (dropDownValues && dropDownValues.length > 0) {
          structureSubTypeDropValues = dropDownValues.filter(data => data.code.split('.')[0] === structType.split(".")[0]);
          dispatch(prepareFinalObject("DynamicMdms.common-masters.structureTypes.structureSubTypeTransformed.allDropdown[0]", structureSubTypeDropValues));
        }
      } else {
        dispatch(prepareFinalObject("DynamicMdms.common-masters.structureTypes.structureSubTypeTransformed.allDropdown[0]", dropDownValues));
      }

  }

  const isEditRenewal = getQueryArg(window.location.href, "action") === "EDITRENEWAL";
  if (isEditRenewal) {
    const nextYear = generateNextFinancialYear(state);
    dispatch(
      prepareFinalObject("Licenses[0].financialYear", nextYear));
  }

  setDocsForEditFlow(state, dispatch);

  setApplicationNumberBox(state, dispatch);

  createOwnersBackup(dispatch, payload);


};

export const getBoundaryData = async (
  action,
  state,
  dispatch,
  queryObject,
  code,
  componentPath
) => {
  try {
    let payload = await httpRequest(
      "post",
      "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
      "_search",
      queryObject,
      {}
    );
    const tenantId =
      process.env.REACT_APP_NAME === "Employee"
        ? get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].tradeLicenseDetail.address.city"
        )
        : getQueryArg(window.location.href, "tenantId");

    const mohallaData =
      payload &&
      payload.TenantBoundary[0] &&
      payload.TenantBoundary[0].boundary &&
      payload.TenantBoundary[0].boundary.reduce((result, item) => {
        result.push({
          ...item,
          name: `${tenantId
            .toUpperCase()
            .replace(/[.]/g, "_")}_REVENUE_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`
        });
        return result;
      }, []);

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.tenant.localities",
        // payload.TenantBoundary && payload.TenantBoundary[0].boundary,
        mohallaData
      )
    );

    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
        "props.suggestions",
        mohallaData
      )
    );
    if (code) {
      let data = payload.TenantBoundary[0].boundary;
      let messageObject =
        data &&
        data.find(item => {
          return item.code == code;
        });
      if (messageObject)
        dispatch(
          prepareFinalObject(
            "Licenses[0].tradeLicenseDetail.address.locality.name",
            messageObject.name
          )
        );
    }
  } catch (e) {
    console.log(e);
  }
};

const createOwnersBackup = (dispatch, payload) => {
  const owners = get(payload, "Licenses[0].tradeLicenseDetail.owners");
  owners &&
    owners.length > 0 &&
    dispatch(
      prepareFinalObject(
        "LicensesTemp[0].tradeLicenseDetail.owners",
        JSON.parse(JSON.stringify(owners))
      )
    );
};

const getMultipleOwners = owners => {
  let mergedOwners =
    owners &&
    owners.reduce((result, item) => {
      if (item && item !== null && item.hasOwnProperty("mobileNumber")) {
        if (item.hasOwnProperty("active") && item.active) {
          if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
            set(item, "active", false);
            result.push(item);
          } else {
            result.push(item);
          }
        } else {
          if (!item.hasOwnProperty("isDeleted")) {
            result.push(item);
          }
        }
      }
      return result;
    }, []);

  return mergedOwners;
};

export const applyTradeLicense = async (state, dispatch, activeIndex) => {
  try {
    let queryObject = JSON.parse(
      JSON.stringify(
        get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
      )
    );
    //------ removing null from document array ------
    let documentArray = compact(get(queryObject[0], "tradeLicenseDetail.applicationDocuments"));
    let documents = getUniqueItemsFromArray(documentArray, "fileStoreId");
    documents=documents.filter(item=> item.fileUrl&&item.fileName).map(item=>{
      delete item.fileUrl;
      return{...item}});
    set(queryObject[0], "tradeLicenseDetail.applicationDocuments", documents);
    //-----------------------------------------------
    // let documents = get(queryObject[0], "tradeLicenseDetail.applicationDocuments");
    set(
      queryObject[0],
      "validFrom",
      convertDateToEpoch(queryObject[0].validFrom, "dayend")
    );
    set(queryObject[0], "wfDocuments", documents);
    set(
      queryObject[0],
      "validTo",
      convertDateToEpoch(queryObject[0].validTo, "dayend")
    );
    if (queryObject[0] && queryObject[0].commencementDate) {
      queryObject[0].commencementDate = convertDateToEpoch(
        queryObject[0].commencementDate,
        "dayend"
      );
    }
    let owners = get(queryObject[0], "tradeLicenseDetail.owners");
    owners = (owners && convertOwnerDobToEpoch(owners)) || [];

    const cityId = get(
      queryObject[0],
      "tradeLicenseDetail.address.tenantId",
      ""
    );
    const tenantId = ifUserRoleExists("CITIZEN") ? cityId : getTenantId();
    const BSqueryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "NewTL" }
    ];
    disableField('apply',"components.div.children.footer.children.nextButton",dispatch);
    disableField('apply', "components.div.children.footer.children.payButton",dispatch);
   
    if (process.env.REACT_APP_NAME === "Citizen") {
      // let currentFinancialYr = getCurrentFinancialYear();
      // //Changing the format of FY
      // let fY1 = currentFinancialYr.split("-")[1];
      // fY1 = fY1.substring(2, 4);
      // currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;
      // set(queryObject[0], "financialYear", currentFinancialYr);
      setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
    }

    set(queryObject[0], "tenantId", tenantId);
    set(queryObject[0], "workflowCode", "NewTL");
    set(queryObject[0], "applicationType", "NEW");
    if (queryObject[0].applicationNumber) {
      //call update
      const isEditRenewal = getQueryArg(window.location.href, "action") === "EDITRENEWAL";
      if (isEditRenewal) {
        // if(process.env.REACT_APP_NAME === "Citizen"){
        //   const nextFinancialyear = await getNextFinancialYearForRenewal(queryObject[0].financialYear);
        //   set(queryObject[0], "financialYear", nextFinancialyear);
        // }     
        set(queryObject[0], "applicationType", "RENEWAL");
        set(queryObject[0], "workflowCode", getQueryArg(window.location.href, "action"));
      }

      let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      // const selectedTradeSubType = get(state, "screenConfiguration.preparedFinalObject.DynamicMdms.TradeLicense.tradeUnits.tradeSubType", []);
      // tradeUnits[0].tradeType = selectedTradeSubType;
      set(
        queryObject[0],
        "tradeLicenseDetail.tradeUnits",
        getMultiUnits(tradeUnits)
      );
      set(
        queryObject[0],
        "tradeLicenseDetail.accessories",
        getMultiUnits(accessories)
      );
      set(
        queryObject[0],
        "tradeLicenseDetail.owners",
        getMultipleOwners(owners)
      );

      let action = "INITIATE";
      //Code for edit flow

      if (
        queryObject[0].tradeLicenseDetail &&
        queryObject[0].tradeLicenseDetail.applicationDocuments
      ) {


        if (getQueryArg(window.location.href, "action") === "edit" || isEditRenewal) {
        } else if (activeIndex === 1) {
          set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
        } else action = "APPLY";
      }

      if ((activeIndex === 3 || activeIndex === 1) && isEditRenewal) {
        action = activeIndex === 3 ? "APPLY" : "INITIATE";
        let renewalSearchQueryObject = [
          { key: "tenantId", value: queryObject[0].tenantId },
          { key: "applicationNumber", value: queryObject[0].applicationNumber }
        ];
        const renewalResponse = await getSearchResults(renewalSearchQueryObject);
        const renewalDocuments = get(renewalResponse, "Licenses[0].tradeLicenseDetail.applicationDocuments");
        for (let i = 1; i <= documents.length; i++) {
          if (i > renewalDocuments.length) {
            renewalDocuments.push(documents[i - 1])
          }
          else {
            if (!documents[i - 1].hasOwnProperty("id")) {
              renewalDocuments[i - 1].active = false;
              renewalDocuments.push(documents[i - 1])
            }
          }
        }
        dispatch(prepareFinalObject("Licenses[0].tradeLicenseDetail.applicationDocuments", renewalDocuments));
        set(queryObject[0], "tradeLicenseDetail.applicationDocuments", renewalDocuments);

      }
      set(queryObject[0], "action", action);
      const isEditFlow = getQueryArg(window.location.href, "action") === "edit";
      let updateResponse = [];
      if (!isEditFlow) {
        let oldOwners = JSON.parse(
          JSON.stringify(
            get(state.screenConfiguration.preparedFinalObject, "LicensesTemp[0].tradeLicenseDetail.owners", [])
          )
        );
        set(queryObject[0], "tradeLicenseDetail.owners", checkValidOwners(get(queryObject[0], "tradeLicenseDetail.owners",[]),oldOwners));
        updateResponse = await httpRequest("post", "/tl-services/v1/_update", "", [], {
          Licenses: queryObject
        })
      }
      //Renewal flow

      let updatedApplicationNo = "";
      let updatedTenant = "";
      if (isEditRenewal && updateResponse && get(updateResponse, "Licenses[0]")) {
        updatedApplicationNo = get(updateResponse.Licenses[0], "applicationNumber");
        updatedTenant = get(updateResponse.Licenses[0], "tenantId");
        const workflowCode = get(updateResponse.Licenses[0], "workflowCode");
        const bsQueryObject = [
          { key: "tenantId", value: tenantId },
          { key: "businessServices", value: workflowCode ? workflowCode : "NewTL" }
        ];
        setBusinessServiceDataToLocalStorage(bsQueryObject, dispatch);
      } else {
        updatedApplicationNo = queryObject[0].applicationNumber;
        updatedTenant = queryObject[0].tenantId;
      }
      let searchQueryObject = [
        { key: "tenantId", value: updatedTenant },
        { key: "applicationNumber", value: updatedApplicationNo }
      ];
      let searchResponse = await getSearchResults(searchQueryObject);
      if (isEditFlow) {
        searchResponse = { Licenses: queryObject };
      } else {
        dispatch(prepareFinalObject("Licenses", searchResponse.Licenses));
      }
      enableField('apply',"components.div.children.footer.children.nextButton",dispatch);
      enableField('apply',"components.div.children.footer.children.payButton",dispatch);
      
      const updatedtradeUnits = get(
        searchResponse,
        "Licenses[0].tradeLicenseDetail.tradeUnits"
      );
      const tradeTemp = updatedtradeUnits.map((item, index) => {
        return {
          tradeSubType: item.tradeType.split(".")[1],
          tradeType: item.tradeType.split(".")[0]
        };
      });


      dispatch(prepareFinalObject("LicensesTemp.tradeUnits", tradeTemp));
      createOwnersBackup(dispatch, searchResponse);
    } else {
      let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      // let owners = get(queryObject[0], "tradeLicenseDetail.owners");
      let mergedTradeUnits =
        tradeUnits &&
        tradeUnits.filter(item => !item.hasOwnProperty("isDeleted"));
      let mergedAccessories =
        accessories &&
        accessories.filter(item => !item.hasOwnProperty("isDeleted"));
      let mergedOwners =
        owners && owners.filter(item => !item.hasOwnProperty("isDeleted"));
      set(queryObject[0], "tradeLicenseDetail.tradeUnits", mergedTradeUnits);
      set(queryObject[0], "tradeLicenseDetail.accessories", mergedAccessories);
      set(queryObject[0], "tradeLicenseDetail.owners", mergedOwners);
      set(queryObject[0], "action", "INITIATE");
      //Emptying application docs to "INITIATE" form in case of search and fill from old TL Id.
      if (!queryObject[0].applicationNumber)
        set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
      const response = await httpRequest(
        "post",
        "/tl-services/v1/_create",
        "",
        [],
        { Licenses: queryObject }
      );
      dispatch(prepareFinalObject("Licenses", response.Licenses));
      enableField('apply',"components.div.children.footer.children.nextButton",dispatch);
      enableField('apply',"components.div.children.footer.children.payButton",dispatch);
      createOwnersBackup(dispatch, response);
    }
    /** Application no. box setting */
    setApplicationNumberBox(state, dispatch);
    return true;
  } catch (error) {
    enableField('apply',"components.div.children.footer.children.nextButton",dispatch);
    enableField('apply',"components.div.children.footer.children.payButton",dispatch);
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    console.log(error);
    return false;
  }
};

const convertOwnerDobToEpoch = owners => {
  let updatedOwners =
    owners && owners.length > 0 &&
    owners
      .map(owner => {
        return {
          ...owner,
          dob:
            owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
        };
      })
      .filter(item => item && item !== null);
  return updatedOwners;
};

export const getImageUrlByFile = file => {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const fileurl = e.target.result;
      resolve(fileurl);
    };
  });
};

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};

const setApplicationNumberBox = (state, dispatch) => {
  let applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.Licenses[0].applicationNumber",
    null
  );
  if (applicationNumber) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNumber
      )
    );
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};


export const handleFileUpload = (event, handleDocument, props,afterFileSelected) => {
  const S3_BUCKET = {
    endPoint: "filestore/v1/files"
  };
  let uploadDocument = true;
  const { maxFileSize, formatProps, moduleName } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      const fileValid = isFileValid(file, acceptedFiles(formatProps.accept));
      const isSizeValid = getFileSize(file) <= maxFileSize;
      if (!fileValid) {
        alert(`Only image or pdf files can be uploaded`);
        uploadDocument = false;
      }
      if (!isSizeValid) {
        alert(`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`);
        uploadDocument = false;
      }
      if (uploadDocument) {
        afterFileSelected&&typeof afterFileSelected=='function'&&afterFileSelected();
        if (file.type.match(/^image\//)) {
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            moduleName,
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId);
        } else {
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            moduleName,
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId);
        }
      }
    });
  }
};

export const getNextFinancialYearForRenewal = async (currentFinancialYear) => {
  let payload = null;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear", filter: `[?(@.module == "TL")]` }]
        }
      ]
    }
  };

  try {
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    const financialYears = get(payload.MdmsRes, "egf-master.FinancialYear");
    const currrentFYending = financialYears.filter(item => item.code === currentFinancialYear)[0]
      .endingDate;
    const nectYearObject = financialYears.filter(item => item.startingDate === currrentFYending)[0];
    return nectYearObject ? nectYearObject.code : getCurrentFinancialYear();
  } catch (e) {
    console.log(e.message)
  }
}

 export const checkValidOwners=(currentOwners=[],oldOwners=[])=>{

/*  Quick fix for the owner issue fix in renewal flow */


//   for (var i = 0, len = currentOwners.length; i < len; i++) { 
//     for (var j = 0, len2 = oldOwners.length; j < len2; j++) { 
//         if (currentOwners[i].name === oldOwners[j].name) {
//           oldOwners.splice(j, 1);
//             len2=oldOwners.length;
//         }
//     }   
// }
// oldOwners=oldOwners&&Array.isArray(oldOwners)&&oldOwners.map(owner=>{
//   return {...owner, userActive :false}
// })
// currentOwners=currentOwners&&Array.isArray(currentOwners)&&currentOwners.map(owner=>{
//   return {...owner, userActive :true}
// })

return [...currentOwners];
 }