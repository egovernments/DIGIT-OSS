// import React, { Component } from "react";
// import { Label, Icon } from "components";
// import PTList from "../common/PTList";
// import { Screen } from "modules/common";

// class MyReceipts extends Component {
//   reciepts = [
//     {
//       name: "E2/14, Salunke Vihar",
//       years: [
//         {
//           yearRange: "2018-2019",
//         },
//         {
//           yearRange: "2017-2018",
//         },
//       ],
//     },
//     {
//       name: "P-9.2, Tilak Nagar",
//       years: [
//         {
//           yearRange: "2018-2019",
//         },
//         {
//           yearRange: "2017-2018",
//         },
//       ],
//     },
//   ];

//   getListItems = (reciepts) => {
//     return reciepts.map((reciept, index) => {
//       return {
//         primaryText: <Label label={reciept.name} fontSize="16px" color="#484848" labelStyle={{ fontWeight: 900 }} />,
//         leftIcon: <Icon action="action" name="receipt" />,
//         nestedItems:
//           reciept.years &&
//           reciept.years.map((year) => {
//             return {
//               primaryText: <Label label={year.yearRange} fontSize="16px" color="#484848" />,
//             };
//           }),
//       };
//     });
//   };

//   render() {
//     let { getListItems, reciepts } = this;
//     return (
//       <Screen>
//         <PTList items={getListItems(reciepts)} label="My Receipts" />
//       </Screen>
//     );
//   }
// }

// export default MyReceipts;
