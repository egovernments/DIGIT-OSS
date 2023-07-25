import { useQuery } from "react-query";
import AccessControlService from "../services/elements/Access";

const newRoutes = {
  "id": 1550,
  "name": "Farmer Survey",
  "url": "url",
  "displayName": "Farmer Survey",
  "orderNumber": 1,
  "queryParams": "",
  "parentModule": "rainmaker-pgr",
  "enabled": true,
  "serviceCode": "PGR",
  "tenantId": "pg",
  "createdDate": null,
  "createdBy": null,
  "lastModifiedDate": null,
  "lastModifiedBy": null,
  "path": "Farmer Survey",
  "navigationURL": "/works-ui/employee/farmer-surver/inbox",
  "leftIcon": "action:BirthIcon",
  "rightIcon": ""
};

const useAccessControl = (tenantId) => {
  const getUserRoles = Digit.SessionStorage.get("User")?.info?.roles;

  const roles = getUserRoles?.map((role) => {
    return role.code;
  });

  const response = useQuery(["ACCESS_CONTROL", tenantId], async () => await AccessControlService.getAccessControl(roles), { enabled: roles ? true : false });
  if (response?.data) {
    response.data.actions = [...response?.data?.actions, newRoutes];
  }
  console.log(response, "------------>")
  return response;
};
export default useAccessControl;
