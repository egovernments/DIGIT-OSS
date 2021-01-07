import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FormComposer } from "../../../components/FormComposer";

// TODO: fetch data instead of hard coded
import data from "../../../propertyType.json";
// const propertyTypeRes = data.PropertyType.map((item) => item.propertyType);
const propertySubTypeRes = data.PropertyType.map((item) => ({ key: item.propertyType, name: item.code }));

export const NewApplication = ({ parentUrl, heading }) => {
  // const __initPropertyType__ = window.Digit.SessionStorage.get("propertyType");
  // const __initSubType__ = window.Digit.SessionStorage.get("subType");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [menu, setMenu] = useState([]);
  const [subTypeMenu, setSubTypeMenu] = useState([]);
  const [propertyType, setPropertyType] = useState({});
  const [subType, setSubType] = useState({});
  const [vehicleMenu, setVehicleMenu] = useState([
    { key: "Tracker (500 ltrs)", name: "Tracker (500 ltrs)" },
    { key: "Tracker (1000 ltrs)", name: "Tracker (1000 ltrs)" },
  ]);
  const [channel, setChannel] = useState(null);
  const [channelMenu, setChannelMenu] = useState([]);
  const [sanitation, setSanitation] = useState([]);
  const [sanitationMenu, setSanitationMenu] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [slumMenu, setSlumMenu] = useState([{ key: "NJagbandhu", name: "NJagbandhu" }]);
  const [slum, setSlum] = useState("NJagbandhu");

  const localitiesObj = useSelector((state) => state.common.localities);

  const cityProperty = Digit.SessionStorage.get("city_property");
  const selectedLocalities = Digit.SessionStorage.get("selected_localities");
  const localityProperty = Digit.SessionStorage.get("locality_property");

  const [selectedCity, setSelectedCity] = useState(cityProperty ? cityProperty : null);
  const [localities, setLocalities] = useState(selectedLocalities ? selectedLocalities : null);
  const [selectedLocality, setSelectedLocality] = useState(localityProperty ? localityProperty : null);

  const { t } = useTranslation();
  const cities = Digit.Hooks.fsm.useTenants();
  const history = useHistory();
  const applicationChannelData = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "ApplicationChannel");
  const sanitationTypeData = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "SanitationType");

  useEffect(() => {
    if (!applicationChannelData.isLoading) {
      setChannelMenu(applicationChannelData.data);
    }
  }, [applicationChannelData]);

  useEffect(() => {
    if (!sanitationTypeData.isLoading) {
      setSanitationMenu(sanitationTypeData.data);
    }
  }, [sanitationTypeData]);

  useEffect(() => {
    setMenu(() => {
      return Object.values(
        data.PropertyType.reduce((acc, item) => {
          if (item.propertyType === undefined) return acc;
          return Object.assign(acc, { [item.propertyType]: { key: item.propertyType, name: item.propertyType } });
        }, {})
      );
    });
    setSubTypeMenu(propertySubTypeRes.filter((item) => item.key === propertyType));
  }, []);

  function selectedType(value) {
    setPropertyType(value);
    setSubTypeMenu(propertySubTypeRes.filter((item) => item.key === value.key));
    window.Digit.SessionStorage.set("propertyType", value);
  }

  function selectSlum(value) {
    setSlum(value);
  }

  function selectChannel(value) {
    setChannel(value);
  }

  function selectSanitation(value) {
    setSanitation(value);
  }

  function selectVehicle(value) {
    setVehicle(value);
  }

  function selectedSubType(value) {
    setSubType(value);
  }

  // city locality logic
  const selectCity = async (city) => {
    setSelectedCity(city);
    let __localityList = localitiesObj[city.code];
    setLocalities(__localityList);
  };

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  const onSubmit = (data) => {
    const applicationChannel = channel.code;
    const sanitationtype = sanitation.code;
    const applicantName = data.applicantName;
    const mobileNumber = data.mobileNumber;
    const pincode = data.pincode;
    const landmark = data.landmark;
    const noOfTrips = data.noOfTrips;
    const amount = data.amount;
    const cityCode = selectedCity.code;
    const city = selectedCity.city.name;
    const district = selectedCity.city.name;
    const region = selectedCity.city.name;
    const state = "Punjab";
    const localityCode = selectedLocality.code;
    const localityName = selectedLocality.name;
    const { name } = subType;
    const propertyType = name;
    const formData = {
      fsm: {
        citizen: {
          name: applicantName,
          mobileNumber,
        },
        tenantId: cityCode,
        sanitationtype: sanitationtype,
        source: applicationChannel,
        additionalDetails: {
          tripAmount: amount,
        },
        propertyUsage: propertyType,
        address: {
          tenantId: cityCode,
          landmark,
          city,
          state,
          pincode,
          locality: {
            code: localityCode.split("_").pop(),
            name: localityName,
          },
          geoLocation: {
            latitude: selectedLocality.latitude,
            longitude: selectedLocality.longitude,
          },
        },
        noOfTrips,
      },
      workflow: null,
    };
    console.log("%c 🇸🇦: onSubmit -> formData ", "font-size:16px;background-color:#3dd445;color:white;", formData, subType);

    window.Digit.SessionStorage.set("propertyType", null);
    window.Digit.SessionStorage.set("subType", null);
    Digit.SessionStorage.set("city_property", null);
    Digit.SessionStorage.set("selected_localities", null);
    Digit.SessionStorage.set("locality_property", null);

    history.push("/digit-ui/employee/fsm/response", formData);
  };

  const config = [
    {
      head: t("ES_TITLE_APPLICATION_DETAILS"),
      body: [
        {
          label: t("ES_NEW_APPLICATION_APPLICATION_CHANNEL"),
          type: "dropdown",
          populators: <Dropdown option={channelMenu} optionKey="name" id="channel" selected={channel} select={selectChannel} />,
        },
        {
          label: t("ES_NEW_APPLICATION_SANITATION_TYPE"),
          type: "dropdown",
          populators: <Dropdown option={sanitationMenu} optionKey="name" id="sanitation" selected={sanitation} select={selectSanitation} />,
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
        },
        {
          label: t("ES_NEW_APPLICATION_SLUM_NAME"),
          type: "radio",
          isMandatory: true,
          populators: <Dropdown option={slumMenu} optionKey="name" id="slum" selected={slum} select={selectSlum} />,
        },
      ],
    },
    {
      head: t("ES_NEW_APPLICATION_PROPERTY_DETAILS"),
      body: [
        {
          label: t("ES_NEW_APPLICATION_PROPERTY_TYPE"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={menu} optionKey="name" id="propertyType" selected={propertyType} select={selectedType} />,
        },
        {
          label: t("ES_NEW_APPLICATION_PROPERTY_SUB-TYPE"),
          isMandatory: true,
          type: "dropdown",
          menu: { ...subTypeMenu },
          populators: <Dropdown option={subTypeMenu} optionKey="name" id="propertySubType" selected={subType} select={selectedSubType} />,
        },
      ],
    },
    {
      head: t("ES_NEW_APPLICATION_LOCATION_DETAILS"),
      body: [
        {
          label: t("ES_NEW_APPLICATION_LOCATION_PINCODE"),
          type: "text",
          populators: {
            name: "pincode",
            validation: { pattern: /^[1-9][0-9]{5}$/ },
          },
        },
        {
          label: t("ES_NEW_APPLICATION_LOCATION_CITY"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown isMandatory selected={selectedCity} option={cities} id="city" select={selectCity} optionKey="name" />,
        },
        {
          label: t("ES_NEW_APPLICATION_LOCATION_MOHALLA"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <Dropdown isMandatory selected={selectedLocality} optionKey="code" id="locality" option={localities} select={selectLocality} t={t} />
          ),
        },
        {
          label: t("ES_NEW_APPLICATION_LOCATION_LANDMARK"),
          type: "textarea",
          populators: {
            name: "landmark",
          },
        },
      ],
    },
    {
      head: t("ES_NEW_APPLICATION_PAYMENT_DETAILS"),
      body: [
        {
          label: t("ES_NEW_APPLICATION_PAYMENT_NO_OF_TRIPS"),
          type: "text",
          populators: {
            name: "noOfTrips",
            validation: { pattern: /[0-9]+/ },
          },
        },
        {
          label: t("ES_NEW_APPLICATION_PAYMENT_AMOUNT"),
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
      head: t(),
      body: [
        {
          label: t("ES_NEW_APPLICATION_LOCATION_VEHICLE_REQUESTED"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={vehicleMenu} optionKey="name" id="vehicle" selected={vehicle} select={selectVehicle} />,
        },
      ],
    },
  ];

  return <FormComposer heading={heading} label={t("ES_COMMON_APPLICATION_SUBMITTED")} config={config} onSubmit={onSubmit}></FormComposer>;
};
