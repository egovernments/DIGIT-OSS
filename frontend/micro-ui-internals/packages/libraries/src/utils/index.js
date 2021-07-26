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

const getPattern = type => {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
    case "SearchOwnerName":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{3,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
    case "Amount":
      return /^[0-9]{0,8}$/i;
    case "NonZeroAmount":
      return /^[1-9][0-9]{0,7}$/i;
    case "DecimalNumber":
      return /^\d{0,8}(\.\d{1,2})?$/i;
    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Address":
      return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,500}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "TradeName":
      return /^[-@.\/#&+\w\s]*$/
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,5}$/i;
    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?~`!@$%^={}\[\]*:;“”‘’]{1,50}$/i;
    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;
    case "Pincode":
      return /^[1-9][0-9]{5}$/i;
    case "Landline":
      return /^[0-9]{11}$/i;
    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;
    case "ElectricityConnNo":
      return /^.{1,15}$/i;
    case "DocumentNo":
      return /^[0-9]{1,15}$/i;
    case "eventName":
      return /^[^\$\"<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”]{1,65}$/i;
    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "cancelChallan":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;
    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;
    case "AadharNo":
      return /^([0-9]){12}$/;
    case "ChequeNo":
      return /^(?!0{6})[0-9]{6}$/;
    case "Comments":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
    case "OldLicenceNo":
      return /^[a-zA-Z0-9-/]{0,64}$/;
  }
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

const tlAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const tlRoles = ["TL_CEMP", "TL_APPROVER", "TL_FIELD_INSPECTOR", "TL_DOC_VERIFIER"];

  const TL_ACCESS = userRoles.filter((role) => tlRoles.includes(role));

  return TL_ACCESS.length > 0;
};

const mCollectAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const mCollectRoles = ["UC_EMP"];

  const MCOLLECT_ACCESS = userRoles.filter((role) => mCollectRoles.includes(role));

  return MCOLLECT_ACCESS.length > 0;
};


const receiptsAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const receiptsRoles = ["CR_PT"];
  const RECEIPTS_ACCESS = userRoles.filter((role) => receiptsRoles.includes(role));
  return RECEIPTS_ACCESS.length > 0;
}
const hrmsRoles = ["HRMS_ADMIN"];
const hrmsAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const HRMS_ACCESS = userRoles.filter((role) => hrmsRoles.includes(role));
  return HRMS_ACCESS.length > 0;
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
  mCollectAccess,
  receiptsAccess,
  hrmsAccess,
  getPattern,
  hrmsRoles,
  tlAccess
};
