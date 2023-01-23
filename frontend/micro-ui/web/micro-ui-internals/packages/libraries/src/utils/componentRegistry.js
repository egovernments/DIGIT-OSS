class ComponentRegistry {
  constructor() {
    this._registry = {};
  }

  getComponent(id) {
    return this._registry[id];
  }

  setComponent(id, component) {
    this._registry[id] = component;
    return true;
  }

  setAllComponents(components) {
    Object.entries(components).forEach(([key, value]) => {
      this.setComponent(key, value);
    });
    return this._registry;
  }
}

export default ComponentRegistry;
