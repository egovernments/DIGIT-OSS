import { Header, LinkButton, Loader, Table } from "@egovernments/digit-ui-react-components";
import { Link, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ApplicationAudit = ({ parentRoute }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { tenantId } = Digit.UserService.getUser().info;

  const { data: auditResponse, isLoading } = Digit.Hooks.fsm.useApplicationAudit(tenantId, { applicationNo: id });

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

  const whenList = auditResponse?.fsmAudit?.map((e) => new Date(e.when).toLocaleString());
  const uuids = auditResponse?.fsmAudit?.map((e) => e.who);

  const userList = Digit.Hooks.useUserSearch(
    null,
    { uuid: uuids },
    {},
    { enabled: uuids ? true : false }
  );

  const getUserFromUUID = (uuid) => {
    let fetchedUsers = userList?.data?.user;
    if (fetchedUsers?.length) return fetchedUsers.filter((e) => e.uuid === uuid)[0];
    else return null;
  };

  const getWhat = (what) => {
    const keys = Object.keys(what);
    return keys.map((key, i) => (
      <p key={i}>
        <span>{key}</span> : <span>{what[key]}</span>
      </p>
    ));
  };

  const data = auditResponse?.fsmAudit?.map((el, index) => {
    const user = getUserFromUUID(el.who);
    return {
      when: whenList[index],
      who: `${user?.name} (${user?.type})`,
      what:
        index === 0 ? (
          <p>
            New Request{" "}
            <Link to={`/digit-ui/employee/fsm/application-details/${id}`}>
              <LinkButton label={t("ES_VIEW_APPLICATION")} style={{ color: "#1671ba", marginLeft: "8px" }} />
            </Link>
          </p>
        ) : (
          <React.Fragment>{getWhat(el.what)}</React.Fragment>
        ),
    };
  });

  if (isLoading || userList.isLoading) return <Loader />;

  return (
    <div style={{ overflow: "auto" }}>
      <Header>{t("ES_TITLE_APPLICATION_AUDIT")}</Header>
      <Table
        t={t}
        data={data || []}
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
