import React, { useState, useContext } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import {
  ArrowForward,
  ArrowVectorDown,
  ArrowDirection,
  HomeIcon,
  ComplaintIcon,
  BPAHomeIcon,
  PropertyHouse,
  CaseIcon,
  ReceiptIcon,
  PersonIcon,
  DocumentIconSolid,
  DropIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const { t } = useTranslation();
  const history = useHistory();

  const showSubnav = () => setSubnav(!subnav);
  const IconsObject = {
    home: <HomeIcon />,
    announcement: <ComplaintIcon />,
    business: <BPAHomeIcon />,
    store: <PropertyHouse />,
    assignment: <CaseIcon />,
    receipt: <ReceiptIcon />,
    "business-center": <PersonIcon />,
    description: <DocumentIconSolid />,
    "water-tap": <DropIcon />,
    "collections-bookmark": <CollectionsBookmarIcons />,
    "insert-chart": <FinanceChartIcon />,
    edcr: <CollectionIcon />,
    collections: <CollectionIcon />,
  };
  const leftIconArray = item?.icon?.leftIcon?.split?.(":")?.[1] || item?.leftIcon?.split?.(":")[1];
  let leftIcon = IconsObject[leftIconArray] || IconsObject.collections;
  const iconArr = item?.icon?.leftIcon?.split?.(":") || item?.leftIcon?.split?.(":");
  if (iconArr?.[0] == "dynamic") {
    var IconComp = require("@egovernments/digit-ui-react-components")?.[iconArr?.[1]];
    leftIcon = IconComp ? <IconComp /> : leftIcon;
  }
  const getModuleName = item?.moduleName?.replace(/[ -]/g, "_");
  const appendTranslate = t(`ACTION_TEST_${getModuleName}`);
  const trimModuleName = t(appendTranslate?.length > 20 ? appendTranslate.substring(0, 20) + "..." : appendTranslate);

  if (item.type === "single") {
    const getOrigin = window.location.origin;
    return (
      <div className="submenu-container">
        <div className={`sidebar-link  ${pathname === item?.navigationURL ? "active" : ""}`}>
          <div className="actions">
            <span style={{marginLeft:"0px"}} onClick={()=> history.push(`${ item.navigationURL}`)}>{leftIcon}</span>
            {item.navigationURL?.indexOf(`/${window?.contextPath}`) === -1 ? (
              <a
                data-tip="React-tooltip"
                data-for={`jk-side-${getModuleName}`}
                className="custom-link"
                href={getOrigin + "/employee/" + item.navigationURL}
              >
                <span> {trimModuleName} </span>

                {trimModuleName?.includes("...") && (
                  <ReactTooltip textColor="white" backgroundColor="grey" place="right" type="info" effect="solid" id={`jk-side-${getModuleName}`}>
                    {t(`ACTION_TEST_${getModuleName}`)}
                  </ReactTooltip>
                )}
              </a>
            ) : (
              // <a className="custom-link" href={getOrigin + "/employee/" + item.navigationURL}>
              //   <div className="tooltip">
              //     <p className="p1">{trimModuleName}</p>
              //     <span className="tooltiptext">{t(`ACTION_TEST_${getModuleName}`)}</span>
              //   </div>
              // </a>
              <Link className="custom-link" to={item.navigationURL}>
                <div data-tip="React-tooltip" data-for={`jk-side-${getModuleName}`}>
                  <span> {trimModuleName} </span>

                  {trimModuleName?.includes("...") && (
                    <ReactTooltip textColor="white" backgroundColor="grey" place="right" type="info" effect="solid" id={`jk-side-${getModuleName}`}>
                      {t(`ACTION_TEST_${getModuleName}`)}
                    </ReactTooltip>
                  )}
                </div>
                {/* <div className="tooltip">
                  <p className="p1">{trimModuleName}</p>
                  <span className="tooltiptext">{t(`ACTION_TEST_${getModuleName}`)}</span>
                </div>{" "} */}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <div className="submenu-container">
          <div
            onClick={item.links && showSubnav}
            className={`sidebar-link  ${item?.links?.some((ele) => ele?.url === "url" && pathname?.includes(ele?.navigationURL)) ? "active" : ""}`}
          >
            <div className="actions">
              {leftIcon}
              <div data-tip="React-tooltip" data-for={`jk-side-${getModuleName}`}>
                <span> {trimModuleName} </span>
                {trimModuleName?.includes("...") && (
                  <ReactTooltip textColor="white" backgroundColor="grey" place="right" type="info" effect="solid" id={`jk-side-${getModuleName}`}>
                    {t(`ACTION_TEST_${getModuleName}`)}
                  </ReactTooltip>
                )}
              </div>
              {/* <div className="tooltip">
                <p className="p1">{trimModuleName}</p>
                <span className="tooltiptext">{t(`ACTION_TEST_${getModuleName}`)}</span>
              </div>{" "} */}
            </div>
            <div> {item.links && subnav ? <ArrowVectorDown /> : item.links ? <ArrowForward /> : null} </div>
          </div>
        </div>

        {subnav &&
          item.links
            .sort((a, b) => a.orderNumber - b.orderNumber)
            .filter((item) => item.url === "url" || item.url !== "")
            .map((item, index) => {
              const getChildName = item?.displayName?.toUpperCase()?.replace(/[ -]/g, "_");
              const appendTranslate = t(`ACTION_TEST_${getChildName}`);
              const trimModuleName = t(appendTranslate?.length > 20 ? appendTranslate.substring(0, 20) + "..." : appendTranslate);

              if (item.navigationURL.indexOf(`/${window?.contextPath}`) === -1) {
                const getOrigin = window.location.origin;
                return (
                  <a
                    key={index}
                    className={`dropdown-link ${pathname === item.link ? "active" : ""}`}
                    href={getOrigin + "/employee/" + item.navigationURL}
                  >
                    <div className="actions" data-tip="React-tooltip" data-for={`jk-side-${index}`}>
                      <span> {trimModuleName} </span>
                      {trimModuleName?.includes("...") && (
                        <ReactTooltip textColor="white" backgroundColor="grey" place="right" type="info" effect="solid" id={`jk-side-${index}`}>
                          {t(`ACTION_TEST_${getChildName}`)}
                        </ReactTooltip>
                      )}
                    </div>
                    {/* <div className="actions">
                      <div className="tooltip">
                        <p className="p1">{trimModuleName}</p>
                        <span className="tooltiptext">{t(`ACTION_TEST_${getChildName}`)}</span>
                      </div>{" "}
                    </div> */}
                  </a>
                );
              }
              return (
                <Link
                  to={item?.link || item.navigationURL}
                  key={index}
                  className={`dropdown-link ${pathname === item?.link || pathname === item?.navigationURL ? "active" : ""}`}
                >
                  <div className="actions" data-tip="React-tooltip" data-for={`jk-side-${index}`}>
                    <span> {trimModuleName} </span>
                    {trimModuleName?.includes("...") && (
                      <ReactTooltip textColor="white" backgroundColor="grey" place="right" type="info" effect="solid" id={`jk-side-${index}`}>
                        {t(`ACTION_TEST_${getChildName}`)}
                      </ReactTooltip>
                    )}
                    {/* <div className="tooltip">
                      <p className="p1">{trimModuleName}</p>
                      <span className="tooltiptext">{t(`ACTION_TEST_${getChildName}`)}</span>
                    </div>{" "} */}
                  </div>
                </Link>
              );
            })}
      </React.Fragment>
    );
  }
};

export default SubMenu;
