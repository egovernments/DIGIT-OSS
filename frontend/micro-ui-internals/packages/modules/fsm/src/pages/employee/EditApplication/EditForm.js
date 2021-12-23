import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { getVehicleType } from "../../../utils";

const isConventionalSpecticTank = (tankDimension) => tankDimension === "lbd";

const EditForm = ({ tenantId, applicationData, channelMenu, vehicleMenu, sanitationMenu }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [canSubmit, setSubmitValve] = useState(false);
  const stateId = tenantId.split(".")[0];
  const { data: commonFields, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "CommonFieldsConfig");
  const { data: preFields, isLoading: isApplicantConfigLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PreFieldsConfig");
  const { data: postFields, isLoading: isTripConfigLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PostFieldsConfig");

  const defaultValues = {
    channel: channelMenu.filter((channel) => channel.code === applicationData.source)[0],
    applicationData: {
      applicantName: applicationData.citizen.name,
      mobileNumber: applicationData.citizen.mobileNumber,
    },
    tripData: {
      noOfTrips: applicationData.noOfTrips,
      amountPerTrip: applicationData.additionalDetails.tripAmount,
      amount: applicationData.noOfTrips * applicationData.additionalDetails.tripAmount || undefined,
      vehicleType: vehicleMenu
        .filter((vehicle) => vehicle?.code === applicationData?.vehicleType)
        .map((vehicle) => ({ ...vehicle, label: getVehicleType(vehicle, t) }))[0],
    },
    propertyType: applicationData.propertyUsage.split(".")[0],
    subtype: applicationData.propertyUsage,
    address: {
      pincode: applicationData.address.pincode,
      locality: {
        ...applicationData.address.locality,
        i18nkey: `${applicationData.tenantId.toUpperCase().split(".").join("_")}_REVENUE_${applicationData.address.locality.code}`,
      },
      slum: applicationData.address.slumName,
      street: applicationData.address.street,
      doorNo: applicationData.address.doorNo,
      landmark: applicationData.address.landmark,
    },
    pitType: sanitationMenu.filter((type) => type.code === applicationData.sanitationtype)[0],
    pitDetail: applicationData.pitDetail,
  };

  const onFormValueChange = (setValue, formData) => {
    // // setNoOfTrips(formData?.noOfTrips || 1);

    // (async () => {
    //   // console.log("abcd1",vehicle, formData?.propertyType , formData?.subtype)

    //   if (formData?.propertyType && formData?.subtype && formData?.address && vehicle?.code && !kill) {
    //     const { capacity } = vehicle;
    //     // console.log("find bill slab form data", formData)
    //     const { slum: slumDetails } = formData.address;
    //     const slum = slumDetails ? "YES" : "NO";
    //     const billingDetails = await Digit.FSMService.billingSlabSearch(tenantId, {
    //       propertyType: formData?.subtype,
    //       capacity,
    //       slum,
    //     });

    //     const billSlab = billingDetails?.billingSlab?.length && billingDetails?.billingSlab[0];
    //     if (billSlab?.price) {
    //       setKill(true);
    //       console.log("find bill slab here", billSlab.price);
    //       setValue("amountPerTrip", billSlab.price);
    //       setValue("amount", billSlab.price * formData.noOfTrips);
    //     }
    //   }
    // })();
    // // console.log("abcd2",vehicle, formData?.propertyType , formData?.subtype)
    if (
      formData?.propertyType &&
      formData?.subtype &&
      formData?.address?.locality?.code &&
      formData?.tripData?.vehicleType &&
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
    // const state = data?.address?.city?.state;
    const localityCode = data?.address?.locality?.code;
    const localityName = data?.address?.locality?.name;
    const propertyUsage = data?.subtype;
    const { height, length, width, diameter } = pitDimension;

    const formData = {
      ...applicationData,
      sanitationtype: sanitationtype,
      source: applicationChannel.code,
      additionalDetails: {
        ...applicationData.additionalDetails,
        tripAmount: amount,
      },
      propertyUsage,
      vehicleType: data.tripData.vehicleType.code,
      noOfTrips,
      pitDetail: {
        ...applicationData.pitDetail,
        distanceFromRoad: data.distanceFromRoad,
        height,
        length,
        width,
        diameter,
      },
      address: {
        ...applicationData.address,
        tenantId: cityCode,
        landmark,
        doorNo,
        street,
        pincode,
        slumName: slum,
        locality: {
          ...applicationData.address.locality,
          code: localityCode,
          name: localityName,
        },
        geoLocation: {
          ...applicationData.address.geoLocation,
          latitude: data?.address?.latitude ? data?.address?.latitude : applicationData.address.geoLocation.latitude,
          longitude: data?.address?.longitude ? data?.address?.longitude : applicationData.address.geoLocation.longitude,
        },
      },
    };

    delete formData["responseInfo"];

    window.Digit.SessionStorage.set("propertyType", null);
    window.Digit.SessionStorage.set("subType", null);
    Digit.SessionStorage.set("city_property", null);
    Digit.SessionStorage.set("selected_localities", null);
    Digit.SessionStorage.set("locality_property", null);
    // console.log("find form data here", formData);
    history.replace("/digit-ui/employee/fsm/response", {
      applicationData: formData,
      key: "update",
      action: "SUBMIT",
    });
  };

  if (isLoading || isTripConfigLoading || isApplicantConfigLoading) {
    return <Loader />;
  }

  const configs = [...preFields, ...commonFields, ...postFields];

  return (
    <FormComposer
      heading={t("ES_TITLE_MODIFY_DESULDGING_APPLICATION")}
      isDisabled={!canSubmit}
      label={t("ES_FSM_APPLICATION_UPDATE")}
      config={configs.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      fieldStyle={{ marginRight: 0 }}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      onFormValueChange={onFormValueChange}
    />
  );
};

export default EditForm;
