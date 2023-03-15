import { PaymentService } from "../../elements/Payment";
import { FSMService } from "../../elements/FSM";
import { MdmsService } from "../../../services/elements/MDMS";
import DsoDetails from "./DsoDetails";
import { getPropertyTypeLocale, getPropertySubtypeLocale, getVehicleType } from "../../../utils/fsm";

const displayPitDimension = (pitDeminsion) => {
  const result = [];
  if (pitDeminsion.length) {
    result.push(`${pitDeminsion.length}m`);
  }
  if (pitDeminsion.width) {
    result.push(`${pitDeminsion.width}m`);
  }
  if (pitDeminsion.diameter) {
    result.push(`${pitDeminsion.diameter}m`);
  }
  if (pitDeminsion.height) {
    result.push(`${pitDeminsion.height}m`);
  }
  return result.join(" x ");
};

const getPitDimensionCaption = (sanitationtype, diameter, length, t) => {
  if (diameter && diameter > 0) return `(${t("CS_COMMON_DIAMETER")} x ${t("CS_COMMON_DEPTH")})`;
  if (length && length > 0) return `(${t("CS_COMMON_LENGTH")} x ${t("CS_COMMON_BREADTH")} x ${t("CS_COMMON_DEPTH")})`;
};

const displayServiceDate = (timeStamp) => {
  if (timeStamp === 0) return "N/A";
  const date = new Date(timeStamp);
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
};

