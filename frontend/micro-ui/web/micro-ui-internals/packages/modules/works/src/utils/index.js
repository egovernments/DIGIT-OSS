export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str && str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

export const ifUserRoleExists = (role) => {
  const userInfo = Digit.UserService.getUser();
  const roleCodes = userInfo?.info?.roles ? userInfo?.info?.roles.map((role) => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};
