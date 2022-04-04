import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Header, CitizenHomeCard, PTIcon,WSICon,FSMIcon,MCollectIcon,PGRIcon,TLIcon,OBPSIcon, Loader } from "@egovernments/digit-ui-react-components";
// const processLinkData= data => {
//   const newData =  data?.filter(el=> el.url==="digit-ui-card").reduce((a,b)=>{a[b.parentModule]=a[b.parentModule]?.length>0?[b,...a[b.parentModule]]:[b]; return a},{})
//   return newData
// }
const processLinkData= (data,code,t) => {
  const newData =  data?.filter(el=> el.url==="digit-ui-card").reduce((a,b)=>{a[b.parentModule]=a[b.parentModule]?.length>0?[b,...a[b.parentModule]]:[b]; return a},{})
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
  console.log(newObj);
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
        {moduleArray
          .filter((mod) => mod)
          .map(({ code }, index) => {
          //  let Links = Digit.ComponentRegistryService.getComponent(`${code}Links`)
          //   if (code === "Payment" || !Links) {
          //     return <React.Fragment />
          //   }
          //   else{
          //   const mdmsDataObj = fetchedCitizen? processLinkData(getCitizenMenu?.actions,code,t):undefined;
          //   return <CitizenHomeCard header={t(mdmsDataObj?.header)} links={ mdmsDataObj?.links} Icon={()=>iconSelector(code)} />;
          //   }
            let mdmsDataObj
            if(fetchedCitizen)
              mdmsDataObj = fetchedCitizen? processLinkData(getCitizenMenu?.actions,code,t):undefined;
            if(mdmsDataObj?.links?.length > 0)
            return <CitizenHomeCard header={t(mdmsDataObj?.header)} links={ mdmsDataObj?.links} Icon={()=>iconSelector(code)} />;
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
