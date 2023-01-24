import { FormComposer, Header } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { convertDateToMaximumPossibleValue } from "../../../../utils";
import { config } from "../../../../config/NewMessageConfig";



const NewEvents = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MSG_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_MSG_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MSG_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);
  const onSubmit = (data) => {
    const { fromDate, toDate, description, name, documents } = data;
    const details = {
      events: [
        {
          recepient: null,
          source: "WEBAPP",
          eventType: "BROADCAST",
          tenantId: data?.tenantId?.code,
          description,
          name,
          eventDetails: {
            documents,
            fromDate: convertDateToMaximumPossibleValue(new Date(`${fromDate}`))?.getTime(),
            toDate: convertDateToMaximumPossibleValue(new Date(`${toDate}`))?.getTime(),
          }
        }
      ]
    }
    history.push(`/${window?.contextPath}/employee/engagement/messages/response`, details)
  }

  return (
    <Fragment>
      <Header>{t("ADD_NEW_PUBLIC_MESSAGE")}</Header>
      <FormComposer
        config={config}
        onSubmit={onSubmit}
        label={t("ACTION_ADD_NEW_MESSAGE")}
      >
      </FormComposer>
    </Fragment>
  )
}

export default NewEvents;