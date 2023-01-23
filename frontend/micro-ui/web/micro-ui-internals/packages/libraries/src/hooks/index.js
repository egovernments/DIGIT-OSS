import { useInitStore } from "./store";
import useWorkflowDetails from "./workflow";
import useSessionStorage from "./useSessionStorage";
import useQueryParams from "./useQueryParams";
import useDocumentSearch from "./useDocumentSearch";
import useClickOutside from "./useClickOutside";
import useAccessControl from "./useAccessControl";
import useRouteSubscription from "./useRouteSubscription";
import {
  useFetchPayment,
  usePaymentUpdate,
  useFetchCitizenBillsForBuissnessService,
  useFetchBillsForBuissnessService,
  useGetPaymentRulesForBusinessServices,
  useDemandSearch,
  useRecieptSearch,
  usePaymentSearch,
  useBulkPdfDetails,
} from "./payment";
import { useUserSearch } from "./userSearch";
import { useApplicationsForBusinessServiceSearch } from "./useApplicationForBillSearch";
import useBoundaryLocalities from "./useLocalities";
import useCommonMDMS from "./useMDMS";
import useCustomMDMS from "./useCustomMDMS";
import useInboxGeneral from "./useInboxGeneral/useInboxGeneral";
import useApplicationStatusGeneral from "./useStatusGeneral";
import useModuleTenants from "./useModuleTenants";
import useStore from "./useStore";
import { useTenants } from "./useTenants";
import { useEvents, useClearNotifications, useNotificationCount } from "./events";
import useCreateEvent from "./events/useCreateEvent";
import useUpdateEvent from "./events/useUpdateEvent";
import useNewInboxGeneral from "./useInboxGeneral/useNewInbox";
import useDynamicData from "./useDynamicData";

import useComplaintDetails from "./pgr/useComplaintDetails";
import { useComplaintsList, useComplaintsListByMobile } from "./pgr/useComplaintList";
import useComplaintStatus from "./pgr/useComplaintStatus";
import useComplaintTable from "./pgr/useComplaintTable";
import useComplaintTypes from "./pgr/useComplaintTypes";
import useEmployeeFilter from "./pgr/useEmployeeFilter";
import useInboxData from "./pgr/useInboxData";
import useLocalities from "./pgr/useLocalities";
import useServiceDefs from "./pgr/useServiceDefs";
import usePGRTenants from "./pgr/useTenants";
import useComplaintSubType from "./pgr/useComplaintSubType";
import useComplaintStatusCount from "./pgr/useComplaintStatusWithCount";


import useEmployeeSearch from "./useEmployeeSearch";

import useDssMdms from "./dss/useMDMS";
import useDashboardConfig from "./dss/useDashboardConfig";
import useDSSDashboard from "./dss/useDSSDashboard";
import useGetChart from "./dss/useGetChart";


import useHRMSSearch from "./hrms/useHRMSsearch";
import useHrmsMDMS from "./hrms/useHRMSMDMS";
import useHRMSCreate from "./hrms/useHRMScreate";
import useHRMSUpdate from "./hrms/useHRMSUpdate";
import useHRMSCount from "./hrms/useHRMSCount";
import useHRMSGenderMDMS from "./hrms/useHRMSGender";



import useEventInbox from "./events/useEventInbox";
import useEventDetails from "./events/useEventDetails";
import { useEngagementMDMS } from "./engagement/useMdms";
import useDocSearch from "./engagement/useSearch";
import useDocCreate from "./engagement/useCreate";
import useDocUpdate from "./engagement/useUpdate";
import useDocDelete from "./engagement/useDelete";

import useSurveyCreate from "./surveys/useCreate";
import useSurveyDelete from "./surveys/useDelete";
import useSurveyUpdate from "./surveys/useUpdate";
import useSurveySearch from "./surveys/useSearch";
import useSurveyShowResults from "./surveys/useShowResults";
import useSurveySubmitResponse from "./surveys/useSubmitResponse";
import useSurveyInbox from "./surveys/useSurveyInbox";



import useGetHowItWorksJSON from "./useHowItWorksJSON";
import useGetFAQsJSON from "./useGetFAQsJSON";
import useGetDSSFAQsJSON from "./useGetDSSFAQsJSON";
import useGetDSSAboutJSON from "./useGetDSSAboutJSON";
import useStaticData from "./useStaticData";
import useBillAmendmentInbox from "./billAmendment/useInbox";
import { usePrivacyContext } from "./usePrivacyContext";

