import React from "react";
import { Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";

export const CommonMenuItems = [
  {
    primaryText: <Label label="CS_HOME_HEADER_PROFILE" />,
    route: "/user/profile",
    leftIcon: <Icon action="social" name="person" className="iconClassHover material-icons whiteColor customMenuItem" />,
    style: {
      paddingBottom: "3px",
      paddingTop: "3px",
    },
    id: "header-profile",
    path: "userprofile",
    renderforcsr: 1,
    renderforadmin: 1,
    renderforPGREmp: 1,
  },
  {
    primaryText: <Label label="CORE_COMMON_LOGOUT" />,
    route: "/logout",
    leftIcon: <Icon action="action" name="power-settings-new" className="iconClassHover material-icons whiteColor customMenuItem" />,
    style: {
      borderBottom: "none",
      borderLeft: "red",
    },
    id: "header-logout",
    path: "logout",
    renderforcsr: 1,
    renderforadmin: 1,
    renderforPGREmp: 1,
  },
];
