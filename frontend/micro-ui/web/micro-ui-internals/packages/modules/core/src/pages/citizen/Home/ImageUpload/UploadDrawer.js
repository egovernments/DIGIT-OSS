import React, { useState, useEffect } from "react";
import { UploadFile } from "@egovernments/digit-ui-react-components";
const scss = {
  height: "150px",
  width: "100%",
};

function UploadDrawer({ setProfilePic }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [file, setFile] = useState("");
  const [error, setError] = useState(null);

  const selectfile = (e) => {
    setFile(e.target.files[0]);
  };

  // console.log("demo",uploadedFile)
  const removeimg = () => {
    setUploadedFile(null);
  };

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 2000000) {
          setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("citizen-profile", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              const fileStoreId = response?.data?.files[0]?.fileStoreId;
              setUploadedFile(fileStoreId);
              setProfilePic(fileStoreId);
            } else {
              setError(t("FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            console.error("Modal -> err ", err);
            // setError(t("PT_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  return (
    // <div style={{  filter:"blur(100px)",
    // backgroundColor:"rgba(0, 0, 0, 0.5)",
    // userSelect:"none",
    // pointerEvents:"none"}}>
    <div
      style={{
        width: "90%",
        justifyContent: "center",
        backgroundColor: "red",
        alignItems: "center",
        position: "absolute",
        top: "450px",
        left: "15px",
        height: "10%",
        zindex: "2",
      }}
    >
      <div style={{ width: "50%", float: "left" }}>
        <UploadFile
          extraStyleName={"propertyCreate"}
          accept=".jpg,.png"
          onUpload={selectfile}
          // onDelete={() => {
          //   setUploadedFile(null);}} />UploadDrawer
        />
      </div>
      <div style={{ width: "50%", float: "left", textAlign: "center", justifyContent: "center" }}>
        <button onClick={removeimg}>Remove</button>
      </div>
    </div>
    // </div>
  );
}

export default UploadDrawer;
