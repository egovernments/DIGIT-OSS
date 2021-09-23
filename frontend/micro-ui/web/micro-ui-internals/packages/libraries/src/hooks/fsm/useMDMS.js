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
  }
};

export default useMDMS;
