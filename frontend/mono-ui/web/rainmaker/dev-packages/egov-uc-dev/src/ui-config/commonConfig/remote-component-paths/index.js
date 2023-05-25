const remoteComponentPath = (moduleName, path) => {
  let component = null;
  switch (moduleName) {
    case "egov-uc":
      if (path === "ui-atoms-local") {
        component = import("../../../ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("../../../ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("../../../ui-containers-local");
      }
      break;
    default:
      break;
  }
  return component;
};

export default remoteComponentPath;
