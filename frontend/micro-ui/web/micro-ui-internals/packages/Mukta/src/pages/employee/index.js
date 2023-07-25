import React from "react";
import { PrivateRoute, BreadCrumb, Card } from "@egovernments/digit-ui-react-components";
import { Switch } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Redirect } from "react-router-dom";

const CustomBredcrumb = ({ t }) => (
  <BreadCrumb
    crumbs={[
      {
        path: `/${window?.contextPath}/employee`,
        content: t("Home"),
        show: true,
      },
      {
        path: `/${window?.contextPath}/employee`,
        content: t("Sample"),
        show: true,
      },
    ]}
    spanStyle={{ maxWidth: "min-content" }}
  />
);

const App = ({ path }) => {
  const { t } = useTranslation();
  return (
    <Switch>
      <React.Fragment>
        <div>
          <CustomBredcrumb t={t} />
          <PrivateRoute path={`${path}/pageone`} component={() => <Card><div>Sample screen created in Mukta Customisation folder</div></Card>} />

          {/* <PrivateRoute>
            <Redirect to={`/${window?.contextPath}/employee/user/error?type=notfound&module=${path}`} />
          </PrivateRoute> */}
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default App;