export const Search = {
  all: async (tenantId, filters = {}) => {
    const response = await FSMService.search(tenantId, { ...filters });
    return response;
  },

  application: async (tenantId, filters = {}) => {
    const response = await FSMService.search(tenantId, { ...filters });
    return response.fsm[0];
  },

  applicationDetails: async (t, tenantId, applicationNos, userType) => {
    const filter = { applicationNos };
    let dsoDetails = {};
    let vehicle = {};
    const response = await Search.application(tenantId, filter);
    let receivedPayment = response?.additionalDetails?.receivedPayment;
    if (response?.dsoId) {
      const dsoFilters = { ids: response.dsoId, vehicleIds: response?.vehicleId };
      [dsoDetails] = await DsoDetails(tenantId, dsoFilters);

      if (response?.vehicleId) {
        vehicle = dsoDetails.vehicles.find((vehicle) => vehicle.id === response.vehicleId);
      }
    }

    let paymentPreference = response?.paymentPreference;

    let slumLabel = "";
    if (response?.address?.slumName && response?.address?.locality?.code && response?.tenantId) {
      const slumData = await MdmsService.getSlumLocalityMapping(response?.tenantId, "FSM", "Slum");
      if (slumData[response?.address?.locality?.code]) {
        slumLabel = slumData[response?.address?.locality?.code].find((slum) => slum?.code === response?.address?.slumName);
      } else {
        const slumDataArray = Object.values(slumData);
        for (let i = 0; i < slumDataArray.length; i++) {
          const slumFound = slumDataArray[i].find((slum) => slum.code === response?.address?.slumName);
          if (slumFound) {
            slumLabel = slumFound;
          }
        }
      }
    }
    const slumName = slumLabel ? slumLabel.i18nKey : "N/A";

    const state = Digit.ULBService.getStateId();
    const vehicleMenu = await MdmsService.getVehicleType(state, "Vehicle", "VehicleType");
    const _vehicle = vehicleMenu?.find((vehicle) => response?.vehicleType === vehicle?.code);

    const vehicleMake = _vehicle?.i18nKey;
    const vehicleCapacity = _vehicle?.capacity;

    const demandDetails = await PaymentService.demandSearch(tenantId, applicationNos, "FSM.TRIP_CHARGES");
    const amountPerTrip =
      response?.additionalDetails && response?.additionalDetails.tripAmount
        ? response.additionalDetails.tripAmount
        : demandDetails?.Demands[0]?.demandDetails[0]?.taxAmount || "N/A";
    // const totalAmount = response?.noOfTrips === 0 || amountPerTrip === "N/A" ? "N/A" : response?.noOfTrips * Number(amountPerTrip);
    const totalAmount = demandDetails?.Demands[0]?.demandDetails?.map((detail) => detail?.taxAmount)?.reduce((a, b) => a + b) || "N/A";
    const employeeResponse = [
      {
        title: "ES_TITLE_APPLICATION_DETAILS",
        values: [
          { title: "CS_FILE_DESLUDGING_APPLICATION_NO", value: response?.applicationNo },
          { title: "ES_APPLICATION_CHANNEL", value: `ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${response?.source}` },
        ],
      },
      {
        title: t("ES_TITLE_APPLICANT_DETAILS"),
        values: [
          { title: "ES_APPLICATION_DETAILS_APPLICANT_NAME", value: response?.citizen?.name },
          { title: "ES_APPLICATION_DETAILS_APPLICANT_MOBILE_NO", value: response?.citizen?.mobileNumber },
          response?.paymentPreference && {
            title: "ES_FSM_PAYMENT_PREFERENCE",
            value: response?.paymentPreference ? `ES_ACTION_${response?.paymentPreference}` : "N/A",
          },
        ],
      },
      {
        title: "ES_APPLICATION_DETAILS_PROPERTY_DETAILS",
        values: [
          { title: "ES_APPLICATION_DETAILS_PROPERTY_TYPE", value: getPropertyTypeLocale(response?.propertyUsage) },
          { title: "ES_APPLICATION_DETAILS_PROPERTY_SUB-TYPE", value: getPropertySubtypeLocale(response?.propertyUsage) },
        ],
      },
      {
        title: "ES_APPLICATION_DETAILS_LOCATION_DETAILS",
        values: [
          {
            title: "ES_APPLICATION_DETAILS_LOCATION_LOCALITY",
            value: `${response?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${response?.address?.locality?.code}`,
          },
          { title: "ES_APPLICATION_DETAILS_LOCATION_CITY", value: response?.address?.city },
          { title: "ES_APPLICATION_DETAILS_LOCATION_PINCODE", value: response?.address?.pincode },
          { title: "PT_PROPERTY_ADDRESS_STREET_NAME", value: response?.address?.street },
          { title: "PT_PROPERTY_ADDRESS_HOUSE_NO", value: response?.address?.doorNo },
          { title: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LANDMARK_LABEL", value: response?.address?.landmark },
          { title: "CS_FILE_APPLICATION_PROPERTY_LOCATION_SLUM_LABEL", value: slumName },
          {
            title: "ES_APPLICATION_DETAILS_LOCATION_GEOLOCATION",
            value:
              response?.address?.geoLocation?.latitude && response?.address?.geoLocation?.longitude
                ? Digit.Utils.getStaticMapUrl(response?.address?.geoLocation?.latitude, response?.address?.geoLocation?.longitude)
                : "N/A",
            map: true,
            child:
              response?.address?.geoLocation?.latitude && response?.address?.geoLocation?.longitude
                ? {
                    element: "img",
                    src: Digit.Utils.getStaticMapUrl(response?.address?.geoLocation?.latitude, response?.address?.geoLocation?.longitude),
                  }
                : null,
          },
        ],
      },
      {
        title: "CS_CHECK_PIT_SEPTIC_TANK_DETAILS",
        values: [
          {
            title: "ES_APPLICATION_DETAILS_PIT_TYPE",
            value: !!response?.sanitationtype ? `PITTYPE_MASTERS_${response?.sanitationtype}` : "",
          },
          {
            title: "ES_APPLICATION_DETAILS_PIT_DIMENSION",
            value: displayPitDimension({
              length: response?.pitDetail?.length,
              width: response?.pitDetail?.width,
              height: response?.pitDetail?.height,
              diameter: response?.pitDetail?.diameter,
            }),
            caption: getPitDimensionCaption(response?.sanitationtype, response?.pitDetail?.diameter, response?.pitDetail?.length, t),
          },
          // {
          //   title: t("ES_NEW_APPLICATION_DISTANCE_FROM_ROAD"),
          //   value: response?.pitDetail?.distanceFromRoad,
          // },
          { title: "ES_APPLICATION_DETAILS_PAYMENT_NO_OF_TRIPS", value: response?.noOfTrips === 0 ? "N/A" : response?.noOfTrips },
          {
            title: "ES_APPLICATION_DETAILS_AMOUNT_PER_TRIP",
            value: amountPerTrip === "N/A" ? "N/A" : "₹ " + amountPerTrip,
          },
          {
            title: "ES_PAYMENT_DETAILS_TOTAL_AMOUNT",
            value: totalAmount === "N/A" ? (amountPerTrip === "N/A" ? "N/A" : "₹ " + response?.noOfTrips * amountPerTrip) : "₹ " + totalAmount,
          },
          { title: "ES_PAYMENT_DETAILS_ADV_AMOUNT", value: response?.advanceAmount === null ? "N/A" : "₹ " + response?.advanceAmount },
        ],
      },
      {
        title: "ES_APPLICATION_DETAILS_DSO_DETAILS",
        values: [
          { title: "ES_APPLICATION_DETAILS_ASSIGNED_DSO", value: dsoDetails?.displayName || "N/A" },
          // { title: "ES_APPLICATION_DETAILS_VEHICLE_MAKE", value: vehicleMake || "N/A" },
          { title: "ES_APPLICATION_DETAILS_VEHICLE_NO", value: vehicle?.registrationNumber || "N/A" },
          { title: "ES_APPLICATION_DETAILS_VEHICLE_CAPACITY", value: response?.vehicleCapacity || "N/A" },
          { title: "ES_APPLICATION_DETAILS_POSSIBLE_SERVICE_DATE", value: displayServiceDate(response?.possibleServiceDate) || "N/A" },
          { title: "ES_APPLICATION_DETAILS_AMOUNT_RECEIVED", value: receivedPayment || "N/A" },
        ],
      },
    ];

    if (userType !== "CITIZEN" && userType !== "DSO") {
      employeeResponse.map((data) => {
        if (data.title === "ES_TITLE_APPLICANT_DETAILS" || data.title === "Applicant Details") {
          data.values.push({ title: "COMMON_APPLICANT_GENDER", value: response?.citizen?.gender });
        }
      });
    }

    if (userType !== "CITIZEN")
      return {
        tenantId: response.tenantId,
        applicationDetails: employeeResponse,
        additionalDetails: response?.additionalDetails,
        totalAmount: totalAmount,
      };

    const citizenResp = employeeResponse.reduce((arr, curr) => {
      return arr.concat(curr.values.filter((i) => i !== null));
    }, []);

    const citizenResponse = citizenResp.map((detail) => {
      // detail.title = detail.title?.replace("ES_", "CS_");
      if (!detail.map) return detail;
      delete detail.value;
      return detail;
    });

    return {
      tenantId: response.tenantId,
      applicationDetails: citizenResponse,
      pdfData: { ...response, amountPerTrip, totalAmount, vehicleMake, vehicleCapacity, slumName, dsoDetails },
    };
  },

  allVehicles: (tenantId, filters) => {
    return FSMService.vehicleSearch(tenantId, filters);
  },
  allVehiclesWithDSO: async (tenantId, filters) => {
    const response = await FSMService.vehicleSearch(tenantId, filters);
    const { vehicleTrip } = response;
    let result = vehicleTrip;
    if (vehicleTrip.length > 0) {
      const ownerIds = response.vehicleTrip.map((trip) => trip.tripOwnerId);
      const vendorsResponse = await FSMService.vendorSearch(tenantId, { ownerIds: ownerIds.join(",") });
      const vendorOwnerKey = vendorsResponse.vendor.reduce((acc, vendor) => {
        return { ...acc, [vendor.ownerId]: vendor };
      }, {});
      result = Search.combineResponse(vehicleTrip, vendorOwnerKey);
    }
    return {
      ...response,
      vehicleTrip: result,
    };
  },

  combineResponse: (vehicleTrip, vendorOwnerKey) => {
    return vehicleTrip
      .map((trip) => {
        if (vendorOwnerKey[trip.tripOwnerId]) {
          return { ...trip, dsoName: vendorOwnerKey[trip.tripOwnerId].name };
        } else return { ...trip };
      })
      .filter((e) => e.tripOwnerId);
  },

  applicationWithBillSlab: async (t, tenantId, applicationNos) => {
    const app = await Search.applicationDetails(t, tenantId, applicationNos);
  },
};
