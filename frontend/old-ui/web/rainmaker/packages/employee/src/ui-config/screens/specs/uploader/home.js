let baseUrl = "https://egov-micro-dev.egovernments.org";
let contextPath = "/app/v2/uploader/file-uploader";
let src = `${baseUrl}${contextPath}`;
if (process.env.NODE_ENV !== "development") {
  src = `${window.location.origin}${contextPath}`;
}

const uploaderIframe = {
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

export default uploaderIframe;
