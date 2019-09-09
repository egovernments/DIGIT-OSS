export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.error_description : null,
      };
    case 'LOGIN_PAGE_UNLOADED':
    case 'REGISTER_PAGE_UNLOADED':
      return {};
    case 'ASYNC_START':
      // if (action.subtype === 'LOGIN' || action.subtype === 'REGISTER') {
      return { ...state, inProgress: true };
      // }
      break;
    case 'ASYNC_END':
      // if (action.subtype === 'LOGIN' || action.subtype === 'REGISTER') {
      return { ...state, inProgress: false };
      // }
      break;
    case 'UPDATE_FIELD_AUTH':
      return { ...state, [action.key]: action.value };
    case 'UPDATE_ERROR':
      return {
        ...state,
        errors: action.error,
      };
    default:
      return state;
  }

  return state;
};
