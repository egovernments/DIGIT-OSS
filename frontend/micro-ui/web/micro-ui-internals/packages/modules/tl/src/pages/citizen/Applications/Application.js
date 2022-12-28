import { Card, Header, KeyNote, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";

const MyApplications = ({ view }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  // const { mobileNumber, tenantId } = Digit.UserService.getUser()?.info || {};

  // const { isLoading, isError, data, error, ...rest } =
  //   view === "bills"
  //     ? Digit.Hooks.tl.useFetchBill({
  //         params: { businessService: "TL", tenantId, mobileNumber },
  //         config: { enabled: view === "bills" },
  //       })
  //     : Digit.Hooks.tl.useTLSearchApplication(
  //         {},
  //         {
  //           enabled: view !== "bills",
  //         },
  //         t
  //       );

  const userInfo = Digit.UserService.getUser()?.info || {};
  const getApplications = async () => {
    const token = window?.localStorage?.getItem("token");
    const data = {
      RequestInfo: {
        apiId: "Rainmaker",
        authToken: token,
        msgId: "1672136660039|en_IN",
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/v1/_search", data);
      console.log("Resp===", Resp?.data);
      setData(Resp?.data);
    } catch (error) {
      return error.message;
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <React.Fragment>
      <Header>{`${t("TL_MY_APPLICATIONS_HEADER")}`}</Header>
      {data?.Licenses?.map((application, index) => {
        console.log("application", application);
        return (
          <div key={index}>
            <Card>
              {Object.keys(application)
                .filter((e) => e !== "raw" && application[e] !== null)
                .map((item) => (
                  <KeyNote keyValue={t(item)} note={t(application[item])} />
                ))}
              <Link to={`/digit-ui/citizen/tl/tradelicence/application/${application?.applicationNumber}/${application?.tenantId}`}>
                <SubmitBar label={t(application?.raw?.status != "PENDINGPAYMENT" ? "TL_VIEW_DETAILS" : "TL_VIEW_DETAILS_PAY")} />
              </Link>
              {/* tradelicence/application/PG-TL-2021-09-07-002737/pg.citya */}
            </Card>
          </div>
        );
      })}
    </React.Fragment>
  );
};
export default MyApplications;
