export const getWFConfig = (module) => {
  switch (module) {
    case "tl-services":
      return {
        INITIATED: "/tradelicence/apply",
        DEFAULT: "/tradelicence/search-preview",
      };
    case "FIRENOC":
      return {
        INITIATED: "/fire-noc/apply",
        DEFAULT: "/fire-noc/search-preview",
      };
  }
};
