import React, { useEffect, useState } from "react";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { getVehicleType } from "../../../utils";

const TripDetails = (vehicleMenu, vehicle, setVehicle) => {
  const { t } = useTranslation();

  return {
    head: "",
    body: [
      {
        label: t("ES_NEW_APPLICATION_LOCATION_VEHICLE_REQUESTED"),
        type: "dropdown",
        populators: (
          <Dropdown
            option={vehicleMenu?.map((vehicle) => ({ ...vehicle, label: getVehicleType(vehicle, t) }))}
            optionKey="label"
            id="vehicle"
            selected={vehicle}
            select={setVehicle}
            t={t}
          />
        ),
      },
      {
        label: t("ES_NEW_APPLICATION_PAYMENT_NO_OF_TRIPS"),
        type: "text",
        populators: {
          name: "noOfTrips",
          error: t("ES_NEW_APPLICATION_NO_OF_TRIPS_INVALID"),
          validation: { required: true },
          // defaultValue: 1
          // defaultValue: customizationConfig && Object.keys(customizationConfig).length > 0 ? customizationConfig?.noOfTrips?.default : 1,
        },
        disable: true,
        // disable: customizationConfig ? !customizationConfig?.noOfTrips?.override : true,
      },
      // {
      //   label: t("ES_NEW_APPLICATION_AMOUNT_PER_TRIP"),
      //   type: "text",
      //   populators: {
      //     name: "amountPerTrip",
      //     error: t("ES_NEW_APPLICATION_AMOUNT_INVALID"),
      //     validation: { required: true },
      //     // defaultValue: vehicle?.amount,
      //   },
      //   disable: true,
      //   // disable: customizationConfig ? !customizationConfig["additionalDetails.tripAmount"]?.override : true,
      // },
      // {
      //   label: t("ES_PAYMENT_DETAILS_TOTAL_AMOUNT"),
      //   type: "text",
      //   populators: {
      //     name: "amount",
      //     validation: { required: true },
      //     // defaultValue: paymentAmount,
      //   },
      //   disable: true,
      // },
    ],
  };
};

export default TripDetails;
