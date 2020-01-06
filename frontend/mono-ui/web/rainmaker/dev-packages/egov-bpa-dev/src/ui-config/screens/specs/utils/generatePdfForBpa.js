import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import QRCode from "qrcode";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getMessageFromLocalization } from "./receiptTransformer";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getOwners = data => {
  let retowners = [];
  data.owners.forEach(owner => {
    retowners.push(
      [
        {
          text: "Mobile No.",
          border: [true, true, false, false]
        },
        {
          text: "Name",
          border: [false, true, false, false]
        },
        {
          text: "Gender",
          border: [false, true, false, false]
        },
        {
          text: "Date of Birth",
          border: [false, true, true, false]
        }
      ],
      [
        {
          text: owner.mobile,//get(owner, "mobile"),
          style: "receipt-table-value",
          border: [true, false, false, false]
        },
        {
          text: owner.name, //get(owner, "name"),
          style: "receipt-table-value",
          border: [false, false, false, false]
        },
        {
          text: owner.gender, //get(owner, "gender"),
          style: "receipt-table-value",
          border: [false, false, false, false]
        },
        {
          text: owner.dob, //get(owner, "dob"),
          style: "receipt-table-value",
          border: [false, false, true, false]
        }
      ],
      [
        {
          text: "",
          border: [true, false, false, false]
        },
        {
          text: "",
          border: [false, false, false, false]
        },
        {
          text: "",
          border: [false, false, false, false]
        },

        {
          text: "",
          border: [false, false, true, false]
        }
      ],
      [
        {
          text: "Father/Husband's Name",
          border: [true, false, false, false]
        },
        {
          text: "Relationship",
          border: [false, false, false, false]
        },
        {
          text: "Email",
          border: [false, false, false, false]
        },
        {
          text: "PAN No.",
          border: [false, false, true, false]
        }
      ],
      [
        {
          text: get(owner, "fatherHusbandName"),
          style: "receipt-table-value",
          border: [true, false, false, false]
        },
        {
          text: get(owner, "relationship"),
          style: "receipt-table-value",
          border: [false, false, false, false]
        },
        {
          text: get(owner, "email"),
          style: "receipt-table-value",
          border: [false, false, false, false]
        },
        {
          text: get(owner, "pan"),
          style: "receipt-table-value",
          border: [false, false, true, false]
        }
      ],
      [
        {
          text: "",
          border: [true, false, false, false]
        },
        {
          text: "",
          border: [false, false, false, false]
        },
        {
          text: "",
          border: [false, false, false, false]
        },

        {
          text: "",
          border: [false, false, true, false]
        }
      ],
      [
        {
          text: "Correspondence Address",
          border: [true, false, false, false]
        },
        {
          text: "",
          border: [false, false, false, false]
        },
        {
          text: "",
          border: [false, false, false, false]
        },
        {
          text: "",
          border: [false, false, true, false]
        }
      ],
      [
        {
          text: get(owner, "address"),
          style: "receipt-table-value",
          border: [true, false, false, true]
        },
        {
          text: "",
          style: "receipt-table-value",
          border: [false, false, false, true]
        },
        {
          text: "",
          style: "receipt-table-value",
          border: [false, false, false, true]
        },

        {
          text: "",
          style: "receipt-table-value",
          border: [false, false, true, true]
        }
      ]
    );
  });
  return retowners;
};

