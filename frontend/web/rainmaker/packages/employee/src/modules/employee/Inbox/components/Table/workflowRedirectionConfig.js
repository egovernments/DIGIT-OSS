export const getWFConfig = module => {
  switch (module.toUpperCase()) {
    case "CS_COMMON_INBOX_NEWTL":
      return {
        INITIATED: "/tradelicence/apply",
        DEFAULT: "/tradelicence/search-preview"
      };
    case "FIRENOC":
      return {
        INITIATED: "/fire-noc/apply",
        DEFAULT: "/fire-noc/search-preview"
      };
  }
};
