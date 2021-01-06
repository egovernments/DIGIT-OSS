import { Header, LinkButton, Table } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";

const ApplicationAudit = () => {
  const { t } = useTranslation();

  const data = React.useMemo(
    () => [
      {
        when: "12/08/2020, 12:50:34 AM",
        who: "Ajit Singh (Citizen)",
        what: (
          <p>
            New Request{" "}
            <Link to={`/digit-ui/employee/fsm/collect-payment`}>
              <LinkButton label={t("ES_VIEW_APPLICATION")} style={{ color: "#1671ba", marginLeft: "8px" }} />
            </Link>
          </p>
        ),
      },
      {
        when: "12/08/2020, 12:50:34 AM",
        who: "Araavind (Employee)",
        what: 'Pit Size - "1m x 1m x 1m',
      },
      {
        when: "12/08/2020, 12:50:34 AM",
        who: "Prakash (DSO)",
        what: 'Volumne of SLudge - "223 ltrs"',
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: t("ES_AUDIT_WHEN"),
        accessor: "when",
      },
      {
        Header: t("ES_AUDIT_WHO"),
        accessor: "who",
      },
      {
        Header: t("ES_AUDIT_WHAT"),
        accessor: "what",
      },
    ],
    []
  );

  return (
    <div>
      <Header>{t("ES_APPLICATION_AUDIT")}</Header>
      <Table
        data={data}
        columns={columns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              padding: "20px 18px",
              fontSize: "16px",
              // borderTop: "1px solid grey",
              // textAlign: "left",
              // verticalAlign: "middle",
            },
          };
        }}
      />
    </div>
  );
};

export default ApplicationAudit;
