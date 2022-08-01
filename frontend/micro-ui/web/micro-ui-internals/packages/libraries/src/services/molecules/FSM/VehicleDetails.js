import { FSMService } from "../../elements/FSM";

const getResponse = (data) => {
  let details = [
    {
      title: 'ES_FSM_REGISTRY_DETAILS_VEHICLE_DETAILS',
      values: [
        { title: "ES_FSM_REGISTRY_VEHICLE_NUMBER", value: data?.registrationNumber },
        { title: "ES_FSM_REGISTRY_VEHICLE_TYPE", value: data?.type },
        { title: "ES_FSM_REGISTRY_VEHICLE_MODEL", value: data?.model },
        { title: "ES_FSM_REGISTRY_VEHICLE_CAPACITY", value: data?.tankCapacity },
        { title: "ES_FSM_REGISTRY_VEHICLE_POLLUTION_CERT", value: data?.pollutionCertiValidTill && Digit.DateUtils.ConvertEpochToDate(data?.pollutionCertiValidTill) },
        { title: "ES_FSM_REGISTRY_VEHICLE_ROAD_TAX", value: data?.roadTaxPaidTill && Digit.DateUtils.ConvertEpochToDate(data?.roadTaxPaidTill) },
        { title: "ES_FSM_REGISTRY_VEHICLE_INSURANCE", value: data?.InsuranceCertValidTill && Digit.DateUtils.ConvertEpochToDate(data?.InsuranceCertValidTill) },
        { title: "ES_FSM_REGISTRY_VEHICLE_STATUS", value: data.status },
        { title: "ES_FSM_REGISTRY_VEHICLE_ADDITIONAL_DETAILS", value: data?.additionalDetails?.description }
      ],
    }
  ];
  return details
}

const VehicleDetails = async (tenantId, filters = {}) => {
  const vehicleDetails = await FSMService.vehiclesSearch(tenantId, filters);

  const data = vehicleDetails.vehicle.map((data) => ({
    vehicleData: data,

    employeeResponse: getResponse(data),

  }));

  return data;
};

export default VehicleDetails;
