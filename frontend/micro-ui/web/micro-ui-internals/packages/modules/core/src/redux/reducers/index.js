export const commonReducer = (defaultData) => (state = defaultData, action) => {
  switch (action.type) {
    case "LANGUAGE_SELECT":
      return { ...state, selectedLanguage: action.payload };
    default:
      return state;
  }
};
