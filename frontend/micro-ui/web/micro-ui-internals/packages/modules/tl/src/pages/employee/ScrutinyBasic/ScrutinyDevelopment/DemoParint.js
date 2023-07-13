
import React, { useState, useRef ,useEffect  ,useContext} from "react";
import JoditEditor from "jodit-react";
// import { Editor } from "react-draft-wysiwyg";
// import "./styles.css";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownload from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
// new add
import { Dialog, stepIconClasses } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



export default function DemoParinted({ modal = false, state, setState , applicationStatus}) {
  const editor = useRef(null);
//   const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

const {handleRoles, handleGetFiledsStatesById, handleGetRemarkssValues , handleGetNotingRemarkssValues, bussinessService} = useContext(ScrutinyRemarksContext);
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const dateTime = new Date();
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const { id } = useParams();
  const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;
  const [content, setContent] = useState("");
  const config = {
    readonly: false,
    height: 400
  };
  const handleUpdate = (event) => {
    const editorContent = event.target.innerHTML;
    setContent(editorContent);
  };

  const [post, setPost] = useState({
    // title: '',
    content: '',
    // categoryId: ''
})

// documents

const {
  register,
  handleSubmit,
  formState: { errors },
  control,
  setValue,
  watch,
} = useForm({
  mode: "onChange",

  shouldFocusError: true,
});


const [drawingErr, setDrawingErr] = useState({
  anyOtherdoc: false,
});

const [open, setOpen] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [loader, setLoader] = useState(false);
  const [fileStoreId, setFileStoreId] = useState({});
  const [spaction, setSPAction] = useState("");
  const [comment, setComment] = useState("");
  const [anyOtherdoc, setAnyotherDoc] = useState("");

const getDocumentData = async (file, fieldName) => {
  if (selectedFiles.includes(file.name)) {
    setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tenantId", "hr");
  formData.append("module", "property-upload");
  formData.append("tag", "tag-property");
  setLoader(true);
  try {
    const Resp = await axios.post("/filestore/v1/files", formData, {});
    setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
    setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
    setSelectedFiles([...selectedFiles, file.name]);
    setLoader(false);
    setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
  } catch (error) {
    setLoader(false);
    return error.message;
  }
};

// End


  const contentFieldChanaged = (data) => {

    setPost({ ...post, 'content': data })
    // const handlemodalsubmit = async () => {
  
      const postData = {
             requestInfo: {
               api_id: "1",
               ver: "1",
               ts: null,
               action: "create",
               did: "",
               key: "",
               msg_id: "",
               requester_id: "",
               authToken: authToken,
             },
             egScrutiny: {
               applicationId: id,
               comment: post.content,
               fieldValue: "true",
               fieldIdL: "Noting",
               isApproved: "Noting",
               isLOIPart: "",
               userid: userInfo?.id || null,
               serviceId: "123",
               documentId: fileStoreId,
               // ts: dateTime.toUTCString(),
               bussinessServiceName : "NewTL",
               designation : designation,
               name : userInfo?.name || null,
               employeeName : userInfo?.name || null,
              role : filterDataRole,
              applicationStatus : applicationStatus
             },
           };
     
           try {
             const Resp = axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
               return response.data;
             });
           } catch (error) {
             console.log(error);
           }
           handleGetNotingRemarkssValues(id)
           // handleGetFiledsStatesById(id);
           // handleGetRemarkssValues(id);
           // handleRoles(id)
           // console.log("response from API", Resp);
           // props?.remarksUpdate({ data: RemarksDeveloper.data });
         // } else {
         //   props?.passmodalData();
         // }
      //  };


}



