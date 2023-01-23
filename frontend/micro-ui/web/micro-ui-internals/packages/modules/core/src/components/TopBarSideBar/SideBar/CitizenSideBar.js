import {
  Loader, NavBar
} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import SideBarMenu from "../../../config/sidebar-menu";
import ChangeCity from "../../ChangeCity";
import { defaultImage } from "../../utils";
import StaticCitizenSideBar from "./StaticCitizenSideBar";


const Profile = ({ info, stateName, t }) => {
  const [profilePic, setProfilePic] = React.useState(null);
  React.useEffect(async () => {
    const tenant = Digit.ULBService.getCurrentTenantId();
    const uuid = info?.uuid;
    if (uuid) {
      const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});

      if (usersResponse && usersResponse.user && usersResponse.user.length) {
        const userDetails = usersResponse.user[0];
        const thumbs = userDetails?.photo?.split(",");
        setProfilePic(thumbs?.at(0));
      }
    }
  }, [profilePic !== null]);
  return (
    <div className="profile-section">
      <div className="imageloader imageloader-loaded">
        <img
          className="img-responsive img-circle img-Profile"
          src={profilePic ? profilePic : defaultImage}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div id="profile-name" className="label-container name-Profile">
        <div className="label-text"> {info?.name} </div>
      </div>
      <div id="profile-location" className="label-container loc-Profile">
        <div className="label-text"> {info?.mobileNumber} </div>
      </div>
      {info?.emailId && (
        <div id="profile-emailid" className="label-container loc-Profile">
          <div className="label-text"> {info.emailId} </div>
        </div>
      )}
      <div className="profile-divider"></div>
      {window.location.href.includes("/employee") &&
        !window.location.href.includes("/employee/user/login") &&
        !window.location.href.includes("employee/user/language-selection") && <ChangeCity t={t} mobileView={true} />}
    </div>
  );
};
const PoweredBy = () => (
  <div className="digit-footer" style={{ marginBottom: 0 }}>
    <img
      alt="Powered by DIGIT"
      src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER")}
      style={{ cursor: "pointer" }}
      onClick={() => {
        window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
      }}
    />{" "}
  </div>
);

