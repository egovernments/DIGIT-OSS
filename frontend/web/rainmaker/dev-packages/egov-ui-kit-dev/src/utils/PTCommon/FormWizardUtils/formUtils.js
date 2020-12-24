import { getQueryArg } from "egov-ui-framework/ui-utils/commons";


export const PROPERTY_FORM_PURPOSE = {
  REASSESS: 'reassess',
  ASSESS: 'assess',
  CREATE: 'create',
  UPDATE: 'update',
  DEFAULT: 'create'
}

export const formWizardConstants = {
  [PROPERTY_FORM_PURPOSE.ASSESS]: {
    header: 'PT_ASSESS_PROPERTY',
    parentButton: 'PT_ASSESS',
    isSubHeader: true,
    isFinancialYear: true,
    buttonLabel: 'PT_ASSESS_PROPERTY_BUTTON',
    isEditButton: false,
    canEditOwner: false,
    isEstimateDetails: true
  },
  [PROPERTY_FORM_PURPOSE.REASSESS]: {
    header: 'PT_REASSESS_PROPERTY',
    parentButton: 'PT_REASSESS',
    isSubHeader: true,
    isFinancialYear: true,
    buttonLabel: 'PT_REASSESS_PROPERTY_BUTTON',
    isEditButton: false,
    canEditOwner: false,
    isEstimateDetails: true
  },
  [PROPERTY_FORM_PURPOSE.UPDATE]: {
    header: 'PT_UPDATE_PROPERTY',
    parentButton: 'EDIT_PROPERTY',
    isSubHeader: true,
    isFinancialYear: false,
    buttonLabel: 'PT_UPDATE_PROPERTY_BUTTON',
    isEditButton: true,
    canEditOwner: false,
    isEstimateDetails: false
  },
  [PROPERTY_FORM_PURPOSE.CREATE]: {
    header: 'PT_CREATE_PROPERTY',
    parentButton: 'PT_CREATE',
    isSubHeader: false,
    isFinancialYear: false,
    buttonLabel: 'PT_CREATE_PROPERTY_BUTTON',
    isEditButton: true,
    canEditOwner: true,
    isEstimateDetails: false
  }
}



export const getPurpose = () => {
  const purpose = getQueryArg(window.location.href, "purpose") || PROPERTY_FORM_PURPOSE.DEFAULT;
  return purpose;
}




