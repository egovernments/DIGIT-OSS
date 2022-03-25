import { Card, Header, KeyNote, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const MyApplications = ({view}) => {
  const { t } = useTranslation();

  const { mobileNumber, tenantId } = Digit.UserService.getUser()?.info || {}

  const { isLoading, isError, data, error, ...rest } = view === "bills" ? Digit.Hooks.tl.useFetchBill(
    {
      params: { businessService: "TL", tenantId, mobileNumber },
      config: { enabled: view === "bills" }
    }
  ) : Digit.Hooks.tl.useTLSearchApplication({}, {
    enabled: view !== "bills"
  },t);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <React.Fragment>
      <Header>{`${t("TL_MY_APPLICATIONS_HEADER")}`}</Header>
      {data?.map((application) => {
        return (
          <div>
            <Card>
              {Object.keys(application).filter(e => e !== "raw" && application[e] !== null).map(item => <KeyNote keyValue={t(item)} note={t(application[item])} />)}
              <Link to={`/digit-ui/citizen/tl/tradelicence/application/${application?.raw?.applicationNumber}/${application.raw?.tenantId}`}>
                <SubmitBar label={t(application?.raw?.status != "PENDINGPAYMENT" ? "TL_VIEW_DETAILS" : "TL_VIEW_DETAILS_PAY")} />
              </Link>{" "}
            </Card>
          </div>
        );
      })}
    </React.Fragment>
  );
};
export default MyApplications;
