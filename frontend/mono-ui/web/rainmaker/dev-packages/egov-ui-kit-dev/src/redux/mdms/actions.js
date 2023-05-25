import * as actionTypes from "./actionTypes";
import * as commonActions from "../common/actions";
import { initForm } from "egov-ui-kit/redux/form/actions";
import { SPEC, MDMS } from "egov-ui-kit/utils/endPoints";
import { upperCaseFirst } from "egov-ui-kit/utils/commons";
import { httpRequest } from "egov-ui-kit/utils/api";

const specsFetchPending = () => {
  return {
    type: actionTypes.SPECS_FETCH_PENDING,
  };
};

const specsFetchComplete = (payload, moduleName, masterName) => {
  return {
    type: actionTypes.SPECS_FETCH_COMPLETE,
    payload,
    moduleName,
    masterName,
  };
};

const specsFetchError = (error) => {
  return {
    type: actionTypes.SPECS_FETCH_ERROR,
    error,
  };
};

const dataFetchPending = () => {
  return {
    type: actionTypes.DATA_FETCH_PENDING,
  };
};

export const dataFetchComplete = (payload, moduleName, masterName) => {
  return {
    type: actionTypes.DATA_FETCH_COMPLETE,
    payload,
    moduleName,
    masterName,
  };
};

const dataFetchError = (error) => {
  return {
    type: actionTypes.DATA_FETCH_ERROR,
    error,
  };
};

const documentDataFetchPending = () => {
  return {
    type: actionTypes.DOCUMENT_DATA_FETCH_PENDING,
  };
};

export const documentDataFetchComplete = (payload) => {
  return {
    type: actionTypes.DOCUMENT_DATA_FETCH_COMPLETE,
    payload
  };
};

const documentDataFetchError = (error) => {
  return {
    type: actionTypes.DOCUMENT_DATA_FETCH_ERROR,
    error,
  };
};

const mapFloatingLabelText = (rawText) => {
  return rawText.split(".").pop();
};

const transformRawTypeToFormat = (rawType) => {
  switch (rawType) {
    case "text":
      return "textfield";
    case "checkbox":
      return "checkbox";
    case "singleValueList":
      return "singleValueList";
    case "AutocompleteDropdown":
      return "AutocompleteDropdown";
    default:
      return "textfield";
  }
};

const createMDMSGenericSpecs = (moduleName, masterName, tenantId) => {
  return {
    moduleName: {
      id: "MDMS_moduleName",
      required: true,
      type: null,
      dontReset: true,
      jsonPath: "MasterMetaData.moduleName",
      value: moduleName,
    },
    masterName: {
      id: "MDMS_masterName",
      required: true,
      type: null,
      dontReset: true,
      jsonPath: "MasterMetaData.masterName",
      value: masterName,
    },
    topLevelTenantId: {
      id: "MDMS_tenantIdtopLevel",
      required: true,
      type: null,
      dontReset: true,
      jsonPath: "MasterMetaData.tenantId",
      value: tenantId,
    },
    tenantId: {
      id: "MDMS_tenantId",
      required: true,
      type: null,
      dontReset: true,
      jsonPath: "MasterMetaData.masterData[0].tenantId",
      value: tenantId,
    },
  };
};

const transform = (rawSpecs, moduleName, tenantId) => {
  return {
    ...rawSpecs,
    values: rawSpecs.values.reduce((result, current) => {
      if (current.name != "tenantId") {
        let master = upperCaseFirst(current.name);
        result["fields"] = {
          ...result["fields"],
          [current.name]: {
            id: current.name,
            type: transformRawTypeToFormat(current.type),
            required: current.isRequired,
            jsonPath: current.jsonPath.replace("MdmsMetadata", "MasterMetaData"),
            floatingLabelText: mapFloatingLabelText(current.label),
            errorMessage: current.patternErrorMsg,
            hintText: "",
            pattern: current.pattern,
            value: "",
            disabled: current.isDisabled,
            //To make API call and initialise field, if Reqd.
            dataFetchConfig:
              (current.type === "singleValueList" || current.type === "AutocompleteDropdown")
                ? {
                    url: MDMS.GET.URL,
                    action: MDMS.GET.ACTION,
                    queryParams: {},
                    requestBody: {
                      MdmsCriteria: {
                        tenantId: tenantId,
                        moduleDetails: [
                          {
                            moduleName: moduleName,
                            masterDetails: [
                              {
                                name: master,
                              },
                            ],
                          },
                        ],
                      },
                    },
                    dataPath: `MdmsRes[${moduleName}][${master}]`,
                  }
                : null,
          },
        };
      }
      return result;
    }, {}),
  };
};

export const fetchSpecs = (queryObject, moduleName, masterName, tenantId, requestBody) => {
  return async (dispatch, getState) => {
    dispatch(specsFetchPending());
    dispatch(dataFetchPending());
    try {
      const payloadSpec = await httpRequest(`${SPEC.GET.URL}/${moduleName}/${masterName}`, SPEC.GET.ACTION, queryObject);
      const specs = transform(payloadSpec, moduleName, tenantId);
      const { fields } = specs.values;
      const formConfig = {
        fields: {
          ...fields,
          ...createMDMSGenericSpecs(moduleName, masterName, tenantId),
        },
        name: `MDMS_${masterName}`,
        submit: { type: "submit", label: "CORE_COMMON_CONTINUE" },
        saveUrl: "egov-mdms-create/v1/_create",
        editUrl: "egov-mdms-create/v1/_update",
        editToast: "Updated Successfully",
        createToast: "Created Successfully",
      };
      dispatch(initForm(formConfig));
      dispatch(specsFetchComplete(payloadSpec, moduleName, masterName));
      try {
        const payloadData = await httpRequest(MDMS.GET.URL, MDMS.GET.ACTION, [], requestBody);
        dispatch(dataFetchComplete(payloadData, moduleName, masterName));
      } catch (error) {
        dispatch(dataFetchError(error.message));
      }
    } catch (error) {
      dispatch(specsFetchError(error.message));
    }
  };
};


export const fetchDocuments = (tenantId) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "Documents" }] }],
    },
  };
  return async (dispatch) => {
    if(tenantId){
    dispatch(documentDataFetchPending());
    try {
     
        const payload = await httpRequest(MDMS.GET.URL, MDMS.GET.ACTION,[], mdmsBody);
        
      
      dispatch(documentDataFetchComplete(payload));
    } catch (e) {
      dispatch(documentDataFetchError(e.message));
    }}
  };
};