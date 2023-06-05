<!-- TODO: update this -->

# digit-ui-module-common

## Install

```bash
npm install --save @egovernments/digit-ui-module-common
```

## Limitation

```bash
This Package is more specific to DIGIT-UI's can be used across mission's for Payments
```

## Usage

After adding the dependency make sure you have this dependency in

```bash
frontend/micro-ui/web/package.json
```

```json
"@egovernments/digit-ui-module-common":"^1.5.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```


```jsx
/** add this import **/

import { paymentConfigs, PaymentLinks, PaymentModule } from "@egovernments/digit-ui-module-common";

/** inside enabledModules add this new module key **/

const enabledModules = ["Payment"];

/** inside init Function call this function **/

const initDigitUI = () => {
  window?.Digit.ComponentRegistryService.setupRegistry({
    PaymentModule,
    ...paymentConfigs,
    PaymentLinks,
  });
};
```

# Changelog

```bash
1.5.29 version upgraded for fixes in payment modules
1.5.28 base version
```

## Published from DIGIT Core 
Digit Dev Repo (https://github.com/egovernments/DIGIT-Dev/tree/digit-ui-core)

## License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)