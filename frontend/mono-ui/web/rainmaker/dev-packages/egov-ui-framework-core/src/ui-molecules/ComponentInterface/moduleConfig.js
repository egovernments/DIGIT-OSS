export const getModuleName = (pathName, BPAtradeType) => {
  if (pathName && pathName.includes("fire-noc")) {
    return "FIRENOC";
  } else if (pathName && pathName.includes("egov-bpa")) {
    let moduleServiceName = "BPA";
    let url = window.location.href;
    if (url && url.includes("type=LOW")) {
      moduleServiceName = "BPA_LOW"
    }
    return moduleServiceName;
  } else if (pathName && pathName.includes("oc-bpa")) {
    return "BPA_OC";
  } else if (
    (pathName && pathName.includes("tradelicence")) ||
    (pathName && pathName.includes("tradelicense"))
  ) {
    return "NewTL";
  } else if (BPAtradeType) {
    return BPAtradeType.split(".")[0];
  }
};
