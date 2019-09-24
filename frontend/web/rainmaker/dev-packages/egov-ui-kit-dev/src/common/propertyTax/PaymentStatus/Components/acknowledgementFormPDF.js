import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import msevaLogo from "egov-ui-kit/assets/images/pblogo.png";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generateAcknowledgementForm = (role, details, generalMDMSDataById, receiptImageUrl, isEmployeeReceipt) => {
  let data;
  let { owners, address, propertyDetails } = details;
  let dateArray=new Date(propertyDetails[0].assessmentDate).toDateString().split(' ');
  let assessmentDate=dateArray[2]+'-'+dateArray[1]+'-'+dateArray[3];
  let header = {
    contact: "0183-2545155",
    header: "AMRITSAR Nagar Panchayat",
    logo: "data:image/png;base64,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",
    subheader: "Property Tax Payment Receipt",
    website: "www.amritsarcorp.com"
  }
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
                  { text: propertyDetails[0].landArea ? `${Math.round(propertyDetails[0].landArea * 100) / 100}` : "NA", border: borderValue },
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
  data && pdfMake.createPdf(data).download(`${propertyDetails[0].assessmentNumber}.pdf`);
};

export default generateAcknowledgementForm;