/* 
Feature :: Citizen Webview sidebar
*/
export const CitizenSideBar = ({ isOpen, isMobile = false, toggleSidebar, onLogout, isEmployee = false, linkData, islinkDataLoading }) => {
  const { data: storeData, isFetched } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const user = Digit.UserService.getUser();
  const [search, setSearch] = useState("");

  const { t } = useTranslation();
  const history = useHistory();
  const closeSidebar = () => {
    Digit.clikOusideFired = true;
    toggleSidebar(false);
  };

  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const showProfilePage = () => {
    const redirectUrl = isEmployee ? `/${window?.contextPath}/employee/user/profile` : `/${window?.contextPath}/citizen/user/profile`;
    history.push(redirectUrl);
    closeSidebar();
  };
  const redirectToLoginPage = () => {
    // localStorage.clear();
    // sessionStorage.clear();
    history.push(`/${window?.contextPath}/citizen/login`);
    closeSidebar();
  };
  if (islinkDataLoading || isLoading) {
    return <Loader />;
  }

  let menuItems = [...SideBarMenu(t, closeSidebar, redirectToLoginPage, isEmployee)];
  let profileItem;
  if (isFetched && user && user.access_token) {
    profileItem = <Profile info={user?.info} stateName={stateInfo?.name} t={t} />;
    menuItems = menuItems.filter((item) => item?.id !== "login-btn");
    menuItems = [
      ...menuItems,
      {
        text: t("EDIT_PROFILE"),
        element: "PROFILE",
        icon: "EditPencilIcon",
        populators: {
          onClick: showProfilePage,
        },
      },
      {
        text: t("CORE_COMMON_LOGOUT"),
        element: "LOGOUT",
        icon: "LogoutIcon",
        populators: {
          onClick: onLogout,
        },
      },
      {
        text: (
          <React.Fragment>
            {t("CS_COMMON_HELPLINE")}
            <div className="telephone" style={{ marginTop: "-10%" }}>
              {storeData?.tenants.map((i) => {
                i.code === tenantId ? (
                  <div className="link">
                    <a href={`tel:${storeData?.tenants[i].contactNumber}`}>{storeData?.tenants[i].contactNumber}</a>
                  </div>
                ) : (
                  <div className="link">
                    <a href={`tel:${storeData?.tenants[0].contactNumber}`}>{storeData?.tenants[0].contactNumber}</a>
                  </div>
                );
              })}
              <div className="link">
                <a href={`tel:${storeData?.tenants[0].contactNumber}`}>{storeData?.tenants[0].contactNumber}</a>
              </div>
            </div>
          </React.Fragment>
        ),
        element: "Helpline",
        icon: "Phone",
      },
    ];
  }

  let configEmployeeSideBar = {};

  if (!isEmployee) {
    Object.keys(linkData)
      ?.sort((x, y) => y.localeCompare(x))
      ?.map((key) => {
        if (linkData[key][0]?.sidebar === "digit-ui-links")
          menuItems.splice(1, 0, {
            type: linkData[key][0]?.sidebarURL?.includes(window?.contextPath) ? "link" : "external-link",
            text: t(`ACTION_TEST_${Digit.Utils.locale.getTransformedLocale(key)}`),
            links: linkData[key],
            icon: linkData[key][0]?.leftIcon,
            link: linkData[key][0]?.sidebarURL,
          });
      });
  } else {
    data?.actions
      .filter((e) => e.url === "url" && e.displayName !== "Home")
      .forEach((item) => {
        if (search == "" && item.path !== "") {
          let index = item.path.split(".")[0];
          if (index === "TradeLicense") index = "Trade License";
          if (!configEmployeeSideBar[index]) {
            configEmployeeSideBar[index] = [item];
          } else {
            configEmployeeSideBar[index].push(item);
          }
        } else if (item.path !== "" && item?.displayName?.toLowerCase().includes(search.toLowerCase())) {
          let index = item.path.split(".")[0];
          if (index === "TradeLicense") index = "Trade License";
          if (!configEmployeeSideBar[index]) {
            configEmployeeSideBar[index] = [item];
          } else {
            configEmployeeSideBar[index].push(item);
          }
        }
      });
    const keys = Object.keys(configEmployeeSideBar);
    for (let i = 0; i < keys.length; i++) {
      const getSingleDisplayName = configEmployeeSideBar[keys[i]][0]?.displayName?.toUpperCase()?.replace(/[ -]/g, "_");
      const getParentDisplayName = keys[i]?.toUpperCase()?.replace(/[ -]/g, "_");

      if (configEmployeeSideBar[keys[i]][0].path.indexOf(".") === -1) {
        menuItems.splice(1, 0, {
          type: "link",
          text: t(`ACTION_TEST_${getSingleDisplayName}`),
          link: configEmployeeSideBar[keys[i]][0]?.navigationURL,
          icon: configEmployeeSideBar[keys[i]][0]?.leftIcon?.split?.(":")[1],
          populators: {
            onClick: () => {
              history.push(configEmployeeSideBar[keys[i]][0]?.navigationURL);
              closeSidebar();
            },
          },
        });
      } else {
        menuItems.splice(1, 0, {
          type: "dynamic",
          moduleName: t(`ACTION_TEST_${getParentDisplayName}`),
          links: configEmployeeSideBar[keys[i]]?.map((ob) => {return {...ob, displayName: t(`ACTION_TEST_${ob?.displayName?.toUpperCase()?.replace(/[ -]/g, "_")}`)}}),
          icon: configEmployeeSideBar[keys[i]][1]?.leftIcon,
        });
      }
    }
     const indx = menuItems.findIndex(a => a.element === "HOME");
     const home = menuItems.splice(indx,1);
     const comp = menuItems.findIndex(a => a.element === "LANGUAGE");
     const part = menuItems.splice(comp,menuItems?.length-comp);
     menuItems.sort((a,b) => {
      let c1 = a?.type === "dynamic" ? a?.moduleName : a?.text;
      let c2 = b?.type === "dynamic" ? b?.moduleName : b?.text;
      return c1.localeCompare(c2)
     } );
     home?.[0] && menuItems.splice(0,0,home[0]);
     menuItems =  part?.length > 0 ? menuItems.concat(part) : menuItems;
  }

  /*  URL with openlink wont have sidebar and actions    */
  if (history.location.pathname.includes("/openlink")) {
    profileItem = <span></span>;
    menuItems = menuItems.filter((ele) => ele.element === "LANGUAGE");
  }
  return isMobile ? (
    <NavBar
      open={isOpen}
      toggleSidebar={toggleSidebar}
      profileItem={profileItem}
      onClose={closeSidebar}
      menuItems={menuItems}
      Footer={<PoweredBy />}
      isEmployee={isEmployee}
      search={search}
      setSearch={setSearch}
    />
  ) : (
    <StaticCitizenSideBar logout={onLogout} />
  );
};
