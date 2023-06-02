<!-- TODO: update this -->

# digit-ui-module-core

## Install

```bash
npm install --save @egovernments/digit-ui-module-core
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
"@egovernments/digit-ui-module-core":"^1.5.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { DigitUI } from "@egovernments/digit-ui-module-core";


/** inside render Function add  the import for the component **/

  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />, document.getElementById("root"));

```

# Changelog

```bash
1.5.34 fixed module not found redirection issue
1.5.33 fixed payment not throwing error page for sanitation
1.5.32 fixed the localisation issue by adding translation to the keys and fixed payment response issue for  sanitation UI
1.5.31 fixed the allservices screen back button for sanitation UI
1.5.30 fixed the home routing issue in error screen
1.5.29 added the readme file
1.5.28 fixed the route issue for profile screen
```

## Published from DIGIT Core

Digit Dev Repo (<https://github.com/egovernments/DIGIT-Dev/tree/digit-ui-core>)

## License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)
