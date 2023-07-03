<!-- TODO: update this -->

# digit-ui-module-dss

## Install

```bash
npm install --save @egovernments/digit-ui-module-dss
```

## Limitation

```bash
This Package is more specific to DIGIT-UI's can be used across mission's
```

## Usage

After adding the dependency make sure you have this dependency in

```bash
frontend/micro-ui/web/package.json
```

```json
"@egovernments/digit-ui-module-dss":"^1.5.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```


```jsx
/** add this import **/

import { initDSSComponents } from "@egovernments/digit-ui-module-dss";

/** inside enabledModules add this new module key **/

const enabledModules = ["DSS"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initDSSComponents();
};
```

## Dynamic filter Usage
DSS UI

Digit-UI has a DSS module that displays multiple types of charts, and tables based on the configuration. In DSS there are some filters that are fixed for all the pages, they should be based on the configuration. 

Example config

MasterDashboardConfig.json

```json

{
  "name": "DSS_REPORT",
  "filter": "FilterComponent",
  "filterConfig": [
    {
      "id": "DATE_RANGE",
      "name": "ES_DSS_DATE_RANGE",
      "type": "DateRange",
      "props": {
        "maxNumberOfDays": 90
      }
    },
    {
      "id": "LOCALITY",
      "name": "ES_DSS_LOCALITY",
      "type": "Dropdown",
      "source": {
        "type": "request",
        "hostUrl": "https://works-dev.digit.org",
        "requestMethod": "POST",
        "requestUrl": "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Locality&tenantId={$.tenantId}",
        "requestBody": "{\"criteria\":{\"tenantId\" : \"{$.tenantId}\" }}",
        "keyPath": "$.TenantBoundary[0].boundary.*.name",
        "valuesPath": "$.TenantBoundary[0].boundary.*.code"
      },
      "appliedFilterPath": "filters.locality",
      "placeholder": "ES_DSS_ALL_LOCALITY_SELECTED"
    },
{
      "id": "DISTRICT",
      "name": "ES_DSS_DDR",
      "type": "MultiSelectDropdown",
      "source": {
        "type": "request",
        "hostUrl": "https://works-dev.digit.org",
        "requestMethod": "POST",
        "requestUrl": "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Locality&tenantId={$.tenantId}",
        "requestBody": "{\"criteria\":{\"tenantId\" : \"{$.tenantId}\" }}",
        "keyPath": "$.TenantBoundary[0].boundary.*.name",
        "valuesPath": "$.TenantBoundary[0].boundary.*.code"
      },
      "appliedFilterPath": "filters.locality",
      "placeholder": "ES_DSS_ALL_LOCALITY_SELECTED"
    },
    
    {
      "id": "PAYMENT_MODE",
      "name": "ES_DSS_PAYMENT_MODE",
      "type": "MultiSelectDropdown",
      "source": {
        "type": "list",
        "list": [
          {
            "key": "CASH",
            "value": "CASH"
          },
          {
            "key": "CARD",
            "value": "CARD"
          }
          {
            "key": "CHEQUE",
            "value": "CHEQUE"
          }
        ],
        "keyPath": "$.*.key",
        "valuesPath": "$.*.value",
        "sortBy": "name"
      },
      "appliedFilterPath": "filters.paymentMode",
      "placeholder": "ES_DSS_ALL_PAYMENT_SELECTED"
    }
  ],
  "visualizations": []
}
```

```jsx
// add the following hooks to have a dynamic filter under dss ``Digit.Hooks.dss.useGetCustomFilterValues``
const useGetCustomFilterValues = (filterConfigs, config={}) => {
  return useQuery(`DSS_CUSTOM_FILTER_CONFIG_${JSON.stringify(filterConfigs)}`, () => DSSService.getFiltersConfigData(filterConfigs), config);
};


const useGetCustomFilterRequestValues = (filterConfigs, config={}) => {
  return useQuery(`DSS_CUSTOM_FILTER_REQUEST_VAL_${JSON.stringify(filterConfigs)}`, () => DSSService.getCustomFiltersDynamicValues(filterConfigs), config);
};
```


# Changelog

```bash
1.5.35 Added the dynamic filter component 
1.5.34 Count config added for Metric chart
1.5.33 Horizontal Bar and Pie chart alignment fixes
1.5.32 Percentage symbol showing in Yaxis ticker and left alignment of label for FSM Capacity Utilization 
1.5.31 Horizontal Bar chart alignment fixes
1.5.30 Added enhancement for pie chart using variant flag according to new requirements. Refer CustomPieChart component.
1.5.29 DSS UI alignment fixes for Horizontal Metric and bar chart
1.5.28 added the support for the dynamic icon in the metric chart by adding flag iconName
1.5.27 Alignment fixes for Horizontal Metric Charts
1.5.26 Added a new version of horizontalBar chart, In chartConfig it makes use of this boolean key = horizontalBarv2
1.5.25 added the support for horizontal metric chart, In chartConfig it makes use of this boolean key = isHorizontalChart
1.5.24 added commonmaster module to support its localisation
1.5.23 updated the routes in the dss module to have dynamic base context path
1.5.22 updated the readme file
1.5.21 added the readme file
1.5.20 base version
```

## Published from DIGIT Core 
Digit Dev Repo (https://github.com/egovernments/DIGIT-Dev/tree/digit-ui-core)

## License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)