const getApplicationData = async (transformedData, ulbLogo, type) => {
  let borderLayout = {
    hLineWidth: function(i, node) {
      return i === 0 || i === node.table.body.length ? 0.1 : 0.1;
    },
    vLineWidth: function(i, node) {
      return i === 0 || i === node.table.widths.length ? 0.1 : 0.1;
    },
    hLineColor: function(i, node) {
      return i === 0 || i === node.table.body.length ? "#979797" : "#979797";
    },
    vLineColor: function(i, node) {
      return i === 0 || i === node.table.widths.length ? "#979797" : "#979797";
    }
  };

  let headerText = "Application Confirmation";
  let nocSubheadOne = [
    {
      text: [
        {
          text: "Application No.     ",
          bold: true
        },
        {
          text: transformedData.applicationNumber,
          bold: false
        }
      ],
      alignment: "left"
    },
    {
      text: [
        {
          text: "Date of Application ",
          bold: true
        },
        {
          text: transformedData.applicationDate,
          bold: false
        }
      ],
      alignment: "right"
    }
  ];
  let nocSubheadTwo = [
    {
      text: [
        {
          text: "Application Mode ",
          bold: true
        },
        {
          text: transformedData.applicationMode,
          bold: false
        }
      ],
      alignment: "left"
    }
  ];

  let propertyLocationDetails = [
    {
      text: "PROPERTY LOCATION DETAILS",
      style: "noc-title"
    },
    {
      style: "noc-table",
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          [
            {
              text: "Property Id",
              border: [true, true, false, false]
            },
            {
              text: "City",
              border: [false, true, false, false]
            },
            {
              text: "Door/House No.",
              border: [false, true, false, false]
            },
            {
              text: "Building/Company Name",
              border: [false, true, true, false]
            }
          ],
          [
            {
              text: transformedData.propertyId,
              style: "receipt-table-value",
              border: [true, false, false, false]
            },
            {
              text: transformedData.city,
              style: "receipt-table-value",
              border: [false, false, false, false]
            },
            {
              text: transformedData.door,
              style: "receipt-table-value",
              border: [false, false, false, false]
            },
            {
              text: transformedData.buildingName,
              style: "receipt-table-value",
              border: [false, false, true, false]
            }
          ],
          [
            {
              text: "Street Name",
              border: [true, false, false, false]
            },

            {
              text: " Mohalla",
              border: [false, false, false, false]
            },
            {
              text: "Pincode",
              border: [false, false, false, false]
            },
            {
              text: "Location on Map",
              border: [false, false, true, false]
            }
          ],
          [
            {
              text: transformedData.street,
              style: "receipt-table-value",
              border: [true, false, false, true]
            },
            {
              text: transformedData.mohalla,
              style: "receipt-table-value",
              border: [false, false, false, true]
            },
            {
              text: transformedData.pincode,
              style: "receipt-table-value",
              border: [false, false, false, true]
            },
            {
              text: transformedData.gis,
              style: "receipt-table-value",
              border: [false, false, true, true]
            }
          ]
        ]
      },
      layout: borderLayout
    }
  ];
  let applicantDetails = [
    {
      text: "APPLICANT DETAILS",
      style: "noc-title"
    },
    {
      style: "noc-table",
      table: {
        widths: ["*", "*", "*", "*"],
        body: getOwners(transformedData)
      },
      layout: borderLayout
    }
  ];
  let institutionDetails = [
    {
      text: "INSTITUTION DETAILS",
      style: "noc-title"
    },
    {
      style: "noc-table",
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          [
            {
              text: "Type of Institution",
              border: [true, true, false, false]
            },
            {
              text: "Name of Institute",
              border: [false, true, false, false]
            },
            {
              text: "Official Telephone No.",
              border: [false, true, false, false]
            },
            {
              text: "Authorized Person",
              border: [false, true, true, false]
            }
          ],
          [
            // {
            //   text: getMessageFromLocalization(
            //     `COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(
            //       transformedData.ownershipType
            //     )}`
            //   ),
            //   style: "receipt-table-value",
            //   border: [true, false, false, false]
            // },
            {
              text: transformedData.institutionName,
              style: "receipt-table-value",
              border: [false, false, false, false]
            },
            {
              text: transformedData.telephoneNumber,
              style: "receipt-table-value",
              border: [false, false, false, false]
            },
            {
              text: transformedData.owners[0].name,
              style: "receipt-table-value",
              border: [false, false, true, false]
            }
          ],
          [
            {
              text: "Designation in Institution",
              border: [true, false, false, false]
            },
            {
              text: "Mobile No. of Authorized Person",
              border: [false, false, false, false]
            },
            {
              text: "Email of Authorized Person",
              border: [false, false, false, false]
            },
            {
              text: "Official Correspondence Address",
              border: [false, false, true, false]
            }
          ],
          [
            {
              text: transformedData.institutionDesignation,
              style: "receipt-table-value",
              border: [true, false, false, true]
            },
            {
              text: transformedData.owners[0].mobile,
              style: "receipt-table-value",
              border: [false, false, false, true]
            },
            {
              text: transformedData.owners[0].email,
              style: "receipt-table-value",
              border: [false, false, false, true]
            },
            {
              text: transformedData.owners[0].address,
              style: "receipt-table-value",
              border: [false, false, true, true]
            }
          ]
        ]
      },
      layout: borderLayout
    }
  ];
  let documents = [];
  let owners = transformedData.owners.map(owner => [
    {
      text: "Applicant Name",
      border: [true, true, false, true],
      style: "receipt-table-value"
    },
    { text: owner.name, border: [false, true, true, true] },
    {
      text: "Mobile No.",
      border: [true, true, false, true],
      style: "receipt-table-value"
    },
    { text: owner.mobile, border: [false, true, true, true] }
  ]);
  let applicantInformation = [
    { text: "APPLICANT INFORMATION", style: "noc-title" },
    {
      style: "noc-table",
      table: {
        widths: ["*", "*", "*", "*"],
        body: owners
      },
      layout: borderLayout
    }
  ];
  let amountPaid = [
    { text: "AMOUNT PAID", style: "noc-title" },
    {
      style: "noc-table",
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          [
            {
              text: "NOC Fee",
              border: [true, true, true, true],
              style: "receipt-table-value",
              alignment: "center"
            },
            {
              text: "NOC Taxes",
              border: [true, true, true, true],
              style: "receipt-table-value",
              alignment: "center"
            },
            {
              text: "Adhoc Penalty/Rebate",
              border: [true, true, true, true],
              style: "receipt-table-value",
              alignment: "center"
            },
            {
              text: "TOTAL",
              border: [true, true, true, true],
              style: "receipt-table-value",
              alignment: "center"
            }
          ],
          [
            {
              text: transformedData.nocFee,
              border: [true, true, true, true],
              alignment: "center"
            },
            {
              text: transformedData.nocTaxes,
              border: [true, true, true, true],
              alignment: "center"
            },
            {
              text: transformedData.nocAdhocPenaltyRebate,
              border: [true, true, true, true],
              alignment: "center"
            },
            {
              text: transformedData.totalAmount,
              border: [true, true, true, true],
              alignment: "center"
            }
          ]
        ]
      },
      layout: borderLayout
    }
  ];
  let paymentInformation = [
    { text: "PAYMENT INFORMATION", style: "noc-title" },
    {
      style: "noc-table",
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            {
              text: "Payment Mode",
              border: [true, true, true, true],
              style: "receipt-table-value",
              alignment: "center"
            },
            {
              text: "Transaction ID/ Cheque/ DD No.",
              border: [true, true, true, true],
              style: "receipt-table-value",
              alignment: "center"
            },
            {
              text: "Bank Name & Branch",
              border: [true, true, true, true],
              style: "receipt-table-value",
              alignment: "center"
            }
          ],
          [
            {
              text: transformedData.paymentMode,
              border: [true, true, true, true],
              alignment: "center"
            },
            {
              text: transformedData.transactionNumber,
              border: [true, true, true, true],
              alignment: "center"
            },
            {
              text: transformedData.bankAndBranch,
              border: [true, true, true, true],
              alignment: "center"
            }
          ]
        ]
      },
      layout: borderLayout
    }
  ];
  let generatedApprovedBy = [
    {
      style: "receipt-approver",
      columns: [
        {
          text: [
            {
              text: "Generated by: ",
              bold: true
            },
            {
              text: transformedData.auditorName,
              bold: false
            }
          ],
          alignment: "left"
        },
        {
          text: [
            {
              text: "Commissioner/EO",
              bold: true
            }
          ],
          alignment: "right"
        }
      ]
    }
  ];
  let qrText = `Application: ${transformedData.applicationNumber}, Date: ${
    transformedData.applicationDate
  }, Buildings: ${transformedData.propertyType}, Applicant: ${
    transformedData.owners[0].name
  }, Address: ${transformedData.address}`;

  // if (transformedData.ownershipType.startsWith("INSTITUTION")) {
    // applicantDetails = [];
    // applicantInformation = [];
  // } else {
  //   institutionDetails = [];
  // }

  switch (type) {
    case "application":
      applicantInformation = [];
      amountPaid = [];
      paymentInformation = [];
      generatedApprovedBy = [];
      break;
    case "receipt":
      headerText = "Payment Receipt";
      nocSubheadOne = [
        {
          text: [
            {
              text: "Application No.            ",
              bold: true
            },
            {
              text: transformedData.applicationNumber,
              bold: false
            }
          ],
          alignment: "left"
        },
        {
          text: [
            {
              text: "Date of Payment   ",
              bold: true
            },
            {
              text: transformedData.paymentDate,
              bold: false
            }
          ],
          alignment: "right"
        }
      ];
      nocSubheadTwo = [
        {
          text: [
            {
              text: "Payment Receipt No.  ",
              bold: true
            },
            {
              text: transformedData.receiptNumber,
              bold: false
            }
          ],
          alignment: "left"
        }
      ];
      propertyLocationDetails = [];
      applicantDetails = [];
      documents = [];
      qrText = `Application: ${
        transformedData.applicationNumber
      }, Receipt number: ${transformedData.receiptNumber}, Date of payment: ${
        transformedData.paymentDate
      }, Fees Paid: ${transformedData.amountPaid}, Payment mode: ${
        transformedData.paymentMode
      }, Transaction ID: ${transformedData.transactionNumber}`;
      break;
    case "certificate":
      headerText = "Certificate";
      nocSubheadOne = [
        {
          text: [
            {
              text: "Fire NOC No. ",
              bold: true
            },
            {
              text: transformedData.fireNOCNumber,
              bold: false
            }
          ],
          alignment: "left"
        },
        {
          text: [
            {
              text: "Application No. ",
              bold: true
            },
            {
              text: transformedData.applicationNumber,
              bold: false
            }
          ],
          alignment: "right"
        }
      ];
      nocSubheadTwo = [
        {
          text: [
            {
              text: "Date of Issue ",
              bold: true
            },
            {
              text: transformedData.issuedDate,
              bold: false
            }
          ],
          alignment: "left"
        },
        {
          text: [
            {
              text: "Valid Till ",
              bold: true
            },
            {
              text: transformedData.validTo,
              bold: false
            }
          ],
          alignment: "right"
        }
      ];
      applicantDetails = [];
      documents = [];
      generatedApprovedBy = [
        {
          style: "receipt-approver",
          columns: [
            {
              text: [
                {
                  text: "Approved by: ",
                  bold: true
                },
                {
                  text: transformedData.auditorName,
                  bold: false
                }
              ],
              alignment: "left"
            },
            {
              text: [
                {
                  text: "Commissioner/EO",
                  bold: true
                }
              ],
              alignment: "right"
            }
          ]
        }
      ];
      qrText = `Application: ${
        transformedData.applicationNumber
      }, NOC Number: ${transformedData.fireNOCNumber}, Date of Issue: ${
        transformedData.issuedDate
      }, Valid Till: ${transformedData.validTo}, Buildings: ${
        transformedData.propertyType
      }, Applicant: ${transformedData.owners[0].name}`;
      break;
  }

  // Generate QR code base64 image
  let qrcode = await QRCode.toDataURL(qrText);

  let dd = {
    content: [
      {
        style: "noc-head",
        table: {
          widths: [120, "*", 120],
          body: [
            [
              {
                image: ulbLogo,
                width: 60,
                height: 61.25,
                margin: [51, 12, 10, 10]
              },
              {
                stack: [
                  {
                    text: transformedData.corporationName,
                    style: "receipt-logo-header"
                  },
                  {
                    text: `BPA ${headerText}`,
                    style: "receipt-logo-sub-header"
                  }
                ],
                alignment: "left",
                margin: [10, 23, 0, 0]
              },
              {
                image: qrcode,
                width: 70,
                height: 70,
                margin: [50, 8, 8, 8],
                alignment: "right"
              }
            ]
          ]
        },
        layout: "noBorders"
      },
      {
        style: "noc-subhead",
        columns: nocSubheadOne
      },
      {
        style: "noc-subhead",
        columns: nocSubheadTwo
      },
      
      ...propertyLocationDetails,
      ...applicantDetails,
      ...documents,
      ...applicantInformation,
      // ...institutionDetails,
      ...amountPaid,
      ...paymentInformation,
      ...generatedApprovedBy
    ],
    footer: [],
    styles: {
      "noc-head": {
        fillColor: "#F2F2F2",
        margin: [-70, -41, -81, 0]
      },
      "receipt-logo-header": {
        color: "#484848",
        fontFamily: "Roboto",
        fontSize: 16,
        bold: true,
        letterSpacing: 0.74,
        margin: [0, 0, 0, 5]
      },
      "receipt-logo-sub-header": {
        color: "#484848",
        fontFamily: "Roboto",
        fontSize: 13,
        letterSpacing: 0.6
      },
      "noc-subhead": {
        fontSize: 12,
        bold: true,
        margin: [-18, 8, 0, 0],
        color: "#484848"
      },
      "noc-title": {
        fontSize: 10,
        bold: true,
        margin: [-18, 16, 8, 8],
        color: "#484848",
        fontWeight: 500
      },
      "noc-table": {
        fontSize: 10,
        color: "#484848",
        margin: [-20, -2, -8, -8]
      },
      "receipt-header-details": {
        fontSize: 9,
        margin: [0, 0, 0, 8],
        color: "#484848"
      },
      "noc-table-key": {
        color: "#484848",
        bold: false,
        fontSize: 10
      },
      "receipt-table-value": {
        color: "#484848",
        bold: true,
        fontSize: 10
      },
      "receipt-footer": {
        color: "#484848",
        fontSize: 8,
        margin: [-6, 15, -15, -10]
      },
      "receipt-no": {
        color: "#484848",
        fontSize: 10
      },
      "receipt-approver": {
        fontSize: 12,
        bold: true,
        margin: [-20, 30, -10, 0],
        color: "#484848"
      }
    }
  };
  return dd;
};

