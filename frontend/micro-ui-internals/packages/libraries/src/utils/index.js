import PDFUtil from "./pdf";
import BrowserUtil from "./browser";
import * as locale from "./locale";
import * as date from "./date";
import * as dss from "./dss";

const GetParamFromUrl = (key, fallback, search) => {
  if (typeof window !== "undefined") {
    search = search || window.location.search;
    const params = new URLSearchParams(search);
    return params.has(key) ? params.get(key) : fallback;
  }
  return fallback;
};

const getStaticMapUrl = (latitude, longitude) => {
  const key = globalConfigs?.getConfig("GMAPS_API_KEY");
  return `https://maps.googleapis.com/maps/api/staticmap?markers=${latitude},${longitude}&zoom=15&size=400x400&key=${key}&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e`;
};

const detectDsoRoute = (pathname) => {
  const employeePages = ["search", "inbox", "dso-dashboard", "dso-application-details"];

  return employeePages.some((url) => pathname.split("/").includes(url));
};

const routeSubscription = (pathname) => {
  let classname = "citizen";
  const isEmployeeUrl = detectDsoRoute(pathname);
  if (isEmployeeUrl && classname === "citizen") {
    return (classname = "employee");
  } else if (!isEmployeeUrl && classname === "employee") {
    return (classname = "citizen");
  }
};

const pgrAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const pgrRoles = ["PGR_LME", "PGR-ADMIN", "CSR", "CEMP", "FEMP", "DGRO", "ULB Operator", "GRO", "GO", "RO", "GA"];

  const PGR_ACCESS = userRoles.filter((role) => pgrRoles.includes(role));

  return PGR_ACCESS.length > 0;
};

const fsmAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const fsmRoles = [
    "FSM_CREATOR_EMP",
    "FSM_EDITOR_EMP",
    "FSM_VIEW_EMP",
    "FSM_REPORT_VIEWER",
    "FSM_DASHBOARD_VIEWER",
    "FSM_ADMIN",
    "FSM_DSO",
    "FSM_DRIVER",
    "FSM_EMP_FSTPO",
    "FSM_COLLECTOR",
  ];

  const FSM_ACCESS = userRoles.filter((role) => fsmRoles.includes(role));

  return FSM_ACCESS.length > 0;
};

const ptAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const ptRoles = ["PT_APPROVER", "PT_CEMP", "PT_DOC_VERIFIER", "PT_FIELD_INSPECTOR"];

  const PT_ACCESS = userRoles.filter((role) => ptRoles.includes(role));

  return PT_ACCESS.length > 0;
};

export default {
  pdf: PDFUtil,
  browser: BrowserUtil,
  locale,
  date,
  GetParamFromUrl,
  getStaticMapUrl,
  detectDsoRoute,
  routeSubscription,
  pgrAccess,
  fsmAccess,
  dss,
  ptAccess,
};