const handlemodalsubmit = async () => {
 
  const postData = {
         requestInfo: {
           api_id: "1",
           ver: "1",
           ts: null,
           action: "create",
           did: "",
           key: "",
           msg_id: "",
           requester_id: "",
           authToken: authToken,
         },
         egScrutiny: {
           applicationId: id,
           comment: post.content,
           fieldValue: "true",
           fieldIdL: "Noting",
           isApproved: "Noting",
           isLOIPart: "",
           userid: userInfo?.id || null,
           serviceId: "123",
           documentId: fileStoreId,
           // ts: dateTime.toUTCString(),
           bussinessServiceName : "NewTL",
           designation : designation,
           name : userInfo?.name || null,
           employeeName : userInfo?.name || null,
          role : filterDataRole,
          applicationStatus : applicationStatus
         },
       };
 
       try {
         const Resp = await axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
           return response.data;
         });
       } catch (error) {
         console.log(error);
       }
      await handleGetNotingRemarkssValues(id)
      setOpen(true);

      const ScrollToBottom = () =>{
        console.log("regergergregegegreg",document.getElementById("historyList").scrollHeight)
        document.getElementById("historyList").scroll({
          top:document.getElementById("historyList").scrollHeight,
          behavior:'smooth',
        });

      };
      // if(){
        ScrollToBottom();
      // }
       // handleGetFiledsStatesById(id);
       // handleGetRemarkssValues(id);
       // handleRoles(id)
       // console.log("response from API", Resp);
       // props?.remarksUpdate({ data: RemarksDeveloper.data });
     // } else {
     //   props?.passmodalData();
     // }
   };


// console.log("DATAEDI435435", editorState ,convertedContent , setState );


// const datacomments = post.content !== null;
// const applicationsStatusa = applicationStatus;
// useEffect(() => {
  
//   setInterval((applicationsStatusa ,datacomments ) => {
//     (() => {
//       ;
      
//       const postData = {   
//       requestInfo: {
//         api_id: "1",
//         ver: "1",
//         ts: null,
//         action: "create",
//         did: "",
//         key: "",
//         msg_id: "",
//         requester_id: "",
//         authToken: authToken,
//       },
//       egScrutiny: {
//         applicationId: id,
//         comment: datacomments,
//         fieldValue: "true",
//         fieldIdL: "Noting",
//         isApproved: "Noting",
//         isLOIPart: "",
//         userid: userInfo?.id || null,
//         serviceId: "123",
//         documentId: null,
//         // ts: dateTime.toUTCString(),
//         bussinessServiceName : "NewTL",
//         designation : designation,
//         name : userInfo?.name || null,
//         employeeName : userInfo?.name || null,
//        role : filterDataRole,
//        applicationStatus : applicationsStatusa
//       },
//     };
//       try {
//         const Resps = await axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
//           return response.data;
//         });
//       } catch (error) {
//         console.log(error);
//       }
//       // normal
//       //   .then(({ data }) => {
//       //     console.log(data);
//       //     console.log(data["Time Series (5min)"]);
//       //     for (let key in data["Time Series (5min)"]) {
//       //       setStocksX((prev) => [...prev, key]);
//       //       setStocksY((prev) => [
//       //         ...prev,
//       //         data["Time Series (5min)"][key]["1. open"]
//       //       ]);
//       //     }
//       //     //console.log(stocksX, stocksY);
//       //   });
//       //   normal
//     })();
//   }, 30000);
// });


// var timer ;

// function startTimer(){
//   console.log("Time Start Now");
//   timer = setInterval(function(){
//     console.log("FuctionalApiCall");
//     const handlemodalsubmit = async () => {
  
//       const postData = {
//              requestInfo: {
//                api_id: "1",
//                ver: "1",
//                ts: null,
//                action: "create",
//                did: "",
//                key: "",
//                msg_id: "",
//                requester_id: "",
//                authToken: authToken,
//              },
//              egScrutiny: {
//                applicationId: id,
//                comment: post.content,
//                fieldValue: "true",
//                fieldIdL: "Noting",
//                isApproved: "Noting",
//                isLOIPart: "",
//                userid: userInfo?.id || null,
//                serviceId: "123",
//                documentId: null,
//                // ts: dateTime.toUTCString(),
//                bussinessServiceName : "NewTL",
//                designation : designation,
//                name : userInfo?.name || null,
//                employeeName : userInfo?.name || null,
//               role : filterDataRole,
//               applicationStatus : applicationStatus
//              },
//            };
     
//            try {
//              const Resp = await axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
//                return response.data;
//              });
//            } catch (error) {
//              console.log(error);
//            }
//            handleGetNotingRemarkssValues(id)
//            // handleGetFiledsStatesById(id);
//            // handleGetRemarkssValues(id);
//            // handleRoles(id)
//            // console.log("response from API", Resp);
//            // props?.remarksUpdate({ data: RemarksDeveloper.data });
//          // } else {
//          //   props?.passmodalData();
//          // }
//        };
//   }, 50000);
// }
// function stoptimer(){
//   console.log("Stop Time Now");
//   clearInterval(timer);
// }







