export const getWFConfig = (module) => {
  console.log("module", module);
  switch (module.toUpperCase()) {
    case "CS_COMMON_INBOX_NEWTL":
      return {
        INITIATED: "/tradelicence/apply",
        DEFAULT: "/tradelicence/search-preview",
      };
    case "FIRENOC":
      return {
        INITIATED: "/fire-noc/apply",
        DEFAULT: "/fire-noc/search-preview",
      };
      case "BPA-SERVICES":
        return {
          INITIATED: "/egov-bpa/search-preview",
          DEFAULT: "/egov-bpa/search-preview",
        };  
    case "BPAREG":
      return {
        DEFAULT: "/bpastakeholder/search-preview",
      };
  }
};
