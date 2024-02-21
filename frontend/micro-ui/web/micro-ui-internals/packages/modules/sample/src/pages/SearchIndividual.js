import {
    Header,
    InboxSearchComposer
  } from "@egovernments/digit-ui-react-components";
  import React, { useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  
  // Define default values for search fields
  const defaultSearchValues = {
    individualName: "",
    mobileNumber: "",
    individualId: ""
  };
  
  export const searchconfig = () => 
  {
    return {
      label: "Individual Search",
      type: "search",
      apiDetails: {
        serviceName: "/individual/v1/_search",
        requestParam: {
            "tenantId": "pg.citya",
        },
        requestBody: {
          apiOperation: "SEARCH",
          Individual: {
            "tenantId": "pg.citya",
          },
        },
       masterName: "commonUiConfig",
        moduleName: "SearchIndividualConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.Individual",
        searchFormJsonPath: "requestBody.Individual",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              {
                label: "Applicant name ",
                isMandatory: false,
                key: "individualName",
                type: "text",
                populators: { 
                  name: "individualName", 
                  error: "Required", 
                  validation: { pattern: /^[A-Za-z]+$/i } 
                },
              },
              {
                label: "Phone number",
                isMandatory: false,
                key: "Phone number",
                type: "number",
                disable: false,
                populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999} },
              },
              {
                label: "Individual Id ",
                isMandatory: false,
                type: "text",
                disable: false,
                populators: { 
                  name: "individualId",
                },
              },
            ],
          },
  
          show: true
        },
        searchResult: {
          tenantId: "pg.citya",
          uiConfig: {
            columns: [
              {
                label: "Individual ID",
                jsonPath: "individualId"
              },
              {
                label: "Name",
                jsonPath: "name.givenName"
              },
              {
                label: "Address",
                jsonPath: "address",
               "additionalCustomization": true
              },
            ],
          
            enableColumnSort: true,
            resultsJsonPath: "Individual"
          },
          show: true,
        },
      },
    };
  };
  
  const SearchIndividual = () => {
    const { t } = useTranslation();
    const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
    const indConfigs = searchconfig();
  
    useEffect(() => {
      // Set default values when component mounts
      setDefaultValues(defaultSearchValues);
    }, []);
  
    return (
      <React.Fragment>
        <Header styles={{ fontSize: "32px" }}>{t(indConfigs?.label)}</Header> 
        <div className="inbox-search-wrapper">
          {/* Pass defaultValues as props to InboxSearchComposer */}
          <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues}></InboxSearchComposer>
        </div>
      </React.Fragment>
    );
  };
  export default SearchIndividual;
  
  