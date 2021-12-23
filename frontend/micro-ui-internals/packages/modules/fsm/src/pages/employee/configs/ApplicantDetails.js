import React, { useState } from "react";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const ApplicantDetails = (channelMenu, channel, setChannel, disable = {}) => {
  const { t } = useTranslation();
  return {
    head: t("ES_TITLE_APPLICANT_DETAILS"),
    body: [
      {
        label: t("ES_NEW_APPLICATION_APPLICATION_CHANNEL"),
        type: "dropdown",
        populators: (
          <Dropdown option={channelMenu} optionKey="i18nKey" id="channel" selected={channel} select={setChannel} t={t} disable={disable.channel} />
        ),
      },
      {
        label: t("ES_NEW_APPLICATION_APPLICANT_NAME"),
        type: "text",
        isMandatory: true,
        populators: {
          name: "applicantName",
          validation: {
            required: true,
            pattern: /[A-Za-z]/,
          },
        },
        disable: disable.name,
      },
      {
        label: t("ES_NEW_APPLICATION_APPLICANT_MOBILE_NO"),
        type: "text",
        isMandatory: true,
        populators: {
          name: "mobileNumber",
          validation: {
            required: true,
            pattern: /^[6-9]\d{9}$/,
          },
        },
        disable: disable.number,
      },
    ],
  };
};

export default ApplicantDetails;
