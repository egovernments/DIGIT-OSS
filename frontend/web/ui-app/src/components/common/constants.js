//please use this file for any constant level variable across all components
module.exports = {
  //User Roles
  ROLE_CITIZEN: 'CITIZEN',
  ROLE_EMPLOYEE: 'EMPLOYEE',
  //Labels
  LABEL_SERVICES: 'csv.lbl.services',
  LABEL_NO_SERVICS: 'csv.lbl.noservices',
  LABEL_CHECKLIST: 'Checklist',
  LABEL_DOCUMENTS: 'Documents',
  LABEL_LOADING: 'csv.lbl.loading',
  LABEL_SRN: 'pgr.lbl.srn',

  COMPLAINT_KEYWORD: 'complaint',
  CITIZEN_SERVICES_KEYWORD: 'Deliverable_service',
  CITIZEN_SERVICES_STATUS_NEW: 'DSNEW',
  CITIZEN_SERVICES_FILE_TAG: 'citizenservices',
  CITIZEN_SERVICES_CHECKLIST_CODE: 'CHECKLIST',
  CITIZEN_SERVICES_DOCUMENTS_CODE: 'DOCUMENTS',
  COMMON_FILE_FORMATS_ALLOWED: ['jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'csv', 'pdf', 'xlsx'],

  TRADE_LICENSE_FILE_FORMATS_ALLOWED: ['pdf', 'doc', 'docx', 'txt', 'png', 'gif', 'jpeg', 'xls', 'xlsx', 'rtf', 'jpg', 'odf', 'zip', 'dxf'],
  TRADE_LICENSE_FILE_TAG: 'TL',
  TRADE_LICENSE_NEW_ACCESS_ROLES: ['EMPLOYEE'],

  PTIS_FILE_TAG: 'PT',
};
