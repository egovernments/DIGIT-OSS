export const options = {
  "rainmaker-pgr-nonframework": [
    {
      reportResultUrl: "/rainmaker-pgr/v1/reports/_get",
      metaDataUrl: "/report/rainmaker-pgr/metadata/_get",
      customReportName: "SourceWiseReport",
      needDefaultSearch: true,
    },
  ]
};

export const getResultUrl = (moduleName) => {
  let reportResultUrl = options[moduleName] ? options[moduleName][0].reportResultUrl : "/report/" + moduleName + "/_get";
  return reportResultUrl;
};

export const getMetaDataUrl = (moduleName) => {
  let metaDataUrl = options[moduleName] ? options[moduleName][0].metaDataUrl : `/report/${moduleName}/metadata/_get`;
  return metaDataUrl;
};

export const getReportName = (moduleName, reportName) => {
  let finalName = options[moduleName] && options[moduleName][0].customReportName ? options[moduleName][0].customReportName : reportName;
  return finalName;
};
