import { getPropertyTypeLocale, getPropertySubtypeLocale, getVehicleType } from "./utils";

const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

const getSlumName = (application, t) => {
  if (application?.slumName) {
    return t(application.slumName);
  }
  return application?.slum?.i18nKey ? t(`${application?.slum?.i18nKey}`) : "N/A";
};

const getApplicationVehicleCapacity = (vehicleCapacity) => {
  if (!vehicleCapacity) return "N/A";
  return vehicleCapacity;
};

const getAmountPerTrip = (amountPerTrip) => {
  if (!amountPerTrip) return "N/A";
  return amountPerTrip !== 0 ? `₹ ${amountPerTrip}` : "N/A";
};

const getTotalAmount = (totalAmount) => {
  if (!totalAmount) return "N/A";
  return totalAmount !== 0 ? `₹ ${totalAmount}` : "N/A";
};

const getAdvanceAmount = (advanceAmount) => {
  if (advanceAmount === null) return "N/A";
  return `₹ ${advanceAmount}`;
};

const getPDFData = (application, tenantInfo, t) => {
  const { additionalDetails } = application;

  const amountPerTrip = additionalDetails?.tripAmount;
  const totalAmount = amountPerTrip * application?.noOfTrips;
  const advanceAmountDue = application?.advanceAmount;

  return {
    t: t,
    tenantId: tenantInfo?.code,
    name: `${t(tenantInfo?.i18nKey)} ${t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`)}`,
    email: tenantInfo?.emailId,
    phoneNumber: tenantInfo?.contactNumber,
    heading: t("PDF_HEADER_DESLUDGING_REQUEST_ACKNOWLEDGEMENT"),
    details: [
      {
        title: t("CS_TITLE_APPLICATION_DETAILS"),
        values: [
          { title: t("CS_MY_APPLICATION_APPLICATION_NO"), value: application?.applicationNo },
          {
            title: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
            value: Digit.DateUtils.ConvertTimestampToDate(application?.auditDetails?.createdTime, "dd/MM/yyyy"),
          },
          {
            title: t("CS_APPLICATION_DETAILS_APPLICATION_CHANNEL"),
            value: t(`ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${application?.source}`) || "N/A",
          },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_APPLICANT_DETAILS"),
        values: [
          { title: t("CS_APPLICATION_DETAILS_APPLICANT_NAME"), value: application?.citizen?.name || "N/A" },
          { title: t("CS_APPLICATION_DETAILS_APPLICANT_MOBILE"), value: application?.citizen?.mobileNumber || "N/A" },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_PROPERTY_DETAILS"),
        values: [
          { title: t("CS_APPLICATION_DETAILS_PROPERTY_TYPE"), value: t(getPropertyTypeLocale(application?.propertyUsage)) || "N/A" },
          { title: t("CS_APPLICATION_DETAILS_PROPERTY_SUB_TYPE"), value: t(getPropertySubtypeLocale(application?.propertyUsage)) || "N/A" },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_PROPERTY_LOCATION_DETAILS"),
        values: [
          { title: t("CS_APPLICATION_DETAILS_PINCODE"), value: application?.address?.pincode || "N/A" },
          { title: t("CS_APPLICATION_DETAILS_CITY"), value: application?.address?.city || "N/A" },
          {
            title: t("CS_APPLICATION_DETAILS_MOHALLA"),
            value: t(`${application?.tenantId?.toUpperCase().split(".").join("_")}_REVENUE_${application?.address?.locality?.code}`) || "N/A",
          },
          {
            title: t("CS_APPLICATION_DETAILS_SLUM_NAME"),
            value: getSlumName(application, t),
          },
          { title: t("CS_APPLICATION_DETAILS_STREET"), value: application?.address?.street || "N/A" },
          { title: t("CS_APPLICATION_DETAILS_DOOR_NO"), value: application?.address?.doorNo || "N/A" },
          { title: t("CS_APPLICATION_DETAILS_LANDMARK"), value: application?.address?.landmark || "N/A" },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_PIT_DETAILS"),
        values: [
          {
            title: t("CS_APPLICATION_DETAILS_PIT_TYPE"),
            value: application?.sanitationtype ? t("PITTYPE_MASTERS_" + application?.sanitationtype) : "N/A",
          },
          {
            title: t("CS_APPLICATION_DETAILS_DIMENSION"),
            // NOTE: value have too much whitespace bcz we want the text after whitespace should go to next line, so pls don't remove whitespace
            value:
              application?.pitDetail?.height && application?.pitDetail?.height !== null
                ? application?.pitDetail?.length
                  ? `${application?.pitDetail?.length}m * ${application?.pitDetail?.width}m * ${
                      application?.pitDetail?.height
                    }m                                  (${t("CS_COMMON_LENGTH")} x ${t("CS_COMMON_BREADTH")} x ${t("CS_COMMON_DEPTH")})`
                  : `${application?.pitDetail?.diameter}m * ${application?.pitDetail?.height}m                                  (${t(
                      "CS_COMMON_DIAMETER"
                    )} x ${t("CS_COMMON_DEPTH")})`
                : "N/A",
          },
          {
            title: t("ES_APPLICATION_DETAILS_VEHICLE_CAPACITY"),
            value: getApplicationVehicleCapacity(application?.vehicleCapacity),
          },
          { title: t("CS_APPLICATION_DETAILS_TRIPS"), value: application?.noOfTrips || "N/A" },
          {
            title: t("CS_APPLICATION_DETAILS_AMOUNT_PER_TRIP"),
            value: getAmountPerTrip(amountPerTrip),
          },
          {
            title: t("CS_APPLICATION_DETAILS_AMOUNT_DUE"),
            value: getTotalAmount(totalAmount),
          },
          {
            title: t("CS_APPLICATION_DETAILS_ADV_AMOUNT_DUE"),
            value: getAdvanceAmount(advanceAmountDue),
          },
        ],
      },
    ],
  };
};

export default getPDFData;
