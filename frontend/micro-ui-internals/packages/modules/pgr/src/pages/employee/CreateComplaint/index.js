import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardSubHeader, CardLabel, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";
import FormComposer from "./FormComposer";
import useComplaintTypes from "../../../hooks/useComplaintTypes";
import useTenants from "../../../hooks/useTenants";

export const CreateComplaint = () => {
  const SessionStorage = Digit.SessionStorage;
  const __initComplaintType__ = Digit.SessionStorage.get("complaintType");
  const __initSubType__ = Digit.SessionStorage.get("subType");

  const city_complaint = Digit.SessionStorage.get("city_complaint");
  const locality_complaint = Digit.SessionStorage.get("locality_complaint");
  const selected_localities = Digit.SessionStorage.get("selected_localities");

  const [complaintType, setComplaintType] = useState(__initComplaintType__ ? __initComplaintType__ : {});
  const [subTypeMenu, setSubTypeMenu] = useState(__initSubType__ ? __initSubType__ : {});
  const [subType, setSubType] = useState({});
  const [selectedCity, setSelectedCity] = useState(city_complaint ? city_complaint : null);
  const [localities, setLocalities] = useState(selected_localities ? selected_localities : null);
  const [selectedLocality, setSelectedLocality] = useState(locality_complaint ? locality_complaint : null);

  const menu = useComplaintTypes({ stateCode: "pb.amritsar" });
  const { t } = useTranslation();
  const cities = useTenants();

  //complaint logic
  function selectedType(value) {
    setComplaintType(value);
    SessionStorage.set("complaintType", value);
  }

  useEffect(() => {
    setSubTypeMenu(Digit.GetServiceDefinitions.getSubMenu(complaintType, t));
  }, [complaintType]);

  function selectedSubType(value) {
    setSubType(value);
    Digit.SessionStorage.set("subType", value);
  }

  // city locality logic
  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
    Digit.SessionStorage.set("city_complaint", city);
  }

  useEffect(async () => {
    if (selectedCity) {
      let response = await Digit.LocationService.getLocalities({ tenantId: selectedCity.code });
      let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      setLocalities(__localityList);
      Digit.SessionStorage.set("selected_localities", __localityList);
    }
  }, [selectedCity]);

  function selectLocality(locality) {
    setSelectedLocality(locality);
    Digit.SessionStorage.set("locality_complaint", locality);
  }

  //On SUbmit
  function onSubmit(data) {
    console.log("submit data", data);
  }

  const config = [
    {
      head: "Complainant Details",
      body: [
        {
          label: "Mobile Number",
          type: "text",
          populators: {
            name: "mobile",
          },
        },
        {
          label: "Name",
          type: "text",
          populators: {
            name: "name",
          },
        },
      ],
    },
    {
      head: "Complaint Details",
      body: [
        {
          label: "Complaint Type",
          type: "dropdown",
          populators: <Dropdown option={menu} optionKey="name" selected={complaintType} select={selectedType} />,
        },
        {
          label: "Complaint Sub-Type",
          type: "dropdown",
          populators: <Dropdown option={subTypeMenu} optionKey="name" selected={subType} select={selectedSubType} />,
        },
      ],
    },
    {
      head: "Complaint Location",
      body: [
        {
          label: "Pincode",
          type: "text",
          populators: {
            name: "pincode",
          },
        },
        {
          label: "City",
          type: "dropdown",
          populators: <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey="name" />,
        },
        {
          label: "Moholla",
          type: "dropdown",
          dependency: selectedCity && localities ? true : false,
          populators: <Dropdown isMandatory selected={selectedLocality} optionKey="code" option={localities} select={selectLocality} t={t} />,
        },
        {
          label: "Landmark",
          type: "textarea",
          populators: {
            name: "landmark",
          },
        },
      ],
    },
    {
      head: "Additional Details",
      body: [
        {
          label: "Additional Details",
          type: "textarea",
          populators: {
            name: "details",
          },
        },
      ],
    },
  ];

  return <FormComposer heading="New Complaint" config={config} onSubmit={onSubmit}></FormComposer>;
};