// const handlemodalsubmit = (event) => {

//     event.preventDefault();

//     console.log(post)
// }
    // if (post.title.trim() === '') {
    //     toast.error("post  title is required !!")
    //     return;
    // }

    // if (post.content.trim() === '') {
    //     toast.error("post content is required !!")
    //     return
    // }


//   const handlemodalsubmit = (data) => console.log(data);


const viewDocument = async (documentId) => {
  try {
    const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
    const FILDATA = response.data?.fileStoreIds[0]?.url;
    window.open(FILDATA);
  } catch (error) {
    console.log(error);
  }
};

const downloadDocument = async (documentId) => {
  try {
    const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
    const url = response.data?.fileStoreIds[0]?.url;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await res.blob();
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = `${documentId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
};

const handalfinal = () => {
  setOpen(false);
}

console.log("AkashNEWFile" , content , editor , config ,post.content );
console.log("AkashfileStoreId" , fileStoreId );
  return (
    <div className="App">
      {/* <h1>React Editors</h1>
      <h2>Start editing to see some magic happen!</h2> */}
      {/* <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => contentFieldChanaged(newContent)}
        config={config}
        onBlur={handleUpdate}
        onChange={(newContent) => {handlemodalsubmit}}
      /> */}
         <div  id="historyList">
          <Card style={{backgroundColor: "rgb(255, 217, 84)"}}>
          <p class="text-center"><h3><b>Add Noting</b></h3></p>
          </Card>
          {/* <div 
          
        
           style={{ backgroundColor: "#ddf2cf" , fontSize: 16 }}></div> */}

<div>
  
            <div>
                {/* <label htmlFor="Developer Details">
                {`${t("SP_APPLICANT_OTHER_RELEVANT_DOCUMENT")}`}
                  <span class="text-danger font-weight-bold mx-2">*</span>
                </label> */}
                </div>
                <div style={{padding: "6px"}}>
                {/* <label for="file-input-11">
                          <FileUploadIcon color="primary" />
                        </label> */}
                        <input
                          type="file"
                          className="form-control"
                          // {...register("certifieadCopyOfThePlan")}
                          accept="application/pdf/jpeg/png"
                          id="file-input-11"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherdoc")}
                          // style={{ display: "none" }}
                        />
                        {/* {fileStoreId?.anyOtherdoc ? (
                          <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.anyOtherdoc)}>
                            {" "}
                          </VisibilityIcon>
                        ) : (
                          ""
                        )} */}
                        {/* {applicationId && !fileStoreId?.anyOtherdoc && ( */}
                          {/* <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => downloadDocument(anyOtherdoc)}>
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => viewDocument(anyOtherdoc)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div> */}
                        {/* )} */}
                </div>
          </div>

         <JoditEditor
                                className="jodit-react-container"
                               ref={editor}
                                value={post.content}

                                onChange={(newContent) => {contentFieldChanaged(newContent)}}
                                // onClick={startTimer}
                            />
      {/* <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
            Save Noting
          </Button>
      <Button style={{ textAlign: "right" }} onClick={startTimer}>
            Save Noting
          </Button> */}


          
      <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
           Final Noting
          </Button>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
    <Dialog open={open} onClose={handlemodalsubmit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" style={{
    textAlign: "center",
    color: "#ffff",
    backgroundColor: "#000000b0"}}>
          <DialogTitle id="alert-dialog-title" style={{ fontSize: "xx-large", background: "#000000b0" , color: "#ffff"}}>Noting Remarks Submission</DialogTitle>
          <DialogContent style={{ background: "#000000b0"}}>
            <DialogContentText id="alert-dialog-description" style={{textAlign: "center", color: "#ffff" , fontSize: "x-large"}}>
              <p ><CheckCircleIcon style={{fontSize: "-webkit-xxx-large;"}}></CheckCircleIcon></p>
              <p>
                Thank You {" "}
                {/* <span>
                  <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
                </span> */}
              </p>
              <p>
                The Noting Remarks was submitted successfully !!<span style={{ padding: "5px", color: "blue" }}></span> 
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handalfinal} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  
  );
}












