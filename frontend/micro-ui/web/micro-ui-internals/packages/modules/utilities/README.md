<!-- TODO: update this -->

# digit-ui-module-utilities

## Install

```bash
npm install --save digit-ui-module-utilities
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
"@egovernments/digit-ui-module-utilities":"0.0.1",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";

/** inside enabledModules add this new module key **/

const enabledModules = ["Utilities"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initUtilitiesComponents();
};

```

Add the Inbox /search config and use as mentioned below

```jsx
    import { InboxSearchComposer } from "@egovernments/digit-ui-module-utilities";

    <React.Fragment>
      <Header className="works-header-search">{t(updatedConfig?.label)}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig}></InboxSearchComposer>
      </div>
    </React.Fragment>
```


In MDMS

_Add this configuration to enable this module [MDMS Enabling Utilities Module](https://github.com/egovernments/works-mdms-data/blob/48461ecaf944ea243e24e1c1f9a5e2179d8091ac/data/pg/tenant/citymodule.json#L193)_

## List of Screens available in this versions were as follows

1. Search or Inbox
   Example Routes as follows

   ```bash
   works-ui/employee/utilities/search/commonMuktaUiConfig/SearchIndividualConfig
   
   works-ui/employee/utilities/search/commonMuktaUiConfig/InboxMusterConfig
   ```

2. Iframe

   ```bash
   works-ui/employee/utilities/iframe/shg/home
   ```

3. Workflow Test for any module

Sample URL

_Contract Module

```bash
  works-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=WO/2023-24/000721&businessService=CONTRACT&moduleCode=contract
```

_Estimate Module

```bash
  works-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=ES/2023-24/001606&businessService=ESTIMATE&moduleCode=estimate
```

_Attendance Module

```bash
  works-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=MR/2023-24/05/31/000778&businessService=MR&moduleCode=muster%20roll
```

_Bill Module

```bash
  works-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=PB/2023-24/000379&businessService=EXPENSE.PURCHASE&moduleCode=wages.purchase
```




## Coming Soon

1. Create Screen
2. View Screen


# Changelog

```bash
0.0.5 fixed the instablility issue with previous version
0.0.4 Updated the react-component library version
0.0.3 corrected the directory and added the preprocess function at inbox
0.0.2 added into the digit-core and integrated with core react components
0.0.1 base version
```

## Published from DIGIT Core 
Digit Dev Repo (https://github.com/egovernments/DIGIT-Dev/tree/digit-ui-core)

## License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)