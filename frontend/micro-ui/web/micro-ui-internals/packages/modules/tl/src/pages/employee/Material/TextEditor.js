import React, { useEffect, useState } from "react";
import { convertFromRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertFromHTML, convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useParams } from "react-router-dom";
import axios from "axios";

function AddPost({ modal = false, state, setState , applicationStatus}) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);

  
  // const applicationStatus = props.applicationStatus ;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const dateTime = new Date();
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const { id } = useParams();
  const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;
  // useEffect(() => {
  //   let html = convertToHTML(editorState?.getCurrentContent());
  //   if (modal) {
  //     setState(html);

  //   }
  //   else {
  //     setConvertedContent(html);
  //   }

  // }, [editorState]);
  console.log("DATAEDITOR", editorState);
  console.log("DATAEDITOR", setState);
  console.log("DATAEDITOR", convertedContent);
  //  console.log();
  //  console.log();

  const handleEditorStateChange = (state) => {
    setEditorState(state);
    let html = convertToHTML(state?.getCurrentContent());
    if (modal) {
      setState(html);
    } else {
      setConvertedContent(html);
    }
  };




 
  const handlemodalsubmit = async () => {
    // if (status) {
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
          comment: convertedContent,
          fieldValue: "true",
          fieldIdL: "Noting",
          isApproved: "Noting",
          isLOIPart: "",
          userid: userInfo?.id || null,
          serviceId: "123",
          documentId: null,
          ts: dateTime.toUTCString(),
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
      // handleGetFiledsStatesById(id);
      // handleGetRemarkssValues(id);
      // handleRoles(id)
      // console.log("response from API", Resp);
      // props?.remarksUpdate({ data: RemarksDeveloper.data });
    // } else {
    //   props?.passmodalData();
    // }
  };





  // useEffect(() => {
  //   if (state) {
  //     const contentState = convertFromHTML(state);
  //     const newEditorState = EditorState.createWithContent(contentState);
  //     setEditorState(newEditorState);
  //   } else {
  //     setEditorState(()=>EditorState.createEmpty())
  //   }
  // }, [state]);

  return (
    <div
      className="text-editorEmp"
      style={{
        border: 1,
        width: "100%",
        // margin: 5,
        padding: 3,
       
      }}
    >
      {/* <header className="App-header">Rich Text Editor Example</header> */}
      
      <Editor
       style={{
        minHeight: "320px",
      }}
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        // wrapperClassName="wrapper-class"
        editorClassName="editor-class"
       
        toolbarClassName="toolbar-class"
      />
      {!modal && <button onClick={handlemodalsubmit}>Submit</button>}
      {/* () => console.log(convertedContent)  */}
    </div>
  );
}

export default AddPost;
