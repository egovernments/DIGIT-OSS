import React from "react";

/* methid to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
    // Returning null in else case because new Date(null) returns initial date from calender
    if (dateEpoch) {
        const dateFromApi = new Date(dateEpoch);
        let month = dateFromApi.getMonth() + 1;
        let day = dateFromApi.getDate();
        let year = dateFromApi.getFullYear();
        month = (month > 9 ? "" : "0") + month;
        day = (day > 9 ? "" : "0") + day;
        return `${day}/${month}/${year}`;
    } else {
        return null;
    }
};

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

export const businessServiceList = (isCode= false) => {
    let isSearchScreen = window.location.href.includes("/search");
    const availableBusinessServices = [{
        code: isSearchScreen ? "FIRE_NOC" : "FIRE_NOC_SRV",
        active: true,
        roles: ["FIRE_NOC_APPROVER"],
        i18nKey: "WF_FIRE_NOC_FIRE_NOC_SRV",
    }, {
        code: isSearchScreen ? "AIRPORT_AUTHORITY" : "AIRPORT_NOC_SRV",
        active: true,
        roles: ["AIRPORT_AUTHORITY_APPROVER"],
        i18nKey: "WF_FIRE_NOC_AIRPORT_NOC_SRV"
    }];

    const newAvailableBusinessServices = [];
    const loggedInUserRoles = Digit.UserService.getUser().info.roles;
    availableBusinessServices.map(({ roles }, index) => {
        roles.map((role) => {
            loggedInUserRoles.map((el) => {
                if (el.code === role) {
                    isCode ? newAvailableBusinessServices.push(availableBusinessServices?.[index]?.code) : newAvailableBusinessServices.push(availableBusinessServices?.[index])
                }
            })
        })
    });

    return newAvailableBusinessServices;
}