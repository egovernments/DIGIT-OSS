import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import msevaLogo from "egov-ui-kit/assets/images/pblogo.png";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generateAcknowledgementForm = (role, details, generalMDMSDataById, receiptImageUrl, isEmployeeReceipt) => {
  let data;
  let { owners, address, propertyDetails,header } = details;
  let dateArray=new Date(propertyDetails[0].assessmentDate).toDateString().split(' ');
  let assessmentDate=dateArray[2]+'-'+dateArray[1]+'-'+dateArray[3];
  let tableborder = {
    hLineColor: function (i, node) {
      return "#979797";
    },
    vLineColor: function (i, node) {
      return "#979797";
    },
    hLineWidth: function (i, node) {
      return 0.5;
    },
    vLineWidth: function (i, node) {
      return 0.5;
    },
  };

  const transform = (value, masterName) => {
    if (value) {
      return generalMDMSDataById && generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][value].name : "NA";
    } else {
      return "NA";
    }
  };

  switch (role) {
    case "pt-reciept-citizen":
      // let floorData = propertyDetails[0].noOfFloors || 1;

      // data for floor details
      let getFloorDetails = () => {
        let bodyData = [];
        let { units, propertySubType } = propertyDetails[0];
        let dataRow = [];
        if (units && units.length) {
          dataRow.push({ text: "Floor", style: "receipt-assess-table-header" });
          dataRow.push({ text: "Usage Type", style: "receipt-assess-table-header" });
          dataRow.push({ text: "Sub Usage Type", style: "receipt-assess-table-header" });
          dataRow.push({ text: "Occupancy", style: "receipt-assess-table-header" });
          dataRow.push({ text: "Built Area/Total Annual Rent(sq yards)", style: "receipt-assess-table-header" });
          bodyData.push(dataRow);
          units &&
            units.map((unit) => {
              dataRow = [];
              dataRow.push(transform(unit.floorNo, "Floor"));
              dataRow.push(
                transform(
                  unit.usageCategoryMajor === "NONRESIDENTIAL" ? unit.usageCategoryMinor : unit.usageCategoryMajor,
                  unit.usageCategoryMajor === "NONRESIDENTIAL" ? "UsageCategoryMinor" : "UsageCategoryMajor"
                )
              );
              dataRow.push(
                transform(
                  unit.usageCategoryDetail ? unit.usageCategoryDetail : unit.usageCategorySubMinor,
                  unit.usageCategoryDetail ? "UsageCategoryDetail" : "UsageCategorySubMinor"
                )
              );
              dataRow.push(transform(unit.occupancyType, "OccupancyType"));
              if (unit.occupancyType === "RENTED") {
                dataRow.push(unit.arv || "");
              } else {
                dataRow.push(`${Math.round(unit.unitArea * 100) / 100}` || "");
              }

              bodyData.push(dataRow);
            });
          return bodyData;
        } else {
          return null;
        }
      };

      const floorData = getFloorDetails();

      let borderKey = [true, true, false, true];
      let borderValue = [false, true, true, true];
      let receiptTableWidth = ["*", "*", "*", "*"];

      let getOwnerDetails = (ownerArray, noOfColumns) => {
        const { propertyDetails } = details;
        const { institution } = propertyDetails[0] || {};
        const isInstitution =
          propertyDetails && propertyDetails.length
            ? propertyDetails[0].ownershipCategory === "INSTITUTIONALPRIVATE" || propertyDetails[0].ownershipCategory === "INSTITUTIONALGOVERNMENT"
            : false;
        const transformedArray = ownerArray.map((item, index) => {
          return [
            {
              text: `Owner ${ownerArray.length > 1 ? index + 1 : ""} Name`,
              border: borderKey,
              style: "receipt-table-key",
            },
            {
              text: item.name || "",
              border: borderValue,
            },
            {
              text: item.relationship === "FATHER" ? "Father's Name" : "Husband's Name",
              border: borderKey,
              style: "receipt-table-key",
            },
            {
              text: item.fatherOrHusbandName || "",
              border: borderValue,
            },
          ];
        });
        const flatArray = transformedArray.reduce((acc, val) => acc.concat(val), []);

        if (flatArray.length % noOfColumns !== 0) {
          flatArray.push(
            {
              text: "",
              border: borderKey,
              style: "receipt-table-key",
            },
            {
              text: "",
              border: borderValue,
            }
          );
        }

        let newArray = [];
        while (flatArray.length > 0) newArray.push(flatArray.splice(0, noOfColumns));
        return isInstitution
          ? [
            [
              {
                text: `Institution Name`,
                border: borderKey,
                style: "receipt-table-key",
              },
              {
                text: institution.name || "",
                border: borderValue,
              },
              {
                text: `Authorised Person`,
                border: borderKey,
                style: "receipt-table-key",
              },
              {
                text: ownerArray[0].name || "",
                border: borderValue,
              },
            ],
          ]
          : newArray;
      };

      data = {
        content: [
          {
            style: "pt-reciept-citizen-table",
            margin: [0, 0, 0, 18],
            table: {
              widths: [50, "*", 100],
              body: [
                [
                  {
                    image: receiptImageUrl || msevaLogo,
                    width: 30,
                    margin: [10, 10, 10, 10],
                  },
                  {
                    //stack is used here to give multiple sections one after another in same body
                    stack: [
                      { text: header.header || "", style: "receipt-logo-header" },
                      {
                        text: `${header.subheader} ${isEmployeeReceipt ? ` ` : ` `} ` || "",
                        style: "receipt-logo-sub-header",
                      },
                    ],
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: " ",
                        bold: true,
                      },
                      "",
                    ],
                    margin: [10, 10, 10, 2],
                  },
                ],
              ],
            },
            layout: tableborder,
          },
          {
            style: "receipt-header-details",
            columns: [
              {
                text: [
                  {
                    text: "Date: ",
                    bold: true,
                  },
                  assessmentDate||'',
                  // receipts.paymentDate || "",  //todo
                ],

                alignment: "left",
              },
              {
                text: [
                  {
                    text: "Contact Us: ",
                    bold: true,
                  },
                  header.contact || "NA",
                ],
                alignment: "right",
              },
            ],
          },
          {
            style: "receipt-header-details",
            columns: [
              {
                text: [
                  {
                    text: "Assessment Year: ",
                    bold: true,
                  },
                  propertyDetails[0].financialYear || "",
                ],
                alignment: "left",
              },
              {
                text: [
                  {
                    text: "Website: ",
                    bold: true,
                  },
                  header.website || "NA",
                ],
                alignment: "right",
              },
            ],
          },
          {
            style: "pt-reciept-citizen-table",
            table: {
              body: [
                [
                  { text: "Existing Property ID:", border: borderKey, style: "receipt-table-key" },
                  { text: details.existingPropertyId || "NA", border: borderValue },
                  { text: "Property Tax Unique ID:", border: borderKey, style: "receipt-table-key" },
                  { text: details.propertyId || "", border: borderValue }, //need to confirm this data
                  { text: "Assessment No:", border: borderKey, style: "receipt-table-key" },
                  { text: propertyDetails[0].assessmentNumber || "", border: borderValue },
                ],
              ],
            },
            layout: tableborder,
          },
          { text: "PROPERTY ADDRESS", style: "pt-reciept-citizen-subheader" },
          {
            style: "pt-reciept-citizen-table",
            table: {
              widths: receiptTableWidth,
              body: [
                [
                  { text: "House/Door No.:", border: borderKey, style: "receipt-table-key" },
                  { text: address.doorNo || "NA", border: borderValue },
                  { text: "Building/Colony Name.:", border: borderKey, style: "receipt-table-key" },
                  { text: address.buildingName || "NA", border: borderValue },
                ],
                [
                  { text: "Street Name:", border: borderKey, style: "receipt-table-key" },
                  { text: address.street || "NA", border: borderValue },
                  { text: "Locality/Mohalla:", border: borderKey, style: "receipt-table-key" },
                  { text: address.locality.name || "NA", border: borderValue },
                ],
              ],
            },
            layout: tableborder,
          },
          { text: "ASSESSMENT INFORMATION", style: "pt-reciept-citizen-subheader" },
          {
            style: "pt-reciept-citizen-table",
            table: {
              widths: receiptTableWidth,
              body: [
                [
                  { text: "Plot Size(sq yards)", border: borderKey, style: "receipt-table-key" },
                  { text: propertyDetails[0].landArea ? `${Math.round(propertyDetails[0].landArea * 100) / 100}` : (propertyDetails[0].buildUpArea ? `${Math.round(propertyDetails[0].buildUpArea * 100) / 100}` : "NA"), border: borderValue },
                  { text: "Property Type:", border: borderKey, style: "receipt-table-key" },
                  {
                    text: propertyDetails[0].propertySubType
                      ? transform(propertyDetails[0].propertySubType, "PropertySubType")
                      : transform(propertyDetails[0].propertyType, "PropertyType"),
                    border: borderValue,
                  },
                ],
              ],
            },
            layout: tableborder,
          },
          floorData && { text: "BUILT-UP AREA DETAILS", style: "pt-reciept-citizen-subheader" },
          floorData && {
            style: "receipt-assess-table",
            table: {
              widths: ["*", "*", "*", "*", "*"],
              body: floorData,
            },
            layout: tableborder,
          },
          { text: "OWNERSHIP INFORMATION", style: "pt-reciept-citizen-subheader" },
          {
            style: "pt-reciept-citizen-table",
            table: {
              widths: receiptTableWidth,
              body: getOwnerDetails(owners, 4),
            },
            layout: tableborder,
          },

          { text: "Commissioner/EO", alignment: "right", color: "#484848", fontSize: 12, bold: true, margin: [0, 30, 0, 30] },

        ],

        styles: {
          "pt-reciept-citizen-subheader": {
            fontSize: 10,
            bold: true,
            margin: [0, 16, 0, 8], //left top right bottom
            color: "#484848",
          },
          "pt-reciept-citizen-table": {
            fontSize: 10,
            color: "#484848",
          },
          "receipt-assess-table": {
            fontSize: 10,
            color: "#484848",
            margin: [0, 8, 0, 0],
          },
          "receipt-assess-table-header": {
            bold: true,
            fillColor: "#D8D8D8",
            color: "#484848",
          },
          "receipt-header-details": {
            fontSize: 9,
            margin: [0, 0, 0, 8],
            color: "#484848",
          },
          "receipt-table-key": {
            color: "#484848",
            bold: true,
          },
          "receipt-table-value": {
            color: "#484848",
          },
          "receipt-logo-header": {
            color: "#484848",
            fontSize: 16,
            bold: true,
            decoration: "underline",
            // decorationStyle: "solid",
            decorationColor: "#484848",
          },
          "receipt-logo-sub-header": {
            color: "#484848",
            fontSize: 13,
            decoration: "underline",
            // decorationStyle: "solid",
            decorationColor: "#484848",
          },
          "receipt-footer": {
            color: "#484848",
            fontSize: 8,
            margin: [0, 0, 0, 5],
          },
        },
      };

      break;
    default:
  }
  // data && pdfMake.createPdf(data).download(`${propertyDetails[0].assessmentNumber}.pdf`);
  data && pdfMake.createPdf(data).open();
};

export default generateAcknowledgementForm;


