import { useInitStore } from "./store";
import useWorkflowDetails from "./workflow";
import useSessionStorage from "./useSessionStorage";
import useQueryParams from "./useQueryParams";
import useClickOutside from "./useClickOutside";
import {
  useFetchPayment,
  usePaymentUpdate,
  useFetchCitizenBillsForBuissnessService,
  useFetchBillsForBuissnessService,
  useGetPaymentRulesForBusinessServices,
  useDemandSearch,
  useRecieptSearch,
} from "./payment";
import { useUserSearch } from "./userSearch";
import { useApplicationsForBusinessServiceSearch } from "./useApplicationForBillSearch";
import useBoundaryLocalities from "./useLocalities";
import useCommonMDMS from "./useMDMS";
import useInboxGeneral from "./useInboxGeneral/useInboxGeneral";
import useApplicationStatusGeneral from "./useStatusGeneral";
import useModuleTenants from "./useModuleTenants";
import useStore from "./useStore";
import { useTenants } from "./useTenants"
import useInbox from "./useInbox"
import useNewInboxGeneral from "./useInboxGeneral/useNewInbox";

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

import useTenantsFSM from "./fsm/useTenants";
import useDesludging from "./fsm/useDesludging";
import useApplicationStatus from "./fsm/useApplicationStatus";
import useMDMS from "./fsm/useMDMS";
import useSearch from "./fsm/useSearch";
import useSearchAll from "./fsm/useSearchAll";
import useVehicleSearch from "./fsm/useVehicleSearch";
import useVehicleUpdate from "./fsm/useVehicleUpdate";
import useFSMInbox from "./fsm/useInbox";
import useApplicationUpdate from "./fsm/useApplicationUpdate";
import useWorkflowData from "./fsm/useWorkflowData";
import useRouteSubscription from "./fsm/useRouteSubscription";
import useDsoSearch from "./fsm/useDsoSearch";
import usePropertySearch from "./pt/usePropertySearch";
import usePropertyPayment from "./pt/usePropertyPayment";
import useApplicationDetail from "./fsm/useApplicationDetail";
import useApplicationActions from "./fsm/useApplicationActions";
import useApplicationAudit from "./fsm/useApplicationAudit";
import useSearchForAuditData from "./fsm/useSearchForAudit";
import useVehiclesSearch from "./fsm/useVehiclesSearch";
import useConfig from "./fsm/useConfig";
import useVendorDetail from "./fsm/useVendorDetail";
import useSlum from "./fsm/useSlum";
import usePaymentHistory from "./fsm/usePaymentHistory";

import useEmployeeSearch from "./useEmployeeSearch";

import usePropertyMDMS from "./pt/usePropertyMDMS";
import usePropertyAPI from "./pt/usePropertyAPI";
import usePropertyDocumentSearch from "./pt/usePropertyDocumentSearch";
import useTenantsPT from "./pt/useTenants";
import usePtApplicationDetail from "./pt/useApplicationDetail";
import usePtApplicationActions from "./pt/useApplicationActions";
import usePtMDMS from "./pt/useMDMS";
import usePropertyAssessment from "./pt/usePropertyAssessment";
import usePtCalculationEstimate from "./pt/usePtCalculationEstimate";
import useGenderMDMS from "./pt/useGenderMDMS";
import usePTGenderMDMS from "./pt/usePTGenderMDMS";

import useDssMdms from "./dss/useMDMS";
import useDashboardConfig from "./dss/useDashboardConfig";
import useDSSDashboard from "./dss/useDSSDashboard";
import useGetChart from "./dss/useGetChart";

import useMCollectMDMS from "./mcollect/useMCollectMDMS";
import useMCollectSearch from "./mcollect/useMCollectSearch";
import useMcollectSearchBill from "./mcollect/useMcollectSearchBill";
import usemcollectTenants from "./mcollect/useTenants";
import useMCollectCount from "./mcollect/useMCollectCount";

