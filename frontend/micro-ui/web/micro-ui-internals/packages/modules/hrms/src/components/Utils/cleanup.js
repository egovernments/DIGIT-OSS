const cleanup = (payload) => {
  if (payload) {
    return Object.keys(payload).reduce((acc, key) => {
      if (payload[key] === undefined) {
        return acc;
      }

      // todo: find a better way to check object
      acc[key] = typeof payload[key] === "object" ? cleanup(payload[key]) : payload[key];
      return acc;
    }, {});
  }
};
export default cleanup;
