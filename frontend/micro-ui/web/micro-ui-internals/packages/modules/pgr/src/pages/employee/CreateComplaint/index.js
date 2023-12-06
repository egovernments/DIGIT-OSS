import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";

import { FormComposer } from "../../../components/FormComposer";
import { createComplaint } from "../../../redux/actions/index";

export const CreateComplaint = ({ parentUrl }) => {
  const cities = Digit.Hooks.pgr.useTenants();
  const { t } = useTranslation();

  const getCities = () => cities?.filter((e) => e.code === Digit.ULBService.getCurrentTenantId()) || [];

  const [complaintType, setComplaintType] = useState({});
  const [subTypeMenu, setSubTypeMenu] = useState([]);
  const [subType, setSubType] = useState({});
  const [pincode, setPincode] = useState("");
  const [selectedCity, setSelectedCity] = useState(getCities()[0] ? getCities()[0] : null);

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    getCities()[0]?.code,
    "admin",
    {
      enabled: !!getCities()[0],
    },
    t
  );

  const [localities, setLocalities] = useState(fetchedLocalities);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [canSubmit, setSubmitValve] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [pincodeNotValid, setPincodeNotValid] = useState(false);
  const [params, setParams] = useState({});
  const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
  const menu = Digit.Hooks.pgr.useComplaintTypes({ stateCode: tenantId });
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const serviceDefinitions = Digit.GetServiceDefinitions;
  const client = useQueryClient();

  useEffect(() => {
    if (complaintType?.key && subType?.key && selectedCity?.code && selectedLocality?.code) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  }, [complaintType, subType, selectedCity, selectedLocality]);

  useEffect(() => {
    setLocalities(fetchedLocalities);
  }, [fetchedLocalities]);

  useEffect(() => {
    const city = cities.find((obj) => obj.pincode?.find((item) => item == pincode));
    if (city?.code === getCities()[0]?.code) {
      setPincodeNotValid(false);
      setSelectedCity(city);
      setSelectedLocality(null);
      const __localityList = fetchedLocalities;
      const __filteredLocalities = __localityList.filter((city) => city["pincode"] == pincode);
      setLocalities(__filteredLocalities);
    } else if (pincode === "" || pincode === null) {
      setPincodeNotValid(false);
      setLocalities(fetchedLocalities);
    } else {
      setPincodeNotValid(true);
    }
  }, [pincode]);

  async function selectedType(value) {
    if (value.key !== complaintType.key) {
      if (value.key === "Others") {
        setSubType({ name: "" });
        setComplaintType(value);
        setSubTypeMenu([{ key: "Others", name: t("SERVICEDEFS.OTHERS") }]);
      } else {
        setSubType({ name: "" });
        setComplaintType(value);
        setSubTypeMenu(await serviceDefinitions.getSubMenu(tenantId, value, t));
      }
    }
  }

  function selectedSubType(value) {
    setSubType(value);
  }

  // city locality logic
  const selectCity = async (city) => {
    // if (selectedCity?.code !== city.code) {}
    return;
  };

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  const wrapperSubmit = (data) => {
    if (!canSubmit) return;
    setSubmitted(true);
    !submitted && onSubmit(data);
  };

  //On SUbmit
  const onSubmit = async (data) => {
    if (!canSubmit) return;
    const cityCode = selectedCity.code;
    const city = selectedCity.city.name;
    const district = selectedCity.city.name;
    const region = selectedCity.city.name;
    const localityCode = selectedLocality.code;
    const localityName = selectedLocality.name;
    const landmark = data.landmark;
    const { key } = subType;
    const complaintType = key;
    const mobileNumber = data.mobileNumber;
    const name = data.name;
    const formData = { ...data, cityCode, city, district, region, localityCode, localityName, landmark, complaintType, mobileNumber, name };
    await dispatch(createComplaint(formData));
    await client.refetchQueries(["fetchInboxData"]);
    history.push(parentUrl + "/response");
  };

  const handlePincode = (event) => {
    const { value } = event.target;
    setPincode(value);
    if (!value) {
      setPincodeNotValid(false);
    }
  };

  const isPincodeValid = () => !pincodeNotValid;

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
            componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
            error: t("CORE_COMMON_MOBILE_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_COMPLAINT_NAME"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "name",
            validation: {
              required: true,
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
            validation: { pattern: /^[1-9][0-9]{5}$/, validate: isPincodeValid },
            error: t("CORE_COMMON_PINCODE_INVALID"),
            onChange: handlePincode,
          },
        },
        {
          label: t("CS_COMPLAINT_DETAILS_CITY"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <Dropdown
              isMandatory
              selected={selectedCity}
              freeze={true}
              option={getCities()}
              id="city"
              select={selectCity}
              optionKey="i18nKey"
              t={t}
            />
          ),
        },
        {
          label: t("CS_CREATECOMPLAINT_MOHALLA"),
          type: "dropdown",
          isMandatory: true,
          dependency: selectedCity && localities ? true : false,
          populators: (
            <Dropdown isMandatory selected={selectedLocality} optionKey="i18nkey" id="locality" option={localities} select={selectLocality} t={t} />
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
            name: "description",
          },
        },
      ],
    },
  ];
  return (
    <FormComposer
      heading={t("ES_CREATECOMPLAINT_NEW_COMPLAINT")}
      config={config}
      onSubmit={wrapperSubmit}
      isDisabled={!canSubmit && !submitted}
      label={t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT")}
    />
  );
};
