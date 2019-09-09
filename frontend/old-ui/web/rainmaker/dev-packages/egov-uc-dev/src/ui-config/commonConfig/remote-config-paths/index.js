const remoteConfigPath = (path, screenKey) => {
  let config = {};
  switch (path) {
    case "egov-uc":
      config = require(`egov-uc/ui-config/screens/specs/${path}/${screenKey}`)
        .default;
      break;
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;
