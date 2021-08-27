import ComponentRegistry from "../../utils/componentRegistry";
const componentRegistry = new ComponentRegistry();

export const ComponentRegistryService = {
  getComponent: (id) => {
    return componentRegistry.getComponent(id);
  },

  setComponent: (id, component = {}) => {
    return componentRegistry.setComponent(id, component);
  },

  setupRegistry: (components) => {
    // should be call only once at the starting
    return componentRegistry.setAllComponents(components);
  },

  getRegistry: () => componentRegistry,
};
