import { useQuery } from "react-query";

const useApplicationStatusGeneral = ({ businessServices = [], tenantId }, config) => {
  tenantId = tenantId || Digit.ULBService.getCurrentTenantId();

  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);

  const fetch = async () =>
    await Digit.WorkflowService.init(tenantId, businessServices.join()).then((res) => {
      const { BusinessServices: data } = res;
      return data;
    });

  const select = (data) => {
    let states = [];
    const filteredData = data.filter((e) => businessServices.includes(e.businessService));
    filteredData.forEach((service) => {
      states = [...states, ...service.states.map((e) => ({ ...e, stateBusinessService: service.businessService }))];
    });

    const addRoleToState = (state) => {
      const roles = state.actions?.map((act) => act.roles).flat();
      return { ...state, roles };
    };

    const roleStateMapArray = states?.map(addRoleToState).filter((e) => !!e.state);

    const userRoleStates = roleStateMapArray.filter(({ roles }) => roles?.some((role) => userRoles.includes(role)));
    const otherRoleStates = roleStateMapArray
      .filter(({ roles }) => !roles?.some((role) => userRoles.includes(role)))
      .map((e) => ({ ...e, nonActionableRole: true }));

    return { userRoleStates, otherRoleStates };
  };

  const queryData = useQuery(["workflow_states", tenantId, ...businessServices], () => fetch(), { select, ...config });

  return queryData;
};

export default useApplicationStatusGeneral;
