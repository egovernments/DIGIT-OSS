import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, FormComposer } from "@egovernments/digit-ui-react-components";

// import usePropertyTypes from "../../../hooks/usePropertyTypes";

export const NewApplication = ({ parentUrl }) => {
  const { t } = useTranslation();
  const SessionStorage = Digit.SessionStorage;
  const __initPropertyType__ = Digit.SessionStorage.get("propertyType");
  const __initSubType__ = Digit.SessionStorage.get("subType");

  const [propertyType, setPropertyType] = useState(__initPropertyType__ ? __initPropertyType__ : {});
  const [subTypeMenu, setSubTypeMenu] = useState(__initSubType__ ? __initSubType__ : []);
  const [subType, setSubType] = useState({});

  // const menu = usePropertyTypes({ stateCode: "pb.amritsar" });

  function selectedType(value) {
    setPropertyType(value);
    setSubTypeMenu(Digit.GetServiceDefinitions.getSubMenu(value, t));
    SessionStorage.set("propertyType", value);
  }

  function selectedSubType(value) {
    setSubType(value);
    Digit.SessionStorage.set("subType", [value]);
  }

  const onSubmit = () => {};

  const config = [
    {
      head: t("Application Details"),
      body: [
        {
          label: t("Application Channel"),
          type: "text",
          populators: {
            name: "name",
            validation: {
              pattern: /[A-Za-z]/,
            },
          },
        },
        {
          label: t("Applicant Name"),
          type: "text",
          isMandatory: true,
          populators: {
            name: "name",
            validation: {
              pattern: /[A-Za-z]/,
            },
          },
        },
        {
          label: t("Applicant Mobile No."),
          type: "text",
          isMandatory: true,
          populators: {
            name: "mobileNumber",
            validation: {
              required: true,
              pattern: /^[6-9]\d{9}$/,
            },
          },
        },
        {
          label: t("Economic Weaker Section"),
          type: "text",
          isMandatory: true,
          populators: {
            name: "name",
            validation: {
              pattern: /[A-Za-z]/,
            },
          },
        },
      ],
    },
    {
      head: t("Property Details"),
      body: [
        {
          label: t("Property Type"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={[]} optionKey="name" id="propertyType" selected={propertyType} select={selectedType} />,
        },
        {
          label: t("Property Sub-Type"),
          isMandatory: true,
          type: "dropdown",
          menu: { ...subTypeMenu },
          populators: <Dropdown option={[]} optionKey="name" id="propertySubType" selected={subType} select={selectedSubType} />,
        },
      ],
    },
    {
      head: t("Location Details"),
      body: [
        {
          label: t("Pincode"),
          type: "text",
          populators: {
            name: "name",
            validation: {
              pattern: /[A-Za-z]/,
            },
          },
        },
        {
          label: t("City"),
          isMandatory: true,
          type: "dropdown",
          menu: {},
          populators: <Dropdown />,
        },
        {
          label: t("Mohalla"),
          isMandatory: true,
          type: "",
          menu: {},
          populators: <Dropdown />,
        },
        {
          label: t("Landmark"),
          type: "textarea",
          populators: {
            name: "name",
            validation: {
              pattern: /[A-Za-z]/,
            },
          },
        },
      ],
    },
    {
      head: t("Payment Details"),
      body: [
        {
          label: t("No. of Trips"),
          type: "text",
          populators: {
            name: "name",
            validation: {
              pattern: /[A-Za-z]/,
            },
          },
        },
        {
          label: t("Amount"),
          isMandatory: true,
          populators: {
            name: "name",
            validation: {
              pattern: /[A-Za-z]/,
            },
          },
        },
      ],
    },
    {
      head: t(""),
      body: [
        {
          label: t("Vehicle Requested"),
          isMandatory: true,
          type: "dropdown",
          menu: {},
          populators: <Dropdown />,
        },
      ],
    },
  ];

  return <FormComposer heading="New Desuldging Application" label="Application Submit" config={config} onSubmit={onSubmit}></FormComposer>;
};
