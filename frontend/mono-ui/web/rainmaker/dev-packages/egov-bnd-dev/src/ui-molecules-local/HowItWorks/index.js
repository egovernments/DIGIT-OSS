import React from "react";
import Hidden from "@material-ui/core/Hidden";
import commonConfig from "config/common";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import {
  downloadPdf
} from "egov-ui-kit/utils/commons";

const gethelpURL = () => {
  let hostname = window.location.hostname;
  if (hostname === "localhost")
    hostname = "https://s3.ap-south-1.amazonaws.com";
  else hostname = window.location.origin;
  const url = new URL(
    hostname + `/${commonConfig.S3BUCKET}/BDUserManual_Citizen.pdf`
  );
  return url;
};
//hostname="https://13.71.65.215.nip.io";
// src="https://belegovgithub.github.io/webaccess/pdf/BillGenieUserManual_Citizen.pdf#view=FitH&embedded=true.pdf"
// src="https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb/TL_UserManual_Citizen.pdf#view=FitH&embedded=true"

const HowItWorks = (props) => {
  const helpURL = gethelpURL();
  return (
    <div style={{ height: "100vh" }}>
      <Hidden only={["xs"]}>
        <iframe
          src={helpURL}
          style={{ width: "100%", height: "90%" }}
          frameborder="0"
        ></iframe>
      </Hidden>
      <Hidden only={["sm", "md", "lg", "xl"]} implementation="css">
        {/* 
      Alternate solution to show pdf but it gets blocked by infra policy        
        <iframe
          id="pdfviewer"
          src={`http://docs.google.com/gview?embedded=true&amp;url=${helpURL}&amp;embedded=true`}
          frameborder="0"
          width="100%"
          height="90%"
        ></iframe>
        
         <iframe
          src={helpURL}
          style={{ width: "100%", height: "90%" }}
          frameborder="0"
        ></iframe>
        */}
         <iframe
          id="pdfviewer"
          src={`http://docs.google.com/gview?embedded=true&amp;url=${helpURL}&amp;embedded=true`}
          frameborder="0"
          width="100%"
          height="90%"
        ></iframe>
        <p>
          {getLocaleLabels(
            "Your web browser doesn't have a PDF plugin. Instead you can ",
            "BND_BROWSER_PLUGIN_ISSUE"
          )}
          <span
          style={{color:"blue",cursor:"pointer",textDecoration:"underline"}}
            // href={helpURL}
            onClick={() => downloadPdf(helpURL)}
          >
            {getLocaleLabels(
              "click here to download the PDF file.",
              "BND_DOWNLOAD_FILE"
            )}
          </span>
        </p>
      </Hidden>
    </div>
  );
};

export default HowItWorks;
