import React, { useState } from "react";
import { useParams } from "react-router-dom";
import EditForm from "./EditForm";
import { Loader } from "@egovernments/digit-ui-react-components";
const EditEmpolyee = ({ parentUrl, heading }) => {
  const isupdate = Digit.SessionStorage.get("isupdate");
  const { id: employeeId } = useParams();
  const { tenantId: tenantId } = useParams();
  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId, isupdate);
  if (isLoading) {
    return <Loader />;
  }
  return <EditForm data={data?.Employees[0]} tenantId={tenantId} />;
};

export default EditEmpolyee;
