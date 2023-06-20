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

# Changelog

```bash
1.5.25 added the support for horizontal metric chart
1.5.24 added commonmaster module to support its localisation
1.5.23 updated the routes in the dss module to have dynamic base context path
1.5.22 updated the readme file
1.5.21 added the readme file
1.5.20 base version
1.5.26 Added a new version of horizontalBar chart, In chartConfig it makes use of this boolean key = horizontalBarv2
```

## Published from DIGIT Core 
Digit Dev Repo (https://github.com/egovernments/DIGIT-Dev/tree/digit-ui-core)

## License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)