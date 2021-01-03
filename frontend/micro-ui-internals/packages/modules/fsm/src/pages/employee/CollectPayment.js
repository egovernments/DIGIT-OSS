import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CardHeader, CardSectionHeader, CardSubHeader, CardText, Dropdown, RadioButtons } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

import { FormComposer } from "../../components/FormComposer";

const CollectPayment = ({ parentRoute }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [menu, setMenu] = useState([]);
  const [ownerType, setOwnerType] = useState();

  function selectedType(value) {}

  const onSubmit = () => {
    history.push(`${parentRoute}/response`);
  };

  const config = [
    {
      head: t("Payment Details"),
      body: [
        {
          label: t("Total Amount"),
          populators: <CardSectionHeader>₹ 500.00</CardSectionHeader>,
        },
      ],
    },
    {
      head: t("Payment Details"),
      body: [
        {
          label: t("Property Type"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={menu} optionKey="name" id="owner" selected={ownerType} select={selectedType} />,
        },
        {
          label: t("No. of Trips"),
          type: "text",
          populators: {
            name: "noOfTrips",
            validation: { pattern: /[0-9]+/ },
          },
        },
        {
          label: t("Amount"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "amount",
            validation: { pattern: /[0-9]+/ },
            componentInFront: (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                ₹
              </span>
            ),
          },
        },
      ],
    },
    {
      head: t("Payment Mode"),
      body: [
        {
          populators: (
            <RadioButtons
              selectedOption={{ title: "Cash" }}
              onSelect={() => {}}
              options={[{ title: "Cash" }, { title: "Debit/Credit Card" }]}
              optionsKey="title"
            ></RadioButtons>
          ),
        },
      ],
    },
  ];

  return (
    <React.Fragment>
      <FormComposer heading="Collect Payment" label="Application Submit" config={config} onSubmit={onSubmit}></FormComposer>
    </React.Fragment>
  );
};

export default CollectPayment;
