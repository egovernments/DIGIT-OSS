import React from "react";
import { Dialog, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import TransferDetails from "./TransferDetails";
import "./index.css";

const bodyStyle = {
  backgroundColor: "#FFFFFF",
  border: "0.5px solid rgba(0, 0, 0, 0)",
  boxShadow: "0 24px 24px 0 rgba(0, 0, 0, 0.3), 0 0 24px 0 rgba(0, 0, 0, 0.22)",
  width: "954px",
  height: "625px",
};

const contentStyle = {
  width: "100%",
  maxWidth: "fit-content",
};

const historyData = {
  "14/04/2018": [
    {
      Name: "Satinder Singh",
      "Gaurdian's Name": "Jaswinder Singh",
      Gender: "Male",
      "Date Of Birth": "12/12/1980",
      "Mobile No.": "965643455",
      Email: "satinder@gmail.com",
      "Special Category": "Not Applicable",
      "Correspondence Address": "707/B, railway Colony, Vikarnagar, Amritsar",
    },
  ],
  "14/04/2019": [
    {
      Name: "Satinder Singh",
      "Gaurdian's Name": "Jaswinder Singh",
      Gender: "Male",
      "Date Of Birth": "12/12/1980",
      "Mobile No.": "965643455",
      Email: "satinder@gmail.com",
      "Special Category": "Not Applicable",
      "Correspondence Address": "707/B, railway Colony, Vikarnagar, Amritsar",
    },
    {
      Name: "Satinder Singh",
      "Gaurdian's Name": "Jaswinder Singh",
      Gender: "Male",
      "Date Of Birth": "12/12/1980",
      "Mobile No.": "965643455",
      Email: "satinder@gmail.com",
      "Special Category": "Not Applicable",
      "Correspondence Address": "707/B, railway Colony, Vikarnagar, Amritsar",
    },
  ],
  "14/04/2020": [
    {
      Name: "Satinder Singh",
      "Gaurdian's Name": "Jaswinder Singh",
      Gender: "Male",
      "Date Of Birth": "12/12/1980",
      "Mobile No.": "965643455",
      Email: "satinder@gmail.com",
      "Special Category": "Not Applicable",
      "Correspondence Address": "707/B, railway Colony, Vikarnagar, Amritsar",
    },
    {
      Name: "Satinder Singh",
      "Gaurdian's Name": "Jaswinder Singh",
      Gender: "Male",
      "Date Of Birth": "12/12/1980",
      "Mobile No.": "965643455",
      Email: "satinder@gmail.com",
      "Special Category": "Not Applicable",
      "Correspondence Address": "707/B, railway Colony, Vikarnagar, Amritsar",
    },
    {
      Name: "Satinder Singh",
      "Gaurdian's Name": "Jaswinder Singh",
      Gender: "Male",
      "Date Of Birth": "12/12/1980",
      "Mobile No.": "965643455",
      Email: "satinder@gmail.com",
      "Special Category": "Not Applicable",
      "Correspondence Address": "707/B, railway Colony, Vikarnagar, Amritsar",
    },
  ],
};

const ViewHistoryDialog = ({ open, closeDialogue }) => {
  return (
    <Dialog
      open={open}
      children={[
        <div style={{ margin: 16 }}>
          <Label label="PT_OWNER_HISTORY" fontSize="20px" labelClassName="owner-history" />
          <br />
          {Object.keys(historyData).map((key) => {
            return (
              <div className="dialog-content">
                <div className="oval-class"></div>
                <Label label="PT_DATE_OF_TRANSFER" fontSize="14px" className="date-of-transfer" labelClassName="date-of-transfer" />
                <span className="date-of-transfer">&nbsp;-&nbsp;{key}</span>
                <TransferDetails data={historyData[key]} />
              </div>
            );
          })}
        </div>,
      ]}
      bodyStyle={bodyStyle}
      isClose={true}
      handleClose={closeDialogue}
      onRequestClose={closeDialogue}
      contentStyle={contentStyle}
      autoScrollBodyContent={true}
    />
  );
};

export default ViewHistoryDialog;
