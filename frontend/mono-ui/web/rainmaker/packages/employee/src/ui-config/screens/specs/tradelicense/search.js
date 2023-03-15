let baseUrl = "https://egov-micro-dev.egovernments.org";
let contextPath = "/employee-tradelicence/egov-ui-framework/tradelicence/search";
let src = `${baseUrl}${contextPath}`;
//let src = `http://localhost:3000/egov-ui-framework/tradelicence/search`;
if (process.env.NODE_ENV !== "development") {
  src = `${window.location.origin}${contextPath}`;
}

const tradeLicenseSearchAndResult = {
  uiFramework: "custom-containers-local",
  name: "search",
  components: {
    iframe: {
      componentPath: "Iframe",
      props: {
        src,
      },
    },
  },
};

export default tradeLicenseSearchAndResult;
