export class SubformRegistry {
  constructor(registry = {}) {
    this._registry = registry;
  }

  getSubform = (key) => this._registry[key];

  addSubForm = (key, config) => (this._registry[key] = config);

  changeConfig = async (key, callBack) => {
    let config = this.getSubform(key);
    let newConfig = await callBack(config);
    this._registry[key] = newConfig;
  };

  addMiddleware = (
    subFormKey,
    middlewareKey,
    middlewareFn,
    { functionName, preceedingName = "", preceedingIndex = null, exceedingName = "", exceedingIndex = null }
  ) => {
    let config = this.getSubform(subFormKey);
    let { middlewares } = config;
    const setPreceedingIndex = (preceedingIndex) => {
      let firstChunk = middlewares.splice(0, preceedingIndex + 1);
      middlewares = [...firstChunk, { [functionName]: middlewareFn }, ...middlewares];
    };

    const setExceedingIndex = (exceedingIndex) => {
      let firstChunk = middlewares.splice(0, exceedingIndex);
      middlewares = [...firstChunk, { [functionName]: middlewareFn }, ...middlewares];
    };

    if (preceedingIndex) setPreceedingIndex(preceedingIndex);
    else if (exceedingIndex) setExceedingIndex(exceedingIndex);
    else if (preceedingName) {
      let element = middlewares.filter((e) => Object.keys(e)[0] === preceedingName)[0] || null;
    } else if (exceedingName) {
    }
  };
}

export const subFormRegistry = new SubformRegistry({});
