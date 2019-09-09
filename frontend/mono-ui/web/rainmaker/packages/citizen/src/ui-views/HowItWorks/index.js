import React from "react";

const HowItWorks = (props) => {
  return (
    <div style={{ height: "100vh" }}>
      <iframe
        src="https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb/TL_UserManual_Citizen.pdf#view=FitH&embedded=true"
        style={{ width: "100%", height: "90%" }}
        frameborder="0"
      />
      {/* <p>
        Your web browser doesn't have a PDF plugin. Instead you can{" "}
        <a href="https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb/TL_UserManual_Citizen.pdf">click here to download the PDF file.</a>
      </p> */}
    </div>
  );
};

export default HowItWorks;
