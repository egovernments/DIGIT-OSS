import React,{useState,useEffect} from "react";
import{UploadFile} from '@egovernments/digit-ui-react-components';
const ImgUp=()=>{
    const [uploadedFile, setUploadedFile] = useState("a");
    const [file,setFile] = useState("")
    function selectfile(e) {
        setFile(e.target.files[0]);
        

      }
      const [error, setError] = useState(null);

      useEffect(() => {
        (async () => {
          setError(null);
          if (file) {
            if (file.size >= 2000000) {
              setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
            } else {
              try {
                // TODO: change module in file storage
                const response = await Digit.UploadServices.Filestorage("citizen-profile", file, Digit.ULBService.getStateId());                if (response?.data?.files?.length > 0) {
                  setUploadedFile(response?.data?.files[0]?.fileStoreId);
                } else {
                  setError(t("FILE_UPLOAD_ERROR"));
                }
              } catch (err) {
              }
            }
          }
        })();
      }, [file]);

    return(
        <React.Fragment>
                    
            <UploadFile
                extraStyleName={"propertyCreate"}
                accept=".jpg,.png,.pdf"
                onUpload={selectfile}
                onDelete={() => {
                  setUploadedFile(null);}}
                  
             />
        </React.Fragment>
    )
}
export default ImgUp