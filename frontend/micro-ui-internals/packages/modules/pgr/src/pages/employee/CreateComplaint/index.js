import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { useRouteMatch, useHistory } from "react-router-dom";

import { FormComposer } from "../../../components/FormComposer";
import { createComplaint } from "../../../redux/actions/index";

export const CreateComplaint = ({ parentUrl }) => {
  const SessionStorage = Digit.SessionStorage;
  const __initComplaintType__ = Digit.SessionStorage.get("complaintType");
  const __initSubType__ = Digit.SessionStorage.get("subType");

  const city_complaint = Digit.SessionStorage.get("city_complaint");
  const selected_localities = Digit.SessionStorage.get("selected_localities");
  const locality_complaint = Digit.SessionStorage.get("locality_complaint");

  const [complaintType, setComplaintType] = useState(__initComplaintType__ ? __initComplaintType__ : {});
  const [subTypeMenu, setSubTypeMenu] = useState(__initSubType__ ? __initSubType__ : []);
  const [subType, setSubType] = useState({});
  const [selectedCity, setSelectedCity] = useState(city_complaint ? city_complaint : null);
  const [localities, setLocalities] = useState(selected_localities ? selected_localities : null);
  const [selectedLocality, setSelectedLocality] = useState(locality_complaint ? locality_complaint : null);
  const [submitValve, setSubmitValve] = useState(false);
  const [params, setParams] = useState({});
  const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
  const menu = Digit.Hooks.pgr.useComplaintTypes({ stateCode: tenantId });
  const { t } = useTranslation();
  const cities = Digit.Hooks.pgr.useTenants();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const serviceDefinitions = Digit.GetServiceDefinitions;

  //TO USE this way
  // let getObject = window.Digit.CoreService;
  // console.log(getObject.service("PGR").Name)

  // //complaint logic
  async function selectedType(value) {
    setComplaintType(value);
    setSubTypeMenu(await serviceDefinitions.getSubMenu(tenantId, value, t));
    SessionStorage.set("complaintType", value);
  }

  function selectedSubType(value) {
    setSubType(value);
    Digit.SessionStorage.set("subType", [value]);
  }

  // city locality logic
  const selectCity = async (city) => {
    setSelectedCity(city);
    Digit.SessionStorage.set("city_complaint", city);
    let response = await Digit.LocationService.getLocalities({ tenantId: city.code });
    let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
    setLocalities(__localityList);
    Digit.SessionStorage.set("selected_localities", __localityList);
  };

  function selectLocality(locality) {
    setSelectedLocality(locality);
    Digit.SessionStorage.set("locality_complaint", locality);
  }

  //On SUbmit
  const onSubmit = async (data) => {
    setSubmitValve(true);
    console.log("submit data", data, subType, selectedCity, selectedLocality);
    const cityCode = selectedCity.code;
    const city = selectedCity.city.name;
    const district = selectedCity.city.name;
    const region = selectedCity.city.name;
    const state = "Punjab";
    const localityCode = selectedLocality.code;
    const localityName = selectedLocality.name;
    const landmark = data.landmark;
    const { key } = subType;
    const complaintType = key;
    const mobileNumber = data.mobileNumber;
    const name = data.name;
    const formData = { ...params, cityCode, city, district, region, state, localityCode, localityName, landmark, complaintType, mobileNumber, name };
    await dispatch(createComplaint(formData));
    history.push(parentUrl + "/response");
  };

  const config = [
    {
      head: t("ES_CREATECOMPLAINT_PROVIDE_COMPLAINANT_DETAILS"),
      body: [
        {
          label: t("ES_CREATECOMPLAINT_MOBILE_NUMBER"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "mobileNumber",
            validation: {
              required: true,
              pattern: /^[6-9]\d{9}$/,
            },
            error: t("CORE_COMMON_MOBILE_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_COMPLAINT_NAME"),
          type: "text",
          populators: {
            name: "name",
            validation: {
              pattern: /^[A-Za-z]/,
            },
            error: t("CS_ADDCOMPLAINT_NAME_ERROR"),
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={menu} optionKey="name" id="complaintType" selected={complaintType} select={selectedType} />,
        },
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE"),
          isMandatory: true,
          type: "dropdown",
          menu: { ...subTypeMenu },
          populators: <Dropdown option={subTypeMenu} optionKey="name" id="complaintSubType" selected={subType} select={selectedSubType} />,
        },
      ],
    },
    {
      head: t("CS_ADDCOMPLAINT_LOCATION"),
      body: [
        {
          label: t("CORE_COMMON_PINCODE"),
          type: "text",
          populators: {
            name: "pincode",
            validation: { pattern: /^[1-9][0-9]{5}$/ },
            error: t("CORE_COMMON_PINCODE_INVALID"),
          },
        },
        {
          label: t("CS_COMPLAINT_DETAILS_CITY"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown isMandatory selected={selectedCity} option={cities} id="city" select={selectCity} optionKey="name" />,
        },
        {
          label: t("CS_CREATECOMPLAINT_MOHALLA"),
          type: "dropdown",
          isMandatory: true,
          dependency: selectedCity && localities ? true : false,
          populators: (
            <Dropdown isMandatory selected={selectedLocality} optionKey="code" id="locality" option={localities} select={selectLocality} t={t} />
          ),
        },
        {
          label: t("CS_COMPLAINT_DETAILS_LANDMARK"),
          type: "textarea",
          populators: {
            name: "landmark",
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
          type: "textarea",
          populators: {
            name: "details",
          },
        },
      ],
    },
  ];

  return (
    <FormComposer
      heading="ES_CREATECOMPLAINT_NEW_COMPLAINT"
      config={config}
      onSubmit={onSubmit}
      label={t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT")}
    />
  );
};
