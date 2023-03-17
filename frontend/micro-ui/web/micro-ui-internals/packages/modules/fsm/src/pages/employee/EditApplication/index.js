import React from "react";
import { useParams } from "react-router-dom";
import EditForm from "./EditForm";

const EditApplication = ({ parentUrl, heading }) => {
  // const __initPropertyType__ = window.Digit.SessionStorage.get("propertyType");
  // const __initSubType__ = window.Digit.SessionStorage.get("subType");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();

  let { id: applicationNumber } = useParams();
  const userInfo = Digit.UserService.getUser();

  const { isLoading: applicationLoading, isError, data: applicationData, error } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: applicationNumber, uuid: userInfo.uuid },
    { staleTime: Infinity }
  );

  const { isLoading: isVehicleMenuLoading, data: vehicleMenu } = Digit.Hooks.fsm.useMDMS(state, "Vehicle", "VehicleType", { staleTime: Infinity });
  const { isLoading: isChannelMenuLoading, data: channelMenu } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "ApplicationChannel");
  const { data: sanitationMenu, isLoading: sanitationTypeloading } = Digit.Hooks.fsm.useMDMS(state, "FSM", "PitType");
  return applicationData &&
    !applicationLoading &&
    vehicleMenu &&
    !isVehicleMenuLoading &&
    channelMenu &&
    !isChannelMenuLoading &&
    !sanitationTypeloading &&
    sanitationMenu ? (
    <EditForm
      applicationData={applicationData}
      vehicleMenu={vehicleMenu}
      channelMenu={channelMenu}
      sanitationMenu={sanitationMenu}
      tenantId={tenantId}
    />
  ) : null;
};
export default EditApplication;
