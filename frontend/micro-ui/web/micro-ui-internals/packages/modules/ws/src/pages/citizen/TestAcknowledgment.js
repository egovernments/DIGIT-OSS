import React from "react"
import { useTranslation } from "react-i18next";

const TestAcknowledgment = () => {

    const getPDFData = (application, t) => {
        // const { address, additionalDetails } = application;
      
        // const amountPerTrip = application?.amountPerTrip || additionalDetails?.tripAmount || JSON.parse(address?.additionalDetails)?.tripAmount;
        // const totalAmount = application?.totalAmount || amountPerTrip * application?.noOfTrips;
        const tenantInfo = {
                "i18nKey": "TENANT_TENANTS_PB_AMRITSAR",
                "code": "pb.amritsar",
                "name": "Amritsar",
                "description": "Amritsar",
                "pincode": [
                  143001,
                  143002,
                  143003,
                  143004,
                  143005
                ],
                "logoId": "https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb.amritsar/logo.png",
                "imageId": "/pb-egov-assets/pb.amritsar/logo.png",
                "domainUrl": "www.amritsarcorp.com",
                "type": "CITY",
                "twitterUrl": null,
                "facebookUrl": null,
                "emailId": "support.amritsar@gmail.com",
                "OfficeTimings": {
                  "Mon - Fri": "9.00 AM - 6.00 PM"
                },
                "city": {
                  "name": "Amritsar",
                  "localName": "Amritsar",
                  "districtCode": "1",
                  "districtName": "Amritsar",
                  "districtTenantCode": "pb.amritsar",
                  "regionName": "Amritsar Region",
                  "ulbGrade": "MC 1",
                  "longitude": 74.8723,
                  "latitude": 31.634,
                  "shapeFileLocation": null,
                  "captcha": null,
                  "code": "107",
                  "regionCode": "1",
                  "municipalityName": "Amritsar",
                  "ddrName": "Amritsar District"
                },
                "address": "Municipal Corporation Amritsar, C Block, Ranjit Avenue, Amritsar, Punjab",
                "contactNumber": "0181-2227014"
        }
        return {
        //   t: t,
        //   tenantId: tenantInfo?.code,
          name: `${t(tenantInfo?.i18nKey)} ${t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`)}`,
          email: tenantInfo?.emailId,
          phoneNumber: tenantInfo?.contactNumber,
          heading: t("WS_NEW_WATER_CONNECTION"),
          breakPageLimit: 4,
          details: [
            {
              title: t("CS_TITLE_APPLICATION_DETAILS"),
              values: [
                { title: t("WS_COMMON_APPLICATION_NO_LABEL"), value: "WS_AP/107/2021-22/250238" },
              ],
            },
            {
              title: t("WS_COMMON_PROPERTY_DETAILS"),
              values: [
                { title: t("WS_PROPERTY_ID_LABEL"), value: "PB-PT-2022-02-24-026486" || "N/A" },
                { title: t("WS_PROPERTY_TYPE_LABEL"), value: "Flat/Part of the building" || "N/A" },
                { title: t("WS_PROPERTY_USAGE_TYPE_LABEL"), value: "Residential" || "N/A" },
                { title: t("WS_PROPERTY_SUB_USAGE_TYPE_LABEL"), value: "N/A" },
                { title: t("WS_PROP_DETAIL_PLOT_SIZE_LABEL"), value: "2112" || "N/A" },
                { title: t("WS_PROPERTY_NO_OF_FLOOR_LABEL"), value: "1" || "N/A" },
                { title: t("WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC"), value: "N/A" },
              ],
            },
            {
              title: t("WS_COMMON_PROP_LOC_DETAIL_HEADER"),
              values: [
                { title: t("WS_PROP_DETAIL_CITY"), value: "Amritsar" },
                { title: t("WS_PROP_DETAIL_DHNO"), value: "N/A" },
                { title: t("WS_PROP_DETAIL_BUILD_NAME_LABEL"), value: "N/A" },
                { title: t("WS_PROP_DETAIL_STREET_NAME"), value: "N/A" },
                { title: t("WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"), value: "Ajit Nagar - Area1" },
                { title: t("WS_PROP_DETAIL_DHNO"), value: "143001" },
              ],
            },
            {
              title: t("WS_TASK_PROP_OWN_HEADER"),
              values: [
                  
                { title: t("Owner - 1"), value: "" },
                { title: t("WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"), value: "7878787878" || "N/A" },
                { title: t("WS_MYCONNECTIONS_OWNER_NAME"), value: "OWNER NAME" || "N/A" },
                {
                  title: t("WS_OWNER_DETAILS_EMAIL_LABEL"),
                  value: "N/A",
                },
                {
                  title: t("WS_OWN_DETAIL_GENDER_LABEL"),
                  value: "Male",
                },
                { title: t("WS_OWN_DETAIL_DOB_LABEL"), value: "N/A" },
                { title: t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"), value: "N/A" },
                { title: t("WS_OWN_DETAIL_RELATION_LABEL"), value: "Husband" },
                { title: t("WS_CONN_HOLDER_OWN_DETAIL_CROSADD"), value: "Ajit Nagar - Area1, Amritsar, 143001" },
                { title: t("WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"), value: "None" },
              ],
            },
            {
              title: t("WS_COMMON_CONNECTION_DETAILS"),
              values: [
                {
                  title: t("WS_APPLY_FOR"),
                  value: "Water",
                },
                {
                  title: t("WS_CONN_DETAIL_NO_OF_TAPS"),
                  value: "12",
                },
                {
                  title: t("WS_CONN_DETAIL_PIPE_SIZE"),
                  value: "0.25",
                }
              ],
            },
            {
              title: t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"),
              values: [
                {
                  title: t("WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS"),
                  value: "Yes",
                }
              ],
            },
            {
              title: t("WS_COMMON_DOCS"),
              values: [
                {
                  title: t("WS_OWNER.IDENTITYPROOF"),
                  value: "ANXgJeMOAJ.pdf",
                },
                {
                  title: t("WS_OWNER.ADDRESSPROOF"),
                  value: "ANXgJeMOAJ.pdf",
                },
                {
                  title: t("OWNER.ADDRESSPROOF.ELECTRICITYBILL"),
                  value: "ANXgJeMOAJ.pdf",
                },
                {
                  title: t("PLUMBER_REPORT_DRAWING"),
                  value: "ANXgJeMOAJ.pdf",
                },
              ],
            },
            {
              title: t("WS_COMMON_ADDN_DETAILS"),
              values: [
                {
                  title: t("WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL"),
                  value: "NA",
                },
                {
                  title: t("WS_SERV_DETAIL_NO_OF_TAPS"),
                  value: "NA",
                },
                {
                  title: t("WS_SERV_DETAIL_WATER_SOURCE"),
                  value: "NA",
                },
                {
                  title: t("WS_SERV_DETAIL_WATER_SUB_SOURCE"),
                  value: "NA",
                },
                {
                  title: t("WS_SERV_DETAIL_PIPE_SIZE"),
                  value: "NA",
                },
              ],
            },
            {
              title: t("WS_COMMON_PLUMBER_DETAILS"),
              values: [
                {
                  title: t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"),
                  value: "NA",
                },
                {
                  title: t("WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"),
                  value: "NA",
                },
                {
                  title: t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"),
                  value: "NA",
                },
                {
                  title: t("WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"),
                  value: "NA",
                },
              ],
            },
            {
              title: t("WS_ROAD_CUTTING_CHARGE"),
              values: [
                {
                  title: t("WS_ADDN_DETAIL_ROAD_TYPE"),
                  value: "NA",
                },
                {
                  title: t("WS_ADDN_DETAILS_AREA_LABEL"),
                  value: "NA",
                }
              ],
            },
            {
              title: t("WS_ACTIVATION_DETAILS"),
              values: [
                {
                  title: t("WS_SERV_DETAIL_CONN_EXECUTION_DATE"),
                  value: "NA",
                },
                {
                  title: t("WS_SERV_DETAIL_METER_ID"),
                  value: "NA",
                },
                {
                  title: t("WS_ADDN_DETAIL_METER_INSTALL_DATE"),
                  value: "NA",
                },
                {
                  title: t("WS_ADDN_DETAILS_INITIAL_METER_READING"),
                  value: "NA",
                },
              ],
            },
          ],
        };
    };
    const { t } = useTranslation();

    const handleDownloadPdf = () => {
        // const [applicationDetails, ...rest] = data;
        // const tenantInfo = tenants.find((tenant) => tenant.code === applicationDetails.tenantId);
        // const data = getPDFData({ ...applicationDetails, slum }, tenantInfo, t);
        const data = getPDFData({}, t);
        Digit.Utils.pdf.generate(data);
      };

    return <div>
        Test Acknowlwdgment
        <br/>
        <button onClick={handleDownloadPdf}>Print</button>
    </div>
}

export default TestAcknowledgment