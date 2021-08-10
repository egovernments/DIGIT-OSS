const remoteConfigPath = (path, screenKey) => {
  let config = {};
  switch (path) {
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;
