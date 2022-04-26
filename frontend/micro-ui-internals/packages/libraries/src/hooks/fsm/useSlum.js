const useSlum = (tenantId, slumCode, localityCode, config = {}) => {
  const { data: slumData } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "Slum", config);

  if (!slumData || !slumCode || !localityCode) return;

  if (slumData[localityCode]) {
    return slumData[localityCode].find((slum) => slum?.code === slumCode);
  } else {
    const slumDataArray = Object.values(slumData);
    for (let i = 0; i < slumDataArray.length; i++) {
      const slumFound = slumDataArray[i].find((slum) => slum.code === slumCode);
      if (slumFound) {
        return slumFound;
      }
    }
  }
};

export default useSlum;
