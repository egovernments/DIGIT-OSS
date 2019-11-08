const remoteConfigPath = (path, screenKey) => {
  let config = {};
  switch (path) {
    case "tradelicence":
    case "tradelicense-citizen":
      config = require(`egov-tradelicence/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
      case "pt-mutation":
        // case "pt-citizen":
          config = require(`egov-pt/ui-config/screens/specs/${path}/${screenKey}`).default;
          break;
    case "hrms":
      config = require(`egov-hrms/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "uc":
      config = require(`egov-uc/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "fire-noc":
      config = require(`egov-noc/ui-config/screens/specs/${path}/${screenKey}`).default;
    case "abg":
      config = require(`egov-abg/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-common":
      config = require(`egov-common/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-boilerplate":
      config = require(`egov-boilerplate/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;
