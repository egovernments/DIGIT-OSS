import React from "react";
import { RadioButtons } from "@egovernments/digit-ui-react-components";

const AssignedTo = ({ onFilterChange, searchParams, paginationParms, tenantId, t }) => {
  const { data: AssignedToAll } = Digit.Hooks.fsm.useInbox(
    tenantId,
    {
      ...searchParams,
      ...paginationParms,
      fromDate: searchParams?.fromDate ? new Date(searchParams?.fromDate).getTime() : undefined,
      toDate: searchParams?.toDate ? new Date(searchParams?.toDate).getTime() : undefined,
      total: true,
      uuid: { code: "ASSIGNED_TO_ALL", name: t("ES_INBOX_ASSIGNED_TO_ALL") },
    }
  );

  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")} (0)` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")} (${AssignedToAll?.totalCount || 0})` },
  ];

  return (
    <React.Fragment>
      <RadioButtons
        onSelect={(d) => onFilterChange({ uuid: { code: d.code } })}
        selectedOption={availableOptions.filter((option) => option.code === searchParams?.uuid?.code)[0]}
        optionsKey="name"
        options={availableOptions}
      />
    </React.Fragment>
  );
};

export default AssignedTo;
