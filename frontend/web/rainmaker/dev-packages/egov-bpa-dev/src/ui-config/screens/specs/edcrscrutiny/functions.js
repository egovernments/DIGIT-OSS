// import { httpRequest } from "../../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import axios from "axios";

export const fetchData = async (action, state, dispatch) => {
  const response = await getSearchResultsfromEDCR(action, state, dispatch);
  try {
    if (response && response.edcrDetail && response.edcrDetail.length > 0) {
      dispatch(prepareFinalObject("searchResults", response.edcrDetail));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.edcrDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// const getSearchResultsfromEDCR = async () => {
//   try {
//     const response = await axios.post(
//       "https://egov-dcr-galaxy.egovernments.org/edcr/rest/dcr/scrutinydetails?tenantId=pb.amritsar",
//       {
//         RequestInfo: {
//           apiId: "1",
//           ver: "1",
//           ts: "01-01-2017 01:01:01",
//           action: "create",
//           did: "jh",
//           key: "",
//           msgId: "gfcfc",
//           correlationId: "wefiuweiuff897",
//           authToken: "",
//           userInfo: {
//             id: 1,
//             tenantId: "generic"
//           }
//         }
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );
//     console.log("response", response);
//     return response;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

const getSearchResultsfromEDCR = async (action, state, dispatch) => {
  const response = {
    responseInfo: {
      apiId: "1",
      ver: "1",
      ts: "Sun Jan 01 01:01:01 IST 2017",
      resMsgId: "",
      msgId: "gfcfc",
      status: "successful"
    },
    edcrDetail: [
      {
        dxfFile:
          "https://egov-dcr-galaxy.egovernments.org/edcr/rest/dcr/downloadfile/f7d42293-ba4c-4561-ac1d-f859db16c7b4?tenantId=amritsar",
        updatedDxfFile:
          "https://egov-dcr-galaxy.egovernments.org/edcr/rest/dcr/downloadfile/9521de3c-5acc-4fb5-bbd1-877ff6d01574?tenantId=amritsar",
        planReport:
          "https://egov-dcr-galaxy.egovernments.org/edcr/rest/dcr/downloadfile/7412d60c-eaab-49b3-9e3c-6689a7fddd11?tenantId=amritsar",
        transactionNumber: "166989",
        status: "Accepted",
        edcrNumber: "DCR122019W9YHA",
        tenantId: "pb.amritsar",
        errors: null,
        planPdfs: [
          "https://egov-dcr-galaxy.egovernments.org/edcr/rest/dcr/downloadfile/f7d42293-ba4c-4561-ac1d-f859db16c7b4?tenantId=amritsar",
          "https://egov-dcr-galaxy.egovernments.org/edcr/rest/dcr/downloadfile/7412d60c-eaab-49b3-9e3c-6689a7fddd11?tenantId=amritsar"
        ],
        planDetail: {
          edcrPassed: true,
          applicationDate: 1575631461615,
          planInformation: {
            plotArea: 122.0,
            ownerName: null,
            occupancy: "Residential",
            serviceType: null,
            amenities: null,
            architectInformation: null,
            acchitectId: null,
            applicantName: "Name",
            crzZoneArea: true,
            crzZoneDesc: "NA",
            demolitionArea: 15.0,
            depthCutting: null,
            depthCuttingDesc: "NA",
            governmentOrAidedSchool: null,
            securityZone: true,
            securityZoneDesc: "NA",
            accessWidth: null,
            noOfBeds: null,
            nocToAbutSideDesc: "NA",
            nocToAbutRearDesc: "NA",
            openingOnSide: false,
            openingOnSideBelow2mtsDesc: "NA",
            openingOnSideAbove2mtsDesc: "NA",
            openingOnRearBelow2mtsDesc: "NA",
            openingOnRearAbove2mtsDesc: "NA",
            openingOnRear: false,
            parkingToMainBuilding: false,
            noOfSeats: 0,
            noOfMechanicalParking: 0,
            singleFamilyBuilding: null,
            reSurveyNo: null,
            revenueWard: null,
            desam: null,
            village: null,
            zoneWise: null,
            landUseZone: "RESIDENTIAL",
            leaseHoldLand: "NO",
            roadWidth: 3.0,
            roadLength: 0,
            typeOfArea: "OLD",
            depthOfPlot: 9.0,
            widthOfPlot: 11.0,
            buildingNearMonument: "YES",
            buildingNearGovtBuilding: "YES",
            nocNearMonument: "YES",
            nocNearAirport: "YES",
            nocNearDefenceAerodomes: "YES",
            nocStateEnvImpact: "YES",
            nocRailways: "YES",
            nocCollectorGvtLand: "YES",
            nocIrrigationDept: "YES",
            nocFireDept: "NA",
            buildingNearToRiver: "YES",
            barrierFreeAccessForPhyChlngdPpl: "YES",
            provisionsForGreenBuildingsAndSustainability: "YES",
            fireProtectionAndFireSafetyRequirements: "NA",
            plotNo: "82/1 (TP:82/100)",
            khataNo: "21 (EW:56)",
            mauza: "MUSHARI",
            district: "MITHUNPURA",
            rwhDeclared: "YES"
          }
        }
      }
    ]
  };

  return response;
};
