import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useConfig = (tenantId) => {
  return useQuery("FSM_CUSTOMIZATION_CONFIG", async () =>
    (await MdmsService.getCustomizationConfig(tenantId, "FSM"))["FSM"].Config.filter((item) => item.active === true).reduce(
      (finalObject, itemConfig) =>
        Object.assign(finalObject, {
          [itemConfig.code]: {
            override: itemConfig.override,
            default: itemConfig.default,
            state: itemConfig.WFState,
          },
        }),
      {}
    )
  );
};

export default useConfig;
