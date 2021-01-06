const hasAccess = (accessTo) => {
  const { roles } = Digit.UserService.getUser().info;
  return roles.filter((role) => accessTo.includes(role.code)).length;
};
export default { hasAccess: hasAccess };
