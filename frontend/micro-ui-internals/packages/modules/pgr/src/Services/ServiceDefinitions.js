import { CoreService } from "@egovernments/digit-ui-libraries";

class ServiceDefinitions extends CoreService {
  constructor() {
    super("PGR");
  }

  get = async (stateCode) => {
    const criteria = {
      type: "serviceDefs",
      details: {
        tenantId: stateCode,
        moduleDetails: [
          {
            moduleName: "RAINMAKER-PGR",
            masterDetails: [
              {
                name: "ServiceDefs",
              },
            ],
          },
        ],
      },
    };

    const serviceDefs = await this._MdmsService.getDataByCriteria(criteria);
    return serviceDefs;
  };

  getMenu = async (stateCode, t) => {
    var Menu = [];
    const response = await this.get(stateCode);
    await Promise.all(
      response.map((def) => {
        if (!Menu.find((e) => e.key === def.menuPath)) {
          def.menuPath === ""
            ? Menu.push({
                name: t("SERVICEDEFS.OTHERS"),
                key: def.menuPath,
              })
            : Menu.push({
                name: t("SERVICEDEFS." + def.menuPath.toUpperCase()),
                key: def.menuPath,
              });
        }
      })
    );
    return Menu;
  };

  getSubMenu = async (stateCode, selectedType, t) => {
    const response = await this.get(stateCode);
    return response
      .filter((def) => def.menuPath === selectedType.key)
      .map((id) => ({
        key: id.serviceCode,
        name: t("SERVICEDEFS." + id.serviceCode.toUpperCase()),
      }));
  };
}

const ServiceDefinitionsObject = new ServiceDefinitions();

export const getServiceDefinitions = () => ServiceDefinitionsObject;
