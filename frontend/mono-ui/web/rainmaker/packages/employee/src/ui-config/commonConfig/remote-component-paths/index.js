const remoteComponentPath = (moduleName, path) => {
  let component = null;
  switch (moduleName) {
    case "egov-tradelicence":
      if (path === "ui-atoms-local") {
        component = import("egov-tradelicence/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-tradelicence/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-tradelicence/ui-containers-local");
      }
      break;
    case "egov-pt":
      if (path === "ui-atoms-local") {
        component = import("egov-pt/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-pt/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-pt/ui-containers-local");
      }
      break;
    case "egov-common":
      if (path === "ui-atoms-local") {
        component = import("egov-common/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-common/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-common/ui-containers-local");
      }
      break;
    case "egov-hrms":
      if (path === "ui-atoms-local") {
        component = import("egov-hrms/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-hrms/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-hrms/ui-containers-local");
      }
      break;
    case "egov-workflow":
      if (path === "ui-atoms-local") {
        component = import("egov-workflow/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-workflow/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-workflow/ui-containers-local");
      }
      break;
    case "egov-firenoc":
      if (path === "ui-atoms-local") {
        component = import("egov-firenoc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-firenoc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-firenoc/ui-containers-local");
      }
      break;
    case "egov-uc":
      if (path === "ui-atoms-local") {
        component = import("egov-uc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-uc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-uc/ui-containers-local");
      }
      break;
    case "egov-abg":
      if (path === "ui-atoms-local") {
        component = import("egov-abg/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-abg/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-abg/ui-containers-local");
      }
      break;
      case "egov-billamend":
        if (path === "ui-atoms-local") {
          component = import("egov-billamend/ui-atoms-local");
        } else if (path === "ui-molecules-local") {
          component = import("egov-billamend/ui-molecules-local");
        } else if (path === "ui-containers-local") {
          component = import("egov-billamend/ui-containers-local");
        }
        break;
    case "egov-bpa":
      if (path === "ui-atoms-local") {
        component = import("egov-bpa/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-bpa/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-bpa/ui-containers-local");
      }
      break;
    case "egov-wns":
      if (path === "ui-atoms-local") {
        component = import("egov-wns/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-wns/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-wns/ui-containers-local");
      }
      break;
    case "egov-noc":
      if (path === "ui-atoms-local") {
        component = import("egov-noc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-noc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-noc/ui-containers-local");
      }
      break;
    case "egov-bnd":
      if (path === "ui-atoms-local") {
        component = import("egov-bnd/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-bnd/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-bnd/ui-containers-local");
      }
      break;
    default:
      if (path === "ui-atoms-local") {
        component = import("ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("ui-containers-local");
      }
      break;
  }
  return component;
};

export default remoteComponentPath;
