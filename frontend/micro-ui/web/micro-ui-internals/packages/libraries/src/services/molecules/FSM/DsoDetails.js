import { FSMService } from "../../elements/FSM";

const getVehicleDetails = (vehicles) => {
  return vehicles
    ? vehicles?.map((vehicle, index) => {
        return {
          name: index,
          values: [
            { title: "ES_FSM_REGISTRY_VEHICLE_NUMBER", value: vehicle?.registrationNumber },
            { title: "ES_FSM_REGISTRY_VEHICLE_TYPE", value: `COMMON_MASTER_VEHICLE_${vehicle?.type}` },
            { title: "ES_FSM_REGISTRY_VEHICLE_MODEL", value: vehicle?.model },
            { title: "ES_FSM_REGISTRY_VEHICLE_CAPACITY", value: vehicle?.tankCapacity },
            {
              title: "ES_FSM_REGISTRY_VEHICLE_POLLUTION_CERT",
              value: vehicle?.pollutionCertiValidTill && Digit.DateUtils.ConvertEpochToDate(vehicle?.pollutionCertiValidTill),
            },
            {
              title: "ES_FSM_REGISTRY_VEHICLE_ROAD_TAX",
              value: vehicle?.roadTaxPaidTill && Digit.DateUtils.ConvertEpochToDate(vehicle?.roadTaxPaidTill),
            },
            {
              title: "ES_FSM_REGISTRY_VEHICLE_INSURANCE",
              value: vehicle?.InsuranceCertValidTill && Digit.DateUtils.ConvertEpochToDate(vehicle?.InsuranceCertValidTill),
            },
            { title: "ES_FSM_REGISTRY_VEHICLE_STATUS", value: vehicle.status },
            { title: "ES_FSM_REGISTRY_VEHICLE_ADDITIONAL_DETAILS", value: vehicle?.additionalDetails?.description },
          ],
        };
      })
    : [];
};

const getDriverDetails = (drivers) => {
  return drivers
    ? drivers?.map((driver, index) => {
        return {
          name: index,
          id: driver?.id,
          values: [
            { title: "ES_FSM_REGISTRY_DRIVER_NAME", value: driver?.name },
            // { title: "ES_FSM_REGISTRY_DRIVER_PHONE", value: driver?.owner?.mobileNumber },
            { title: "ES_FSM_REGISTRY_DRIVER_LICENSE", value: driver?.licenseNumber },
            { title: "ES_FSM_REGISTRY_DRIVER_STATUS", value: driver?.status },
          ],
        };
      })
    : [];
};

const getResponse = (data) => {
  let details = [
    {
      title: "",
      values: [
        { title: "ES_FSM_REGISTRY_DETAILS_VENDOR_NAME", value: data?.name },
        { title: "ES_FSM_REGISTRY_DETAILS_VENDOR_ADDRESS", value: data?.address?.locality?.name },
        { title: "ES_FSM_REGISTRY_DETAILS_VENDOR_PHONE", value: data?.owner?.mobileNumber },
        { title: "ES_FSM_REGISTRY_DETAILS_ADDITIONAL_DETAILS", value: data?.additionalDetails?.description },
      ],
    },
    {
      title: "ES_FSM_REGISTRY_DETAILS_VEHICLE_DETAILS",
      type: "ES_FSM_REGISTRY_DETAILS_TYPE_VEHICLE",
      child: getVehicleDetails(data.vehicles),
    },
    {
      title: "ES_FSM_REGISTRY_DETAILS_DRIVER_DETAILS",
      type: "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER",
      child: getDriverDetails(data.drivers),
    },
  ];
  return details;
};

const DsoDetails = async (tenantId, filters = {}) => {
  const dsoDetails = await FSMService.vendorSearch(tenantId, filters);

  //TODO get possible dates to book dso

  const data = dsoDetails.vendor.map((dso) => ({
    displayName: dso.name + (dso.owner?.name ? ` - ${dso.owner?.name}` : ""),
    mobileNumber: dso.owner?.mobileNumber,
    name: dso.name,
    username: dso.owner?.userName,
    ownerId: dso.ownerId,
    id: dso.id,
    auditDetails: dso.auditDetails,
    drivers: dso.drivers,
    activeDrivers: dso.drivers?.filter((driver) => driver.status === "ACTIVE"),
    allVehicles: dso.vehicles,
    dsoDetails: dso,
    employeeResponse: getResponse(dso),
    vehicles: dso.vehicles
      ?.filter((vehicle) => vehicle.status === "ACTIVE")
      ?.map((vehicle) => ({
        id: vehicle.id,
        registrationNumber: vehicle?.registrationNumber,
        type: vehicle.type,
        i18nKey: `FSM_VEHICLE_TYPE_${vehicle.type}`,
        capacity: vehicle.tankCapacity,
        suctionType: vehicle.suctionType,
        model: vehicle.model,
      })),
  }));

  return data;
};

export default DsoDetails;