import useSearchWORKS from "./works/useSearchWORKS";
import useSearchApprovedEstimates from "./works/useSearchApprovedEstimates";
import useViewEstimateDetails from "./works/useViewEstimateDetails";
import useViewProjectDetailsInEstimate from './works/useViewProjectDetailsInEstimate'
import useViewProjectClosureDetails from "./works/useViewProjectClosureDetails";
import useViewProjectClosureDetailsBills from "./works/useViewProjectClosureBills";
import useViewProjectClosureDetailsClosureChecklist from "./works/useViewProjectClosureDetailsClosureChecklist";
import useViewProjectClosureDetailsKickoffChecklist from "./works/useViewProjectClosureDetailsKickoffChecklist";
import useViewLOIDetails from "./works/useViewLOIDetails";
import useCreateLOI from "./works/useCreateLOI";
import useEstimateSearch from "./works/useSearch";
import useCreateEstimate from "./works/useCreateEstimate";
import useCreateEstimateNew from "./works/useCreateEstimateNew";
import useSearchEstimate from "./works/userSearchEstimate";
import useApplicationActionsLOI from "./works/useApplicationActions";
import useApplicationActionsEstimate from "./works/useUpdateEstimate";
import useUpdateEstimate from "./works/useUpdateEstimate";
import useWorksInbox from "./works/useInbox";
import useKickoffInbox from "./works/useKickoffInbox";
import useViewContractDetails from "./contracts/useViewContractDetails";
import useViewContractDetailsClosureScreen from "./contracts/useViewContractDetailsClosureScreen";
import useViewAttendance from "./attendance/useViewAttendance";
import useUpdateAttendance from "./attendance/useUpdateAttendance";
import useLocation from "./useLocation";
import useViewBills from "./bills/useViewBills";
import useViewOrg from "./bills/useViewOrg";
import useViewFinancialDetails from "./project/useViewFinancialDetails";

const works = {
  useViewEstimateDetails,
  useViewProjectDetailsInEstimate,
  useViewProjectClosureDetails,
  useViewProjectClosureDetailsBills,
  useViewProjectClosureDetailsKickoffChecklist,
  useViewProjectClosureDetailsClosureChecklist,
  useViewLOIDetails,
  useCreateLOI,
  useEstimateSearch,
  useSearchWORKS,
  useCreateEstimate,
  useCreateEstimateNew,
  useSearchEstimate,
  useApplicationActionsLOI,
  useUpdateEstimate,
  useApplicationActionsEstimate,
  useSearchApprovedEstimates,
  useInbox: useWorksInbox,
  useKickoffInbox
};

const contracts = {
  useViewContractDetails,
  useViewContractDetailsClosureScreen
};

const pgr = {
  useComplaintDetails,
  useComplaintsList,
  useComplaintsListByMobile,
  useComplaintStatus,
  useComplaintTable,
  useComplaintTypes,
  useEmployeeFilter,
  useInboxData,
  useLocalities,
  useServiceDefs,
  useTenants: usePGRTenants,
  useComplaintSubType,
  useComplaintStatusCount,
};


const dss = {
  useMDMS: useDssMdms,
  useDashboardConfig,
  useDSSDashboard,
  useGetChart,
};


const hrms = {
  useHRMSSearch,
  useHrmsMDMS,
  useHRMSCreate,
  useHRMSUpdate,
  useHRMSCount,
  useHRMSGenderMDMS,
};




const events = {
  useInbox: useEventInbox,
  useCreateEvent,
  useEventDetails,
  useUpdateEvent,
};

const engagement = {
  useMDMS: useEngagementMDMS,
  useDocCreate,
  useDocSearch,
  useDocDelete,
  useDocUpdate,
};

const survey = {
  useCreate: useSurveyCreate,
  useUpdate: useSurveyUpdate,
  useDelete: useSurveyDelete,
  useSearch: useSurveySearch,
  useSubmitResponse: useSurveySubmitResponse,
  useShowResults: useSurveyShowResults,
  useSurveyInbox,
};


const attendance = {
  useViewAttendance,
  useUpdateAttendance
};

const bills = {
  useViewBills
}
const masters = {
  useViewOrg
}

const project = {
  useViewFinancialDetails
}

const Hooks = {
  useSessionStorage,
  useQueryParams,
  useFetchPayment,
  usePaymentUpdate,
  useFetchCitizenBillsForBuissnessService,
  useFetchBillsForBuissnessService,
  useGetPaymentRulesForBusinessServices,
  useWorkflowDetails,
  useInitStore,
  useClickOutside,
  useUserSearch,
  useApplicationsForBusinessServiceSearch,
  useDemandSearch,
  useInboxGeneral,
  useEmployeeSearch,
  useBoundaryLocalities,
  useCommonMDMS,
  useApplicationStatusGeneral,
  useModuleTenants,
  useRecieptSearch,
  usePaymentSearch,
  useNewInboxGeneral,
  useEvents,
  useClearNotifications,
  useNotificationCount,
  useStore,
  useDocumentSearch,
  useTenants,
  useAccessControl,
  usePrivacyContext,
  pgr,
 
  dss,
  
  hrms,
 
  events,
  engagement,
  survey,
 
  works,
  useRouteSubscription,
  useCustomMDMS,
  useGetHowItWorksJSON,
  useGetFAQsJSON,
  useGetDSSFAQsJSON,
  useGetDSSAboutJSON,
  useStaticData,
  useDynamicData,
  useBulkPdfDetails,
  useBillAmendmentInbox,
  works,
  contracts,
  attendance,
  useLocation,
  bills,
  masters,
  project
};

export default Hooks;
