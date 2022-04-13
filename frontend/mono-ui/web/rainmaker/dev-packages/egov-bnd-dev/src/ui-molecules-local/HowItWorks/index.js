import React from "react";
// import { withStyles } from "@material-ui/core/styles";
// import { LabelContainer } from "egov-ui-framework/ui-containers";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemText from "@material-ui/core/ListItemText";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
// import IconButton from "@material-ui/core/IconButton";
// import KeyboardRightIcon from "@material-ui/icons/KeyboardArrowRight";

const gethelpURL=()=>{
  let hostname = window.location.hostname;
  
  if(hostname === 'localhost')
    hostname  = "https://13.71.65.215.nip.io";
  else  
    hostname  = window.location.origin;
  const url=new URL(hostname+"/filestore/v1/files/static?fileStoreId=BirthDeathUserManual_Citizen.pdf");
  return url;

}


const HowItWorks = (props) => {
  const helpURL =gethelpURL();
  return (
    <div style={{ height: "100vh" }}>
      {/* <iframe
        src="https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb/TL_UserManual_Citizen.pdf#view=FitH&embedded=true"
        style={{ width: "100%", height: "90%" }}
        frameborder="0"
      /> */}
          <iframe
    // src="https://belegovgithub.github.io/webaccess/pdf/BillGenieUserManual_Citizen.pdf#view=FitH&embedded=true.pdf"
    src={helpURL}
    style={{ width: "100%", height: "90%" }}
    frameborder="0"
></iframe>
      {/* <p>
        Your web browser doesn't have a PDF plugin. Instead you can{" "}
        <a href="https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb/TL_UserManual_Citizen.pdf">click here to download the PDF file.</a>
      </p> */}
    </div>
  );
};

export default HowItWorks;


