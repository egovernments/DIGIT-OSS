# digit-ui-libraries

> Made with @egovernments/create-ui-library

## Install

```bash
npm install --save @egovernments/digit-ui-libraries
```

## Usage

```jsx
import React from "react";
import initLibraries from "@egovernments/digit-ui-libraries";

import defaultConfig from "./config";

const App = ({ deltaConfig, stateCode, cityCode, moduleCode }) => {
  initLibraries();

  const store = eGov.Services.useStore(defaultConfig, { deltaConfig, stateCode, cityCode, moduleCode });

  return <p>Create React Library Example 😄</p>;
};

export default App;
```

## License

MIT © [](https://github.com/)
