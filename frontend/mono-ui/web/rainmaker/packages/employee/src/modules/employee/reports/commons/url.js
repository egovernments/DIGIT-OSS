// export const options = {
//   "rainmaker-pgr-nonframework": [
//     {

//       reportResultUrl: "/report/rainmaker-pgr/reportname/_get",
//       metaDataUrl: "/report/rainmaker-pgr/reportname/metadata/_get",
//       customReportName: "SourceWiseReport",
//       needDefaultSearch: true,
//     },
//   ]
// };

export const getResultUrl = (moduleName,reportName) => {
  let reportResultUrl = `/report/${moduleName}/${reportName}/_get`;
  return reportResultUrl;
}

export const getMetaDataUrl = (moduleName,reportName) => {
  let metaDataUrl = `/report/${moduleName}/${reportName}/metadata/_get`;
  return metaDataUrl;
};

export const getReportName = (moduleName, reportName) => {
  let finalName = reportName;
  return finalName;
};


// export const getResultUrl = (moduleName) => {
//   let reportResultUrl = options[moduleName] ? options[moduleName][0].reportResultUrl : "/report/" + moduleName + "/_get";
//   return reportResultUrl;
// };

// export const getMetaDataUrl = (moduleName,reportName) => {
//   let metaDataUrl = options[moduleName] ? options[moduleName][0].metaDataUrl : `/report/${moduleName}/${reportName}/metadata/_get`;
//   return metaDataUrl;
// };

// export const getReportName = (moduleName, reportName) => {
//   let finalName = options[moduleName] && options[moduleName][0].customReportName ? options[moduleName][0].customReportName : reportName;
//   return finalName;
// };
