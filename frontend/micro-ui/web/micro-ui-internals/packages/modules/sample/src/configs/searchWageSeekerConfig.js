const searchWageSeekerConfig = () => {
  return {
    label: "WORKS_SEARCH_WAGESEEKERS",
    type: "search",
    actionLabel: "WORKS_ADD_WAGESEEKER",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-wageseeker",
    apiDetails: {
      serviceName: "/individual/v1/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        Individual: {},
      },
      minParametersForSearchForm: 1,
      masterName: "commonUiConfig",
      moduleName: "SearchWageSeekerConfig",
      tableFormJsonPath: "requestParam",
      filterFormJsonPath: "requestBody.Individual",
      searchFormJsonPath: "requestBody.Individual",
    },
    sections: {
      search: {
        uiConfig: {
          headerStyle: null,
          formClassName:"custom-both-clear-search",
          primaryLabel: "ES_COMMON_SEARCH",
          secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
          minReqFields: 1,
          defaultValues: {
            wardCode: "",
            individualId: "",
            name: "",
            socialCategory: "",
            mobileNumber: "",
            createdFrom: "",
            createdTo: "",
          },
          fields: [
            {
              "label": "COMMON_WARD",
              "type": "locationdropdown",
              "isMandatory": false,
              "disable": false,
              "populators": {
                  "name": "wardCode",
                  "type": "ward",
                "optionsKey": "i18nKey",
                  "defaultText": "COMMON_SELECT_WARD",
                  "selectedText": "COMMON_SELECTED",
                  "allowMultiSelect": false
              }
          },
            {
              label: "MASTERS_WAGESEEKER_NAME",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "name", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
            },
            {
              label: "MASTERS_WAGESEEKER_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: {
                name: "individualId",
                error: `PROJECT_PATTERN_ERR_MSG`,
                validation: {  minlength: 2 },
              },
            },
            {
              label: "CORE_COMMON_PROFILE_MOBILE_NUMBER",
              type: "mobileNumber",
              isMandatory: false,
              disable: false,
              populators: {
                name: "mobileNumber",
                error: `PROJECT_PATTERN_ERR_MSG`,
                validation: { pattern: /^[a-z0-9\/-@# ]*$/i, minlength: 2 },
              },
            },
            {
              label: "MASTERS_SOCIAL_CATEGORY",
              type: "dropdown",
              isMandatory: false,
              disable: false,
              populators: {
                name: "socialCategory",
                optionsKey: "code",
                optionsCustomStyle: {
                  top: "2.3rem",
                },
                mdmsConfig: {
                  masterName: "SocialCategory",
                  moduleName: "common-masters",
                  localePrefix: "MASTERS",
                },
              },
            },
            {
              label: "CREATED_FROM_DATE",
              type: "date",
              isMandatory: false,
              disable: false,
              key : "createdFrom",
              preProcess : {
                updateDependent : ["populators.max"]
              },
              populators: {
                name: "createdFrom",
                max : "currentDate"
              },
            },
            {
              label: "CREATED_TO_DATE",
              type: "date",
              isMandatory: false,
              disable: false,
              key : "createdTo",
              preProcess : {
                updateDependent : ["populators.max"]
              },
              populators: {
                name: "createdTo",
                error: "DATE_VALIDATION_MSG",
                max : "currentDate"
              },
              additionalValidation: {
                type: "date",
                keys: { start: "createdFrom", end: "createdTo" },
              },
            },
          ],
        },
        label: "",
        children: {},
        show: true,
      },
      searchResult: {
        label: "",
        uiConfig: {
          columns: [
            {
              label: "MASTERS_WAGESEEKER_ID",
              jsonPath: "individualId",
              additionalCustomization: true,
            },
            {
              label: "MASTERS_WAGESEEKER_NAME",
              jsonPath: "name.givenName",
            },
            {
              label: "MASTERS_FATHER_NAME",
              jsonPath: "fatherName",
            },
            {
              label: "MASTERS_SOCIAL_CATEGORY",
              jsonPath: "additionalFields.fields[0].value",
              // additionalCustomization: true,
            },
            {
              label: "CORE_COMMON_PROFILE_CITY",
              jsonPath: "address[0].tenantId",
              additionalCustomization: true,
            },
            {
              label: "MASTERS_WARD",
              jsonPath: "address[0].ward.code",
              additionalCustomization: true,
            },
            {
              label: "MASTERS_LOCALITY",
              jsonPath: "address[0].locality.code",
              additionalCustomization: true,
            },
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Individual",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default searchWageSeekerConfig;