import useTenantsTL from "./tl/useTenants";
import useTradeLicenseMDMS from "./tl/useTradeLicenseMDMS";
import useTLDocumentSearch from "./tl/useTLDocumentSearch";
import useTradeLicenseAPI from "./tl/useTradeLicenseAPI";
import useTradeLicenseSearch from "./tl/useTradeLicenseSearch";
import { useTLSearchApplication, useTLApplicationDetails } from "./tl/useTLsearchApplication";
import useTLPaymentHistory from "./tl/userPaymentHistory";
import useTLApplicationDetail from "./tl/useApplicationDetail";
import useTLApplicationActions from "./tl/useApplicationActions";
import useTLFetchBill from "./tl/useFetchBill";

import useTLGenderMDMS from "./tl/useTLGenderMDMS";
import useTLInbox from "./tl/useInbox";
import useTradeLicenseBillingslab from "./tl/useTradeLicenseBillingslab";
import useTLMDMS from "./tl/useMDMS";
import useTLSearch from "./tl/useSearch";

import useHRMSSearch from "./hrms/useHRMSsearch";
import useHrmsMDMS from "./hrms/useHRMSMDMS";
import useHRMSCreate from "./hrms/useHRMScreate";
import useHRMSUpdate from "./hrms/useHRMSUpdate";
import useHRMSCount from "./hrms/useHRMSCount";
import useHRMSGenderMDMS from "./hrms/useHRMSGender";


import useReceiptsSearch from "./receipts/useReceiptsSearch";
import useReceiptsMDMS from "./receipts/useReceiptsMDMS";
import useReceiptsUpdate from "./receipts/useReceiptsUpdate";

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
  usePropertyMDMS,
  useComplaintStatusCount,
  useTradeLicenseBillingslab
};

const fsm = {
  useTenants: useTenantsFSM,
  useDesludging: useDesludging,
  useMDMS: useMDMS,
  useSearch,
  useRouteSubscription,
  useSearchAll,
  useInbox: useFSMInbox,
  useApplicationUpdate,
  useApplicationStatus,
  useWorkflowData,
  useDsoSearch,
  useApplicationDetail,
  useApplicationActions,
  useApplicationAudit,
  useSearchForAuditData,
  useVehicleSearch,
  useVehicleUpdate,
  useVendorDetail,
  useVehiclesSearch,
  useConfig,
  useSlum,
  usePaymentHistory,
};

const pt = {
  usePropertySearch,
  usePropertyPayment,
  usePropertyMDMS,
  usePropertyAPI,
  usePropertyDocumentSearch,
  useTenants: useTenantsPT,
  useApplicationDetail: usePtApplicationDetail,
  useApplicationActions: usePtApplicationActions,
  useMDMS: usePtMDMS,
  usePropertyAssessment,
  usePtCalculationEstimate,
  useGenderMDMS,
  usePTGenderMDMS,
};

const dss = {
  useMDMS: useDssMdms,
  useDashboardConfig,
  useDSSDashboard,
  useGetChart,
};

const mcollect = {
  useMCollectMDMS,
  useMCollectSearch,
  useMcollectSearchBill,
  usemcollectTenants,
  useMCollectCount
};

const hrms = {
  useHRMSSearch,
  useHrmsMDMS,
  useHRMSCreate,
  useHRMSUpdate,
  useHRMSCount,
  useHRMSGenderMDMS
};
const tl = {
  useTenants: useTenantsTL,
  useTradeLicenseMDMS,
  useTLDocumentSearch,
  useTradeLicenseAPI,
  useTLSearchApplication,
  useTLPaymentHistory,
  useTradeLicenseSearch,
  useTLGenderMDMS,
  useTradeLicenseBillingslab,
  useInbox:useTLInbox,
  useMDMS: useTLMDMS,
  useSearch: useTLSearch,
  useApplicationDetail: useTLApplicationDetail,
  useApplicationActions: useTLApplicationActions,
  useFetchBill: useTLFetchBill,
  useTLApplicationDetails
};

const receipts = {
  useReceiptsMDMS,
  useReceiptsSearch,
  useReceiptsUpdate,
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
  useNewInboxGeneral,
  useStore,
  useTenants,
  useInbox: useTLInbox,
  pgr,
  fsm,
  pt,
  dss,
  mcollect,
  hrms,
  tl,
  receipts
};

export default Hooks;
