import * as actionTypes from "./actionTypes";
import { transformById } from "egov-ui-kit/utils/commons";

const initialState = {
  loading: false,
  propertiesById: {},
  draftsById: {},
  assessmentsByStatus: {},
  error: false,
  errorMessage: "",
};

const propertyReducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case actionTypes.PROPERTY_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.PROPERTY_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.RECEIPT_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.RECEIPT_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DRAFT_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.DRAFT_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.FAILED_TRANSACTION_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.SUCCESS_TRANSACTION_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.SUCCESS_TRANSACTION_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.FAILED_TRANSACTION_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.PROPERTY_FETCH_COMPLETE:
      const propertiesById = transformById(action.payload["Properties"], "propertyId");
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        propertiesById,
      };
    case actionTypes.DRAFT_FETCH_COMPLETE:
      const draftsById = transformById(action.payload["drafts"], "id");
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        draftsById,
      };
    case actionTypes.MOHALLA_FETCH_COMPLETE:
      const mohallaById = transformById(action.payload, "code");
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        mohallaById,
      };
    case actionTypes.FAILED_TRANSACTION_FETCH_COMPLETE:
      const failedPayments = transformById(action.payload["Transaction"], "txnId");
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        failedPayments,
      };
    case actionTypes.SUCCESS_TRANSACTION_FETCH_COMPLETE:
      const successPayments = transformById(action.payload["Transaction"], "txnId");
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        successPayments,
      };
    case actionTypes.RECEIPT_FETCH_COMPLETE:
      const receipts = action.payload["Receipt"];
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        receipts,
      };
    case actionTypes.ASSESSMENT_STATUS_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.ASSESSMENT_STATUS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.ASSESSMENT_STATUS_COMPLETE:
      const assessmentsByStatus = action.payload[0];
      const receiptsByYear=action.payload[1];
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        assessmentsByStatus,
        receiptsByYear
      };
    case actionTypes.SINGLE_ASSESSMENT_STATUS_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.SINGLE_ASSESSMENT_STATUS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.SINGLE_ASSESSMENT_STATUS_COMPLETE:
      const singleAssessmentByStatus =action.payload[0];
      const receiptsByYr=action.payload[1];
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        singleAssessmentByStatus,
        receiptsByYr
      };
    case actionTypes.RESET_PROPERTY_STATE:
      return initialState;
    default:
      return state;
  }
};

export default propertyReducer;
