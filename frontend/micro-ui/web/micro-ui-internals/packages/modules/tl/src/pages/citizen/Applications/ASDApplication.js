import { Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Spinner from "../../../components/Loader";
import axios from "axios";
import { convertEpochToDateDMY } from "../../../utils";

const ASDApplications = ({ view }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loader, setLoader] = useState(false);
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
    setLoader(true);
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
      const Resp = await axios.post("/tl-services/_ApprovalStandard/_search", data);
      setLoader(false);
      setData(Resp?.data);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <div>
      {loader && <Spinner></Spinner>}
      <Header>{`${t("TL_MY_APPLICATIONS_HEADER")}`}</Header>
      <table className="customers" id="customers" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tr>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              textAlign: "left",
              backgroundColor: "#4169E1",
              color: "white",
            }}
          >
          ID
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              textAlign: "left",
              backgroundColor: "#4169E1",
              color: "white",
            }}
          >
            Tenant Id
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              textAlign: "left",
              backgroundColor: "#4169E1",
              color: "white",
            }}
          >
            Business Service
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              textAlign: "left",
              backgroundColor: "#4169E1",
              color: "white",
            }}
          >
            Application Number
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              textAlign: "left",
              backgroundColor: "#4169E1",
              color: "white",
            }}
          >
            Application Date
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              textAlign: "left",
              backgroundColor: "#4169E1",
              color: "white",
            }}
          >
            Action
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              textAlign: "left",
              backgroundColor: "#4169E1",
              color: "white",
            }}
          >
            Status
          </th>
        </tr>
        {data?.ApprovalStandardEntity?.map((item, index) => {
          return (
            <tr key={`table${index}`}>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.id}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.tenantId}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.businessService}</td>
              <td
                style={{ textDecoration: "underline blue 1px", cursor: "pointer", border: "1px solid #ddd", padding: " 8px" }}
                onClick={() => {
                  window.localStorage.setItem("ApplicationStatus", item?.status);
                  history.push({
                    pathname: "/digit-ui/citizen/obps/Standard",
                    search: `?id=${item?.applicationNumber}`,
                  });
                }}
              >
                {item?.applicationNumber}
              </td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{convertEpochToDateDMY(item?.auditDetails?.createdTime)}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.action}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.status}</td>
            </tr>
          );
        })}
      </table>
    </div>

    /* <Card>
              {Object.keys(application)
                .filter((e) => e !== "raw" && application[e] !== null)
                .map((item) => (
                  <KeyNote keyValue={t(item)} note={t(application[item])} />
                ))}
              <Link to={`/digit-ui/citizen/tl/tradelicence/application/${application?.applicationNumber}/${application?.tenantId}`}>
                <SubmitBar label={t(application?.raw?.status != "PENDINGPAYMENT" ? "TL_VIEW_DETAILS" : "TL_VIEW_DETAILS_PAY")} />
              </Link>
             
            </Card> */
    /* tradelicence/application/PG-TL-2021-09-07-002737/pg.citya */
  );
};
export default ASDApplications;
