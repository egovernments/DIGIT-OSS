import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
import ReactTooltip from "react-tooltip";
import { useTranslation } from 'react-i18next';

const resolveLinkPath = (childTo, parentTo) => `${parentTo}/${childTo}`;

const NavItemHeader = props => {
  const { item } = props;
  const [expanded, setExpand] = useState(
    /*location.pathname.includes(headerToPath)*/ false
  );
  let { label, icon, to: headerToPath, children } = item;
  const { t } = useTranslation();
  const location = useLocation();
  const getOrigin = window.location.origin
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
  const leftIconArray = icon?.split?.(":")?.[1];
  const leftIcon = IconsObject[leftIconArray] || IconsObject.collections;
  const iconArr=item?.icon?.leftIcon?.split?.(":")|| item?.leftIcon?.split?.(":");
  if(iconArr?.[0]=='dynamic'){
    var IconComp = require("@egovernments/digit-ui-react-components")?.[iconArr?.[1]];
    leftIcon=IconComp?<IconComp/>:leftIcon;
  }
  const getModuleName = label?.replace(/[ -]/g, "_").toUpperCase();
  const appendTranslate = t(`ACTION_TEST_${getModuleName.toUpperCase()}`);
  const trimModuleName = t(appendTranslate?.length > 20 ? appendTranslate.substring(0, 20) + "..." : appendTranslate);

  const onExpandChange = e => {
    e.preventDefault();
    setExpand(expanded => !expanded);
  };
	
  return (
    <React.Fragment>
      <button
        className={`${"submenu-container"}`}
        onClick={onExpandChange}
        style={item?.elementStyle ? {...item?.elementStyle,display:"flex"}:{display:"flex"}}
      >
         <div className={`sidebar-link ${expanded ? "active": ""}`} style={{width:item?.nested ?"240px":"260px",overflow:"auto"}}>{!item?.nested && leftIcon}
         <div className='actions' style={{padding:"0px",marginRight:"auto"}}>
         <div data-tip="React-tooltip" data-for={`jk-side-${getModuleName}`}>
        <span style={{color:expanded ? "#f47738":""}}>{trimModuleName}</span>
        {trimModuleName?.includes("...") && <ReactTooltip textColor="white" backgroundColor="grey" place="right" type="info" effect="solid" id={`jk-side-${getModuleName}`}>
                    {t(`ACTION_TEST_${getModuleName}`)}
                  </ReactTooltip>}
                </div>
        </div>
        <div>{children && expanded ? <ArrowVectorDown/> : children ? <ArrowForward /> : null}</div>
        </div>
      </button>

      {expanded && (
        <div /*className={style.navChildrenBlock}*/>
          {children.map((item, index) => {
            const key = `${item.label}-${index}`;

            const { label, icon, children } = item;
            const leftIconArray = icon?.split?.(":")?.[1];
            const leftIcon = IconsObject[leftIconArray] || IconsObject.collections;
            const getModuleName = label?.replace(/[ -]/g, "_").toUpperCase();
            const appendTranslate = t(`ACTION_TEST_${getModuleName.toUpperCase()}`);
            const trimModuleName = t(appendTranslate?.length > 20 ? appendTranslate.substring(0, 20) + "..." : appendTranslate);

            if (children) {
              return (
                <div key={key}>
                  <NavItemHeader
                    item={{
                      ...item,
                      nested: true,
                      to: resolveLinkPath(item?.to, props?.item?.to),
                      elementStyle:{marginLeft:"19px"}
                    }}
                  />
                </div>
              );
            }

            return (
              <NavLink
                key={key}
                to={item?.to?.includes("digit-ui") ? item?.to : "/employee/" + item?.to}
                className="custom-link"
                activeClassName="actions"
                style={{marginLeft:"40px", marginTop:"10px"}}
              >
                <div data-tip="React-tooltip" data-for={`jk-side-${getModuleName}`}>
                <span style={{fontSize:"14px"}}>{trimModuleName}</span>
                {trimModuleName?.includes("...") && <ReactTooltip textColor="white" backgroundColor="grey" place="right" type="info" effect="solid" id={`jk-side-${getModuleName}`}>
                    {t(`ACTION_TEST_${getModuleName}`)}
                  </ReactTooltip>}
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
};

export default NavItemHeader;