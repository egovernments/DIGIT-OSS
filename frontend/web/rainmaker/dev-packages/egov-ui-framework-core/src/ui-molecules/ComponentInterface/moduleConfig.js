export const getModuleName = (pathName, BPAtradeType) => {
  if (pathName && pathName.includes("fire-noc")) {
    return "FIRENOC";
  } else if (
    (pathName && pathName.includes("tradelicence")) ||
    (pathName && pathName.includes("tradelicense"))
  ) {
    return "NewTL";
  } else if (BPAtradeType) {
    return BPAtradeType.split(".")[0];
  }
};
