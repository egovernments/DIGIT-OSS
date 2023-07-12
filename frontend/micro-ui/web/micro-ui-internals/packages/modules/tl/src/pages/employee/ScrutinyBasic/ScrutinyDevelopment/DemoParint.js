
import React, { useState, useRef ,useEffect  ,useContext} from "react";
import JoditEditor from "jodit-react";
// import { Editor } from "react-draft-wysiwyg";
// import "./styles.css";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";




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
               documentId: null,
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
           documentId: null,
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
console.log("AkashNEWFile" , content , editor , config ,post.content);
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
  );
}












