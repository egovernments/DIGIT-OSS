import React from "react";
import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import { Switch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sample from "./Sample";
import SampleInbox from "./SampleInbox";
import SampleSearch from "./SampleSearch";
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

          <PrivateRoute path={`${path}/create`} component={() => <Sample></Sample>} />
          <PrivateRoute path={`${path}/inbox`} component={() => <SampleInbox></SampleInbox>} />
          <PrivateRoute path={`${path}/search`} component={() => <SampleSearch></SampleSearch>} />
          {/* <PrivateRoute>
            <Redirect to={`/${window?.contextPath}/employee/user/error?type=notfound&module=${path}`} />
          </PrivateRoute> */}
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default App;
