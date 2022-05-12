import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
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

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const { t } = useTranslation();
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
  const leftIcon = IconsObject[leftIconArray] || IconsObject.collections;
  const getModuleName = item?.moduleName?.replace(/[ -]/g, "_");

  if (item.type === "single") {
    const getOrigin = window.location.origin;
    return (
      <div className="submenu-container">
        <div className={`sidebar-link`}>
          <div className="actions">
            {leftIcon}
            {item.navigationURL?.indexOf("/digit-ui") === -1 ? (
              <a className="custom-link" href={getOrigin + "/employee/" + item.navigationURL}>
                {t(`ACTION_TEST_${getModuleName}`)}
              </a>
            ) : (
              <Link className="custom-link" to={item.navigationURL}>
                {t(`ACTION_TEST_${getModuleName}`)}
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
          <div onClick={item.links && showSubnav} className={`sidebar-link ${subnav === true ? "active" : ""}`}>
            <div className="actions">
              {leftIcon}
              <span>{t(`ACTION_TEST_${getModuleName}`)}</span>
            </div>
            <div> {item.links && subnav ? <ArrowVectorDown /> : item.links ? <ArrowForward /> : null} </div>
          </div>
        </div>

        {subnav &&
          item.links
            .filter((item) => item.url === "url" || item.url !== "")
            .map((item, index) => {
              const getChildName = item?.displayName?.toUpperCase()?.replace(/[ -]/g, "_");
              if (item.navigationURL.indexOf("/digit-ui") === -1) {
                const getOrigin = window.location.origin;
                return (
                  <a
                    key={index}
                    className={`dropdown-link ${pathname === item.link ? "active" : ""}`}
                    href={getOrigin + "/employee/" + item.navigationURL}
                  >
                    <div className="actions">
                      <ArrowDirection className="icon" />
                      <span>{t(`ACTION_TEST_${getChildName}`)}</span>
                    </div>
                  </a>
                );
              }
              return (
                <Link
                  to={item?.link || item.navigationURL}
                  key={index}
                  className={`dropdown-link ${pathname === item?.link || pathname === item?.navigationURL ? "active" : ""}`}
                >
                  <div className="actions">
                    <ArrowDirection className="icon" />
                    <span>{t(`ACTION_TEST_${getChildName}`)}</span>
                  </div>
                </Link>
              );
            })}
      </React.Fragment>
    );
  }
};

export default SubMenu;
