
const isEmployee = window.location.pathname.includes("/employee");


const employeeenabledModules = [
  
    "Payment",
    "PT",
    "QuickPayLinks",
    "DSS",
    "MCollect",
    "HRMS",
    "TL",
    "Receipts",
  ];

  const citizenenabledModules = [
  
    "Payment",
    "PT",
    "QuickPayLinks",
    "DSS",
    // "MCollect",
    "HRMS",
    "TL",
    "Receipts",
  ];

var enabledModules= isEmployee? employeeenabledModules:citizenenabledModules;
export {
    enabledModules
}
