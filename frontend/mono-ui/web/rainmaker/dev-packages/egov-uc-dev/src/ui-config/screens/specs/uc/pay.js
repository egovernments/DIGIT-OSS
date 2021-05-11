// import {
//   getCommonCard,
//   getCommonHeader,
//   getCommonContainer
//   //getCommonTitle
// } from "egov-ui-framework/ui-config/screens/specs/utils";
// import { estimateSummary } from "./payResource/estimateSummary";
// import { capturePayment } from "./payResource/capturePayment";
// import { G8ReceiptDetails } from "./payResource/G8ReceiptDetails";
// import { footer } from "./payResource/footer";
// import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
// import get from "lodash/get";

// const header = getCommonContainer({
//   header: getCommonHeader({
//     labelName: "New universal Collection",
//     labelKey: "UC_PAY_HEADER"
//   })
// });

// const screenConfig = {
//   uiFramework: "material-ui",
//   name: "pay",
//   beforeInitScreen: (action, state, dispatch) => {
//     alert("UC payment page");
//     const tenantId = getQueryArg(window.location.href, "tenantId");
//     const amount = get(
//       state.screenConfiguration,
//       "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].totalAmount",
//       null
//     );
//     console.info("payer name==>",get(
//       state.screenConfiguration,
//       "preparedFinalObject.Challan.citizen.name",
//       null
//     ));
//     dispatch(
//       prepareFinalObject(
//         "ReceiptTemp[0].Bill[0].paidBy",
//         get(
//           state.screenConfiguration,
//           "preparedFinalObject.Challan.citizen.name",
//           null
//         )
//       )
//     );
//     dispatch(
//       prepareFinalObject(
//         "ReceiptTemp[0].Bill[0].payerMobileNumber",
//         get(
//           state.screenConfiguration,
//           "preparedFinalObject.Challan.citizen.mobileNumber",
//           null
//         )
//       )
//     );
//     dispatch(
//       prepareFinalObject("ReceiptTemp[0].instrument", {
//         amount: amount,
//         instrumentType: { name: "Cash" },
//         tenantId: tenantId
//       })
//     );
//     dispatch(
//       prepareFinalObject(
//         "ReceiptTemp[0].Bill[0].billDetails[0].collectionType",
//         "COUNTER"
//       )
//     );
//     dispatch(
//       prepareFinalObject(
//         "ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid",
//         amount
//       )
//     );
//     dispatch(
//       prepareFinalObject(
//         "ReceiptTemp[0].Bill[0].billDetails[0].amountPaid",
//         amount
//       )
//     );
//     dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));
//     return action;
//   },
//   components: {
//     div: {
//       uiFramework: "custom-atoms",
//       componentPath: "Div",
//       props: {
//         className: "common-div-css"
//       },
//       children: {
//         headerDiv: {
//           uiFramework: "custom-atoms",
//           componentPath: "Container",
//           children: {
//             header: {
//               gridDefination: {
//                 xs: 12,
//                 sm: 10
//               },
//               ...header
//             }
//           }
//         },
//         body: getCommonCard({
//           estimateSummary: estimateSummary,
//           capturePayment: capturePayment,
//           G8ReceiptDetails: G8ReceiptDetails
//           //   applicantSummary: applicantSummary,
//           //   documentsSummary: documentsSummary
//         }),
//         footer: footer
//       }
//     }
//   }
// };

// export default screenConfig;
