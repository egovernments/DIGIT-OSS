import { useQuery } from "react-query";

/**
 *
 * @param {tenantId} optional
 * @param {businessServive} neccessory
 */

const useApplicationStatusGeneral = ({ businessServices = [], tenantId }, config) => {
  tenantId = tenantId || Digit.ULBService.getCurrentTenantId();

  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);

  const fetch = async () =>
    await Digit.WorkflowService.init(tenantId).then((res) => {
      const { BusinessServices: data } = res;
      return data;
    });

  const select = (data) => {
    let states = [];
    const filteredData = data.filter((e) => businessServices.includes(e.businessService));
    filteredData.forEach((service) => {
      states = [...states, ...service.states];
    });

    // console.log(JSON.stringify(data.filter((service) => service.business === "PT").map((e) => e.businessService)));

    const addRoleToState = (state) => {
      const roles = state.actions?.map((act) => act.roles).flat();
      return { ...state, roles };
    };

    const roleStateMapArray = states?.map(addRoleToState);

    const userRoleStates = roleStateMapArray.filter(({ roles }) => roles?.some((role) => userRoles.includes(role)));
    const otherRoleStates = roleStateMapArray.filter(({ roles }) => !roles?.some((role) => userRoles.includes(role)));

    return { userRoleStates, otherRoleStates };
  };

  const queryData = useQuery(["workflow_states", tenantId], () => fetch(), { select, ...config });

  return queryData;
};

export default useApplicationStatusGeneral;
