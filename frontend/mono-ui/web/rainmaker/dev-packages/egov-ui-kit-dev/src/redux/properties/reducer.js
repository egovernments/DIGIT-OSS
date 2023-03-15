import * as actionTypes from "./actionTypes";
import { transformById, getTotalAmountDue } from "egov-ui-kit/utils/commons";

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
        errorMessage: '',
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
    case actionTypes.PROPERTY_FETCH_BILL_PENDING:
        return {
          ...state,
          loading: true,
          error: false,
          errorMessage: "",
        };
    case actionTypes.PROPERTY_FETCH_BILL_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
        totalBillAmountDue: 0
      };
    case actionTypes.PROPERTY_FETCH_BILL_COMPLETE:
      const totalBillAmountDue = getTotalAmountDue(action.payload);
      const Bill=action.payload.Bill;
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        totalBillAmountDue,
        Bill
      };
    case actionTypes.PROPERTY_FETCH_RECEIPT_PENDING:
        return {
          ...state,
          loading: true,
          error: false,
          errorMessage: "",
        };
    case actionTypes.PROPERTY_FETCH_RECEIPT_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
        Payments: []
      };
    case actionTypes.PROPERTY_FETCH_RECEIPT_COMPLETE:
    
      const Payments=action.payload.Payments;
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        Payments
      };
      case actionTypes.PROPERTY_FETCH_ASSESSMENTS_PENDING:
        return {
          ...state,
          loading: true,
          error: false,
          errorMessage: "",
        };
    case actionTypes.PROPERTY_FETCH_ASSESSMENTS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
        Assessments: []
      };
    case actionTypes.PROPERTY_FETCH_ASSESSMENTS_COMPLETE:
    
      const Assessments=action.payload.Assessments;
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        Assessments
      };
      case actionTypes.PROPERTY_DOWNLOAD_RECEIPT_PENDING:
        return {
          ...state,
          loading: true,
          error: false,
          errorMessage: "",
        };
    case actionTypes.PROPERTY_DOWNLOAD_RECEIPT_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
        Payments: []
      };
    case actionTypes.PROPERTY_DOWNLOAD_RECEIPT_COMPLETE:
    
      const receipt=action.payload;
      return {
        ...state,
        loading: false,
        error: false,
        errorMessage: "",
        receipt
      };
    case actionTypes.RESET_PROPERTY_STATE:
      return initialState;
    default:
      return state;
  }
};

export default propertyReducer;
