import { DOCUMENT_TYPES_MDMS_SUCCESS } from "./actionTypes"

export const fetchMDMDDocumentTypeSuccess = data => ({
  type: DOCUMENT_TYPES_MDMS_SUCCESS,
  data,
})
