import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

const isConventionalSpecticTank = (tankDimension) => tankDimension === "lbd";

export const NewApplication = ({ parentUrl, heading }) => {
  // const __initPropertyType__ = window.Digit.SessionStorage.get("propertyType");
  // const __initSubType__ = window.Digit.SessionStorage.get("subType");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  // const { data: commonFields, isLoading } = useQuery('newConfig', () => fetch(`http://localhost:3002/commonFields`).then(res => res.json()))
  // const { data: postFields, isLoading: isTripConfigLoading } = useQuery('tripConfig', () => fetch(`http://localhost:3002/tripDetails`).then(res => res.json()))
  const { data: commonFields, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "CommonFieldsConfig");
  const { data: preFields, isLoading: isApplicantConfigLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PreFieldsConfig");
  const { data: postFields, isLoading: isTripConfigLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PostFieldsConfig");

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);
  // const { data: vehicleMenu } = Digit.Hooks.fsm.useMDMS(state, "Vehicle", "VehicleType", { staleTime: Infinity });
  // const { data: channelMenu } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "EmployeeApplicationChannel");

  const { t } = useTranslation();
  const history = useHistory();

  const [canSubmit, setSubmitValve] = useState(false);
  // const [channel, setChannel] = useState(null);

  const defaultValues = {
    tripData: {
      noOfTrips: 1,
      amountPerTrip: null,
      amount: null,
    },
  };

  const onFormValueChange = (setValue, formData) => {
    if (
      formData?.propertyType &&
      formData?.subtype &&
      formData?.address?.locality?.code &&
      formData?.tripData?.vehicleType &&
      formData?.channel &&
      formData?.tripData?.amountPerTrip
    ) {
      setSubmitValve(true);
      const pitDetailValues = formData?.pitDetail ? Object.values(formData?.pitDetail).filter((value) => value > 0) : null;
      if (formData?.pitType) {
        if (pitDetailValues === null || pitDetailValues?.length === 0) {
          setSubmitValve(true);
        } else if (isConventionalSpecticTank(formData?.pitType?.dimension) && pitDetailValues?.length >= 3) {
          setSubmitValve(true);
        } else if (!isConventionalSpecticTank(formData?.pitType?.dimension) && pitDetailValues?.length >= 2) {
          setSubmitValve(true);
        } else setSubmitValve(false);
      }
    } else {
      setSubmitValve(false);
    }
  };

  // useEffect(() => {
  //   (async () => {

  //   })();
  // }, [propertyType, subType, vehicle]);

  const onSubmit = (data) => {
    const applicationChannel = data.channel;
    const sanitationtype = data?.pitType?.code;
    const pitDimension = data?.pitDetail;
    const applicantName = data.applicationData.applicantName;
    const mobileNumber = data.applicationData.mobileNumber;
    const pincode = data?.address?.pincode;
    const street = data?.address?.street?.trim();
    const doorNo = data?.address?.doorNo?.trim();
    const slum = data?.address?.slum;
    const landmark = data?.address?.landmark?.trim();
    const noOfTrips = data.tripData.noOfTrips;
    const amount = data.tripData.amountPerTrip;
    const cityCode = data?.address?.city?.code;
    const city = data?.address?.city?.name;
    const state = data?.address?.city?.state;
    const localityCode = data?.address?.locality?.code;
    const localityName = data?.address?.locality?.name;
    const gender = data.applicationData.applicantGender;
    const paymentPreference = data?.paymentPreference ? data?.paymentPreference : "POST_PAY";
    const formData = {
      fsm: {
        citizen: {
          name: applicantName,
          mobileNumber,
          gender: gender,
        },
        tenantId: tenantId,
        sanitationtype: sanitationtype,
        source: applicationChannel.code,
        additionalDetails: {
          tripAmount: amount,
        },
        propertyUsage: data?.subtype,
        vehicleType: data?.tripData?.vehicleType?.type,
        vehicleCapacity: data?.tripData?.vehicleType?.capacity,
        pitDetail: {
          ...pitDimension,
          distanceFromRoad: data?.distanceFromRoad,
        },
        address: {
          tenantId: cityCode,
          landmark,
          doorNo,
          street,
          city,
          state,
          pincode,
          slumName: slum,
          locality: {
            code: localityCode,
            name: localityName,
          },
          geoLocation: {
            latitude: data?.address?.latitude,
            longitude: data?.address?.longitude,
          },
        },
        noOfTrips,
        paymentPreference,
      },
      workflow: null,
    };

    window.Digit.SessionStorage.set("propertyType", null);
    window.Digit.SessionStorage.set("subType", null);
    Digit.SessionStorage.set("city_property", null);
    Digit.SessionStorage.set("selected_localities", null);
    Digit.SessionStorage.set("locality_property", null);
    history.push("/digit-ui/employee/fsm/response", formData);
  };

  if (isLoading || isTripConfigLoading || isApplicantConfigLoading) {
    return <Loader />;
  }

  //MANNUALY CALLING MDMS --- FOR ANIL 

  // const configs = [...preFields, ...commonFields, ...postFields];
  const configs = [
    {
      head: "ES_TITLE_APPLICANT_DETAILS",
      body: [
        {
          label: "ES_NEW_APPLICATION_APPLICATION_CHANNEL",
          isMandatory: true,
          type: "component",
          key: "channel",
          component: "SelectChannel",
          nextStep: "applicantName",
        },
        {
          type: "component",
          key: "applicationData",
          withoutLabel: true,
          component: "SelectName",
        },
        // {
        //     "type": "component",
        //     "key": "paymentPreference",
        //     "withoutLabel": true,
        //     "component": "SelectPaymentType"
        // }
      ],
    },
    {
      head: "ES_NEW_APPLICATION_PROPERTY_DETAILS",
      body: [
        {
          label: "ES_NEW_APPLICATION_PROPERTY_TYPE",
          isMandatory: true,
          type: "component",
          route: "property-type",
          key: "propertyType",
          component: "SelectPropertyType",
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PROPERTY_LABEL",
            cardText: "CS_FILE_APPLICATION_PROPERTY_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          nextStep: "property-subtype",
        },
        {
          label: "ES_NEW_APPLICATION_PROPERTY_SUB-TYPE",
          isMandatory: true,
          type: "component",
          route: "property-subtype",
          key: "subtype",
          component: "SelectPropertySubtype",
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_LABEL",
            cardText: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          nextStep: "address",
        },
      ],
    },
    {
      head: "ES_NEW_APPLICATION_LOCATION_DETAILS",
      body: [
        {
          route: "map",
          component: "SelectGeolocation",
          nextStep: "pincode",
          hideInEmployee: true,
          key: "address",
        },
        {
          route: "pincode",
          component: "SelectPincode",
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PINCODE_LABEL",
            cardText: "CS_FILE_APPLICATION_PINCODE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
          withoutLabel: true,
          hideInEmployee: true,
          key: "address",
          nextStep: "address",
          type: "component",
        },
        {
          route: "address",
          component: "SelectAddress",
          withoutLabel: true,
          texts: {
            headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
            header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
            cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_CITY_MOHALLA_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          key: "address",
          nextStep: "check-slum",
          isMandatory: true,
          type: "component",
        },
        {
          type: "component",
          route: "check-slum",
          isMandatory: true,
          component: "CheckSlum",
          texts: {
            header: "ES_NEW_APPLICATION_SLUM_CHECK",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          key: "address",
          withoutLabel: true,
          nextStep: "slum-details",
          hideInEmployee: true,
        },
        {
          type: "component",
          route: "slum-details",
          isMandatory: true,
          component: "SelectSlumName",
          texts: {
            header: "CS_NEW_APPLICATION_SLUM_NAME",
            cardText: "CS_NEW_APPLICATION_SLUM_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          withoutLabel: true,
          key: "address",
          nextStep: "street",
        },
        {
          type: "component",
          route: "street",
          component: "SelectStreet",
          key: "address",
          withoutLabel: true,
          texts: {
            headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
            header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
            cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_STREET_DOOR_NO_LABEL",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
          nextStep: "landmark",
        },
        {
          type: "component",
          route: "landmark",
          component: "SelectLandmark",
          withoutLabel: true,
          texts: {
            headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
            header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TITLE",
            cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE[object Object]",
          },
          key: "address",
          nextStep: "pit-type",
        },
      ],
    },
    {
      head: "CS_CHECK_PIT_SEPTIC_TANK_DETAILS",
      body: [
        {
          label: "ES_NEW_APPLICATION_PIT_TYPE",
          isMandatory: false,
          type: "component",
          route: "pit-type",
          key: "pitType",
          component: "SelectPitType",
          texts: {
            header: "CS_FILE_PROPERTY_PIT_TYPE",
            cardText: "CS_FILE_PROPERTY_PIT_TYPE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
          nextStep: "tank-size",
        },
        {
          route: "tank-size",
          component: "SelectTankSize",
          isMandatory: false,
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TITLE",
            cardText: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
          type: "component",
          key: "pitDetail",
          nextStep: "select-gender",
          label: "ES_NEW_APPLICATION_PIT_DIMENSION",
        },
        //added new
        {
          type: "component",
          key: "tripData",
          withoutLabel: true,
          component: "SelectTrips",
        },
      ],
    },
    {
      head: "CS_FILE_ADDITIONAL_DETAILS",
      hideInEmployee: true,
      body: [
        {
          label: "a",
          isMandatory: true,
          type: "component",
          route: "select-trip-number",
          key: "selectTripNo",
          component: "SelectTripNo",
          hideInEmployee: true,
          texts: {
            headerCaption: "",
            header: "ES_FSM_SERVICE_REQUEST",
            cardText: "ES_FSM_SERVICE_REQUEST_TEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
            submitBarLabel: "CS_COMMON_NEXT",
            skipLabel: "CS_COMMON_SERVICE_SKIP_INFO",
          },
          nextStep: "property-type",
        },
        {
          label: "a",
          isMandatory: false,
          type: "component",
          route: "select-gender",
          hideInEmployee: true,
          key: "selectGender",
          component: "SelectGender",
          texts: {
            headerCaption: "",
            header: "CS_COMMON_CHOOSE_GENDER",
            cardText: "CS_COMMON_SELECT_GENDER",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
          nextStep: "select-payment-preference",
        },
        {
          label: "a",
          isMandatory: false,
          type: "component",
          route: "select-payment-preference",
          key: "selectPaymentPreference",
          hideInEmployee: true,
          component: "SelectPaymentPreference",
          texts: {
            headerCaption: "",
            header: "ES_FSM_PAYMENT_PREFERENCE_LABEL",
            cardText: "ES_FSM_PAYMENT_PREFERENCE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
          nextStep: null,
        },
      ],
    },
    {
      head: "Payment Details",
      body: [
        {
          type: "component",
          key: "tripData",
          withoutLabel: true,
          component: "SelectTripData",
        },
        //added new
        {
          type: "component",
          key: "paymentPreference",
          withoutLabel: true,
          component: "SelectPaymentType",
        },
        //added new
        {
          type: "component",
          key: "advancepaymentPreference",
          withoutLabel: true,
          component: "AdvanceCollection",
        },
      ],
    },
  ];

  return (
    <React.Fragment>
      <Header styles={{ paddingLeft: "4px" }}>{t("ES_TITLE_NEW_DESULDGING_APPLICATION")}</Header>
      <FormComposer
        // heading={t("ES_TITLE_NEW_DESULDGING_APPLICATION")}
        isDisabled={!canSubmit}
        label={t("ES_COMMON_APPLICATION_SUBMIT")}
        config={configs
          .filter((i) => !i.hideInEmployee)
          .map((config) => {
            return {
              ...config,
              body: config.body.filter((a) => !a.hideInEmployee),
            };
          })}
        fieldStyle={{ marginRight: 0 }}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        onFormValueChange={onFormValueChange}
        FSM_inline_style
        className="fsm"
        noBreakLine={true}
      />
    </React.Fragment>
  );
};