const generatePdf = async (state, dispatch, type) => {
  let applicationData = get(
    state.screenConfiguration.preparedFinalObject,
    "applicationDataForPdf",
    {}
  );
  let paymentData = get(
    state.screenConfiguration.preparedFinalObject,
    "receiptDataForPdf",
    {}
  );
  // let mdmsData = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "mdmsDataForPdf",
  //   {}
  // );
  let ulbLogo = get(
    state.screenConfiguration.preparedFinalObject,
    "base64UlbLogoForPdf",
    ""
  );
  // let auditorData = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "userDataForPdf",
  //   {}
  // );
  if (isEmpty(applicationData)) {
    console.log("Error in application data");
    return;
  } 
  // else if (isEmpty(mdmsData)) {
  //   console.log("Error in mdms data");
  //   return;
  // }
   else if (isEmpty(ulbLogo)) {
    console.log("Error in image data");
    return;
  } 
  // else if (
  //   (type.startsWith("receipt") || type.startsWith("certificate")) &&
  //   isEmpty(auditorData)
  // ) {
  //   console.log("Error in auditor user data");
  //   return;
  // }
  //  else if (
  //   (type.startsWith("receipt") || type.startsWith("certificate")) &&
  //   isEmpty(paymentData)
  // ) {
  //   console.log("Error in payment data");
  //   return;
  // }
  let transformedData = {
    ...applicationData,
    ...paymentData,
    // ...mdmsData,
    // ...auditorData
  };
  switch (type) {
    case "application_download":
      let fileName = `bpa_application_${transformedData.applicationNumber}`;
      let application_data = await getApplicationData(
        transformedData,
        ulbLogo,
        "application"
      );
      application_data &&
        pdfMake.createPdf(application_data).download(fileName);
      break;
    case "application_print":
      application_data = await getApplicationData(
        transformedData,
        ulbLogo,
        "application"
      );
      application_data && pdfMake.createPdf(application_data).print();
      break;
    case "receipt_download":
      fileName = `noc_receipt_${transformedData.receiptNumber}`;
      application_data = await getApplicationData(
        transformedData,
        ulbLogo,
        "receipt"
      );
      application_data &&
        pdfMake.createPdf(application_data).download(fileName);
      break;
    case "receipt_print":
      application_data = await getApplicationData(
        transformedData,
        ulbLogo,
        "receipt"
      );
      application_data && pdfMake.createPdf(application_data).print();
      break;
    case "certificate_download":
      fileName = `noc_certificate_${transformedData.fireNOCNumber}`;
      application_data = await getApplicationData(
        transformedData,
        ulbLogo,
        "certificate"
      );
      application_data &&
        pdfMake.createPdf(application_data).download(fileName);
      break;
    case "certificate_print":
      application_data = await getApplicationData(
        transformedData,
        ulbLogo,
        "certificate"
      );
      application_data && pdfMake.createPdf(application_data).print();
      break;

    default:
      break;
  }
};

export default generatePdf;