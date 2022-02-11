import React ,{useState,useEffect}from 'react'
import{UploadFile} from '@egovernments/digit-ui-react-components';
const scss={
  height:"150px",
  width:'100%'
}

function UploadDrawer({ setProfilePic }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [file,setFile] = useState("")
  const [error, setError] = useState(null);

  const selectfile = (e) => { 
    setFile(e.target.files[0]);
  }
    
  // console.log("demo",uploadedFile)
  const removeimg=()=>{
    // setUploadedFile(null)
  }

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
    <div style={{bottom:'0',height:'150px',justifyContent:"space-around",backgroundColor:"white"}}>
      <div>
      <UploadFile
        extraStyleName={"propertyCreate"}
        accept=".jpg,.png,.pdf"
        onUpload={selectfile}
        // onDelete={() => {
        //   setUploadedFile(null);}} />UploadDrawer
      />
      </div>
      <div onClick={removeimg}>remove</div>
    </div>
  )
}

export default UploadDrawer