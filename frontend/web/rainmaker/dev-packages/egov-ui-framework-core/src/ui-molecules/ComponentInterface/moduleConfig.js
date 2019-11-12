export const getModuleName = pathName => {
  if (pathName && pathName.includes("fire-noc")) {
    return "FIRENOC";
  } else if (
    (pathName && pathName.includes("tradelicence")) ||
    (pathName && pathName.includes("tradelicense"))
  ) {
    return "NewTL";
  }
};
