import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardSubHeader, CardLabel, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";
import FormComposer from "./FormComposer";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";

import useComplaintTypes from "../../../hooks/useComplaintTypes";
import useTenants from "../../../hooks/useTenants";
import { createComplaint } from "../../../redux/actions/index";

export const CreateComplaint = ({ parentUrl }) => {
  const SessionStorage = Digit.SessionStorage;
  const __initComplaintType__ = Digit.SessionStorage.get("complaintType");
  const __initSubType__ = Digit.SessionStorage.get("subType");
  const history = useHistory();

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

  const menu = useComplaintTypes({ stateCode: "pb.amritsar" });
  const { t } = useTranslation();
  const cities = useTenants();
  const dispatch = useDispatch();
  const match = useRouteMatch();

  // //complaint logic
  function selectedType(value) {
    setComplaintType(value);
    setSubTypeMenu(Digit.GetServiceDefinitions.getSubMenu(value, t));
    SessionStorage.set("complaintType", value);
  }

  function selectedSubType(value) {
    setSubType(value);
    Digit.SessionStorage.set("subType", [value]);
  }

  // city locality logic
  const selectCity = async (city) => {
    // Digit.SessionStorage.set("locality_complaint", null);
    // setSelectedLocality(null);
    // setLocalities(null);
    setSelectedCity(city);
    Digit.SessionStorage.set("city_complaint", city);
    const response = await Digit.LocationService.getLocalities({ tenantId: city.code });
    let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
    setLocalities(__localityList);
    Digit.SessionStorage.set("selected_localities", __localityList);
  };

  // useEffect(async () => {
  //   if (selectedCity) {
  //     let response = await Digit.LocationService.getLocalities({ tenantId: selectedCity.code });
  //     let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
  //     setLocalities(__localityList);
  //     Digit.SessionStorage.set("selected_localities", __localityList);
  //   }
  // }, []);

  // useEffect(async () => {
  //   console.log("parmamsssss", params);
  //   params.landmark ? await dispatch(createComplaint(params)) : null;
  //   params.landmark ? history.push(match.url + "/response") : null;
  // }, [params]);

  function selectLocality(locality) {
    setSelectedLocality(locality);
    Digit.SessionStorage.set("locality_complaint", locality);
  }

  //On SUbmit
  const onSubmit = (data) => {
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
    dispatch(createComplaint(formData));
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
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_COMPLAINT_NAME"),
          type: "text",
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
            validation: {
              required: true,
            },
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

  return <FormComposer heading="ES_CREATECOMPLAINT_NEW_COMPLAINT" config={config} onSubmit={onSubmit}></FormComposer>;
};
