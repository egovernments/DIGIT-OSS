class Registry {
  constructor(registry = {}) {
    this._registry = registry;
  }

  getComponent(id) {
    return this._registry[id];
  }
}

export default Registry;
