import { FSMService } from "../../elements/FSM";

const getResponse = (data) => {
  let details = [
    {
      title: 'ES_FSM_REGISTRY_DETAILS_DRIVER_DETAILS',
      values: [
        { title: "ES_FSM_REGISTRY_DRIVER_NAME", value: data?.name },
        { title: "ES_FSM_REGISTRY_DRIVER_PHONE", value: data?.owner?.mobileNumber },
        { title: "ES_FSM_REGISTRY_DRIVER_LICENSE", value: data?.licenseNumber },
        { title: "ES_FSM_REGISTRY_DETAILS_VENDOR_NAME", value: data?.name || 'ES_FSM_REGISTRY_DETAILS_ADD_VENDOR', type: 'custom' }
      ],
    }
  ];
  return details
}

const DriverDetails = async (tenantId, filters = {}) => {
  const driverDetails = await FSMService.driverSearch(tenantId, filters);
  const data = driverDetails.driver.map((data) => ({
    driverData: data,
    employeeResponse: getResponse(data),

  }));

  return data;
};

export default DriverDetails;
