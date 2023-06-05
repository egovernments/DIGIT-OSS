import { useClearNotifications, useEvents, useNotificationCount } from "./events";
import useCreateEvent from "./events/useCreateEvent";
import useUpdateEvent from "./events/useUpdateEvent";
import {
  useBulkPdfDetails, useDemandSearch, useFetchBillsForBuissnessService, useFetchCitizenBillsForBuissnessService, useFetchPayment, useGetPaymentRulesForBusinessServices, usePaymentSearch, usePaymentUpdate, useRecieptSearch
} from "./payment";
import { useInitStore } from "./store";
import useAccessControl from "./useAccessControl";
import { useApplicationsForBusinessServiceSearch } from "./useApplicationForBillSearch";
import useClickOutside from "./useClickOutside";
import useCustomMDMS from "./useCustomMDMS";
import useDocumentSearch from "./useDocumentSearch";
import useDynamicData from "./useDynamicData";
import useLocation from "./useLocation";

import useInboxGeneral from "./useInboxGeneral/useInboxGeneral";
import useNewInboxGeneral from "./useInboxGeneral/useNewInbox";
import useBoundaryLocalities from "./useLocalities";
import useCommonMDMS from "./useMDMS";
import useWorkflowDetailsV2 from "./useWorkflowDetailsV2";
import useModuleTenants from "./useModuleTenants";
import useQueryParams from "./useQueryParams";
import useRouteSubscription from "./useRouteSubscription";
import { useUserSearch } from "./userSearch";
import useSessionStorage from "./useSessionStorage";
import useApplicationStatusGeneral from "./useStatusGeneral";
import useStore from "./useStore";
import { useTenants } from "./useTenants";
import useWorkflowDetails from "./workflow";
import useCustomAPIHook from "./useCustomAPIHook";
import useUpdateCustom from "./useUpdateCustom";

import useComplaintDetails from "./pgr/useComplaintDetails";
import { useComplaintsList, useComplaintsListByMobile } from "./pgr/useComplaintList";
import useComplaintStatus from "./pgr/useComplaintStatus";
import useComplaintStatusCount from "./pgr/useComplaintStatusWithCount";
import useComplaintSubType from "./pgr/useComplaintSubType";
import useComplaintTable from "./pgr/useComplaintTable";
import useComplaintTypes from "./pgr/useComplaintTypes";
import useEmployeeFilter from "./pgr/useEmployeeFilter";
import useInboxData from "./pgr/useInboxData";
import useLocalities from "./pgr/useLocalities";
import useServiceDefs from "./pgr/useServiceDefs";
import usePGRTenants from "./pgr/useTenants";
import useGenderMDMS from "./useGenderMDMS";

import useEmployeeSearch from "./useEmployeeSearch";

import useDashboardConfig from "./dss/useDashboardConfig";
import useDSSDashboard from "./dss/useDSSDashboard";
import useGetChart from "./dss/useGetChart";
import useDssMdms from "./dss/useMDMS";


import useHRMSCount from "./hrms/useHRMSCount";
import useHRMSCreate from "./hrms/useHRMScreate";
import useHRMSGenderMDMS from "./hrms/useHRMSGender";
import useHrmsMDMS from "./hrms/useHRMSMDMS";
import useHRMSSearch from "./hrms/useHRMSsearch";
import useHRMSUpdate from "./hrms/useHRMSUpdate";



import useDocCreate from "./engagement/useCreate";
import useDocDelete from "./engagement/useDelete";
import { useEngagementMDMS } from "./engagement/useMdms";
import useDocSearch from "./engagement/useSearch";
import useDocUpdate from "./engagement/useUpdate";
import useEventDetails from "./events/useEventDetails";
import useEventInbox from "./events/useEventInbox";

import useSurveyCreate from "./surveys/useCreate";
import useSurveyDelete from "./surveys/useDelete";
import useSurveySearch from "./surveys/useSearch";
import useSurveyShowResults from "./surveys/useShowResults";
import useSurveySubmitResponse from "./surveys/useSubmitResponse";
import useSurveyInbox from "./surveys/useSurveyInbox";
import useSurveyUpdate from "./surveys/useUpdate";



import useGetDSSAboutJSON from "./useGetDSSAboutJSON";
import useGetDSSFAQsJSON from "./useGetDSSFAQsJSON";
import useGetFAQsJSON from "./useGetFAQsJSON";
import useGetHowItWorksJSON from "./useHowItWorksJSON";
import { usePrivacyContext } from "./usePrivacyContext";
import useStaticData from "./useStaticData";



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
  useGenderMDMS,
  useRouteSubscription,
  useCustomAPIHook,
  useWorkflowDetailsV2,
  useUpdateCustom,
  useCustomMDMS,
  useGetHowItWorksJSON,
  useGetFAQsJSON,
  useGetDSSFAQsJSON,
  useGetDSSAboutJSON,
  useStaticData,
  useDynamicData,
  useBulkPdfDetails,
  useLocation
};

export default Hooks;
