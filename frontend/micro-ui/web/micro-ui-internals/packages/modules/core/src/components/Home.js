import { BackButton } from "@egovernments/digit-ui-react-components";
import React, { useContext } from "react";

const CitizenHome = ({ modules }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const registry = useContext(ComponentProvider);

  const paymentModule = modules.filter(({ code }) => code === "Payment")[0];
  const moduleArr = modules.filter(({ code }) => code !== "Payment");
  const moduleArray = [paymentModule, ...moduleArr];
  const showQuickPay = moduleArr.some((module) => module.code === "QuickPayLinks");
  return (
    <React.Fragment>
      <BackButton />
      <div className="citizenAllServiceGrid">
        {moduleArray
          .filter((mod) => mod)
          .map(({ code }, index) => {
            let Links = Digit.ComponentRegistryService.getComponent(`${code}Links`) || (() => <React.Fragment />);
            if (code === "Payment" && !showQuickPay) {
              Links = () => <React.Fragment />;
            }
            return <Links key={index} matchPath={`/digit-ui/citizen/${code.toLowerCase()}`} userType={"citizen"} />;
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

export const AppHome = ({ userType, modules }) => {
  if (userType === "citizen") {
    return <CitizenHome modules={modules} />;
  }
  return <EmployeeHome modules={modules} />;
};
