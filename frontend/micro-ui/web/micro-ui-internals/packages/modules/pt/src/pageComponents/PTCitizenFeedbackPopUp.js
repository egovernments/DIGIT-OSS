import { PopUp } from "@egovernments/digit-ui-react-components";
import React from "react";

const PTCitizenFeedbackPopUp = ({ setpopup, setShowToast, data }) => {

 const CitizenFeedback = Digit?.ComponentRegistryService?.getComponent("CitizenFeedback");

  return (
    <React.Fragment>
    <PopUp>
          <div style={{margin:"0 auto", top:"15%", position:"relative"}}>
          <CitizenFeedback popup={true} onClose={setpopup} setShowToast={setShowToast} data={data}/>
          </div>
    </PopUp>
    </React.Fragment>
  );
};

export default PTCitizenFeedbackPopUp;