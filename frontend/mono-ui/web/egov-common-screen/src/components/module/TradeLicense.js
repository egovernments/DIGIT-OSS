import React from "react";
import Header from "./Header";
import Faqs from "../Faqs";
import Footer from "../Footer";
import Stepper from "./Stepper";
import StepOneForm from "./Stepper1";

// const TradeLicensePage = () => {

//     const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

//     return(
//     <div>
//         <Header/>
//         <h1>Apply for a new Trade License</h1>
//         <Stepper steps = {steps} initialStep = {0} />
//         <Faqs/>
//         <Footer/>
//     </div>
//     );
// }

// const stepsData = [
//   { labelName: "Trade Details", labelKey: "TL_COMMON_TR_DETAILS" },
//   { labelName: "Owner Details", labelKey: "TL_COMMON_OWN_DETAILS" },
//   { labelName: "Documents", labelKey: "TL_COMMON_DOCS" },
//   { labelName: "Summary", labelKey: "TL_COMMON_SUMMARY" },
// ];

function TradeLicensePage() {

  //const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

  return (
    <div>
      <Header />
      <h1>Apply for a new Trade License</h1>
         {/* <Stepper steps = {steps} initialStep = {0} /> */}
         <StepOneForm/>
      <Footer />
    </div>
  );
}

export default TradeLicensePage;
