import { MdmsService } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

const useMDMS = (tenantId, moduleCode, type, config = {}, payload = []) => {
  const queryConfig = { staleTime: Infinity, ...config };

  const useSanitationType = () => {
    return useQuery("FSM_SANITATION_TYPE", () => MdmsService.getSanitationType(tenantId, moduleCode), queryConfig);
  };

  const usePitType = () => {
    return useQuery("FSM_PIT_TYPE", () => MdmsService.getPitType(tenantId, moduleCode, queryConfig));
  };

  const useApplicationChannel = () => {
    return useQuery("FSM_APPLICATION_NEW_APPLICATION_CHANNEL", () => MdmsService.getApplicationChannel(tenantId, moduleCode, type), queryConfig);
  };

  const useEmployeeApplicationChannel = () => {
    async function onlyEmployeeChannels() {
      const allApplicationChannels = await MdmsService.getApplicationChannel(tenantId, moduleCode, type);
      return allApplicationChannels.filter((type) => !type.citizenOnly);
    }
    return useQuery("FSM_APPLICATION_EDIT_APPLICATION_CHANNEL", () => onlyEmployeeChannels(), queryConfig);
  };

  const usePropertyType = () => {
    return useQuery("FSM_PROPERTY_TYPE", () => MdmsService.getPropertyType(tenantId, moduleCode, type), queryConfig);
  };

  const usePropertySubType = () => {
    return useQuery("FSM_PROPERTY_SUBTYPE", () => MdmsService.getPropertyType(tenantId, moduleCode, type), queryConfig);
  };

  const useChecklist = () => {
    return useQuery("FSM_CHECKLIST", () => MdmsService.getChecklist(tenantId, moduleCode), queryConfig);
  };

  const useVehicleType = () => {
    return useQuery("FSM_VEHICLE_TYPE", () => MdmsService.getVehicleType(tenantId, moduleCode, type), queryConfig);
  };

  const useSlumLocality = () => {
    return useQuery(
      ["SLUM_LOCALITY_MAPPING", tenantId, moduleCode],
      () => MdmsService.getSlumLocalityMapping(tenantId, moduleCode, type),
      queryConfig
    );
  };

  const useReason = () => {
    return useQuery("CANCELLATION_REASON", () => MdmsService.getReason(tenantId, moduleCode, type, payload), queryConfig);
  };

  const useRoleStatusMapping = () => {
    return useQuery("ROLE_STATUS_MAPPING", () => MdmsService.getRoleStatus(tenantId, moduleCode, type));
  };
  const useCommonFieldsConfig = () => {
    return useQuery("COMMON_FIELDS", () => MdmsService.getCommonFieldsConfig(tenantId, moduleCode, type, payload));
  };

  const usePreFieldsConfig = () => {
    return useQuery("PRE_FIELDS", () => MdmsService.getPreFieldsConfig(tenantId, moduleCode, type, payload));
  };

  const usePostFieldsConfig = () => {
    return useQuery("POST_FIELDS", () => MdmsService.getPostFieldsConfig(tenantId, moduleCode, type, payload));
  };

  const useGenderDetails = () => {
    return useQuery("FSM_GENDER_DETAILS", () => MdmsService.getFSMGenderType(tenantId, moduleCode, type), config);
  };

  const useFSTPORejectionReason = () => {
    return useQuery("FSM_FSTPO_REJECTION", () => MdmsService.getFSTPORejectionReason(tenantId, moduleCode, type), queryConfig);
  };

  const usePaymentType = () => {
    return useQuery("FSM_PAYMENT_TYPE", () => MdmsService.getFSMPaymentType(tenantId, moduleCode, type), queryConfig);
  };

  const useTripNumber = () => {
    return useQuery("FSM_TRIP_NUMBER", () => MdmsService.getFSMTripNumber(tenantId, moduleCode, type), queryConfig);
  };

  const useReceivedPaymentType = () => {
    return useQuery("FSM_RECEIVED_PAYMENT_TYPE", () => MdmsService.getFSMReceivedPaymentType(tenantId, moduleCode, type), queryConfig);
  };

  const useWSTaxHeadMaster = () => {
    return useQuery("FSM_RECEIVED_PAYMENT_TYPE", () => MdmsService.getWSTaxHeadMaster(tenantId, moduleCode, type), queryConfig);
  };


  switch (type) {
    case "SanitationType":
      return useSanitationType();

    case "ApplicationChannel":
      return useApplicationChannel();

    case "EmployeeApplicationChannel":
      return useEmployeeApplicationChannel();

    case "PropertyType":
      return usePropertyType();

    case "PropertySubtype":
      return usePropertySubType();

    case "PitType":
      return usePitType();

    case "VehicleType":
      return useVehicleType();

    case "VehicleMakeModel":
      return useVehicleType();

    case "Checklist":
      return useChecklist();

    case "Slum":
      return useSlumLocality();

    case "Reason":
      return useReason();

    case "RoleStatusMapping":
      return useRoleStatusMapping();

    case "CommonFieldsConfig":
      return useCommonFieldsConfig();
    case "PreFieldsConfig":
      return usePreFieldsConfig();
    case "PostFieldsConfig":
      return usePostFieldsConfig();
    case "FSMGenderType":
      return useGenderDetails();
    case "FSTPORejectionReason":
      return useFSTPORejectionReason();
    case "PaymentType":
      return usePaymentType();
    case "TripNumber":
      return useTripNumber();
    case "ReceivedPaymentType":
      return useReceivedPaymentType();
    case "WSTaxHeadMaster":
      return useWSTaxHeadMaster()
    default:
      return null;
  }
};

export default useMDMS;
