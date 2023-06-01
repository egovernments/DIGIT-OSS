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
1.5.22 updated the readme file
1.5.21 added the readme file
1.5.20 base version
```

## Published from DIGIT Core 
Digit Dev Repo (https://github.com/egovernments/DIGIT-Dev/tree/digit-ui-core)

## License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)