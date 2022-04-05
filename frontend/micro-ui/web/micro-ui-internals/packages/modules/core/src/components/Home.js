import { BackButton } from "@egovernments/digit-ui-react-components";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Header, CitizenHomeCard, PTIcon,WSICon,FSMIcon,MCollectIcon,PGRIcon,TLIcon,OBPSIcon, Loader, BillsIcon,CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const processLinkData= (newData,code,t) => {
  const obj = newData?.[`${code}`]
  if(obj) {
    obj.map(link => {
      link.link = link['navigationURL'],
      link.i18nKey = t(link['name'])
    })
  }
  const newObj = {
    links:obj?.reverse(),
    header:`${code}_HEADER`,
    iconName:`CITIZEN_${code}_ICON`
  }
  if(code === "FSM"){
  const roleBasedLoginRoutes = [
    {
      role: "FSM_DSO",
      from: "/digit-ui/citizen/fsm/dso-dashboard",
      dashoardLink: "CS_LINK_DSO_DASHBOARD",
      loginLink: "CS_LINK_LOGIN_DSO",
    },
  ];

  roleBasedLoginRoutes.map(({ role, from, loginLink, dashoardLink }) => {
      if (Digit.UserService.hasAccess(role))
        newObj?.links?.push({
          link: from,
          i18nKey: t(dashoardLink),
        });
      else
        newObj?.links?.push({
          link: `/digit-ui/citizen/login`,
          state: { role: "FSM_DSO", from },
          i18nKey: t(loginLink),
        });
    });
  }
  return newObj
}
const iconSelector = code => {
  switch (code) {
    case "PT":
      return <PTIcon className="fill-path-primary-main" />
    case "WS":
      return <WSICon className="fill-path-primary-main" />
    case "FSM":
      return <FSMIcon className="fill-path-primary-main" />
    case "MCollect":
      return <MCollectIcon className="fill-path-primary-main" />
    case "PGR":
      return <PGRIcon className="fill-path-primary-main" />
    case "TL":
      return <TLIcon className="fill-path-primary-main" />
    case "OBPS":
      return <OBPSIcon className="fill-path-primary-main" />
    case "Bills":
      return <BillsIcon className="fill-path-primary-main" />
    default:
      return <PTIcon className="fill-path-primary-main" />
  }
}
const CitizenHome = ({ modules,getCitizenMenu,fetchedCitizen,isLoading }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const registry = useContext(ComponentProvider);
  const paymentModule = modules.filter(({ code }) => code === "Payment")[0];
  const moduleArr = modules.filter(({ code }) => code !== "Payment");
  const moduleArray = [paymentModule, ...moduleArr];
  const showQuickPay = moduleArr.some((module) => module.code === "QuickPayLinks");
  const {t} = useTranslation()

  return (
    <React.Fragment>
      <div className="citizenAllServiceGrid">
      <BackButton />
        {moduleArray
          .filter((mod) => mod)
          .map(({ code }, index) => {
            //-------------------------
           //  let Links = Digit.ComponentRegistryService.getComponent(`${code}Links`)
          //   if (code === "Payment" || !Links) {
          //     return <React.Fragment />
          //   }
          //   else{
          //   const mdmsDataObj = fetchedCitizen? processLinkData(getCitizenMenu?.actions,code,t):undefined;
          //   return <CitizenHomeCard header={t(mdmsDataObj?.header)} links={ mdmsDataObj?.links} Icon={()=>iconSelector(code)} />;
          //   }

          //---------------
            let mdmsDataObj
            if(fetchedCitizen)
              mdmsDataObj = fetchedCitizen? processLinkData(getCitizenMenu,code,t):undefined;
            if(mdmsDataObj?.links?.length > 0)
            return <CitizenHomeCard header={t(mdmsDataObj?.header)} links={ mdmsDataObj?.links} Icon={()=>iconSelector(code)} Info={code==="OBPS" ? () => <CitizenInfoLabel style={{margin: "0px", padding: "10px"}} info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`BPA_CITIZEN_HOME_STAKEHOLDER_INCLUDES_INFO_LABEL`)} />:null } isInfo={code==="OBPS"?true:false}/>;
            else return <React.Fragment /> 
          })}
      </div>
    </React.Fragment>
  );
};

const EmployeeHome = ({ modules }) => {
  return (
    <div className="employee-app-container">
      <div className="ground-container moduleCardWrapper gridModuleWrapper">
        {modules.map(({ code }, index) => {
          const Card = Digit.ComponentRegistryService.getComponent(`${code}Card`) || (() => <React.Fragment />);
          return <Card key={index} />;
        })}
      </div>
    </div>
  );
};

export const AppHome = ({ userType, modules,getCitizenMenu,fetchedCitizen,isLoading }) => {
  if (userType === "citizen") {
    return <CitizenHome modules={modules} getCitizenMenu={getCitizenMenu} fetchedCitizen={fetchedCitizen} isLoading={isLoading} />;
  }
  return <EmployeeHome modules={modules} />;
};
