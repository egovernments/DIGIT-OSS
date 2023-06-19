
import React, { useState, useRef  ,useContext} from "react";
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


}

// console.log("DATAEDI435435", editorState ,convertedContent , setState );


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
      handleGetNotingRemarkssValues(id)
      // handleGetFiledsStatesById(id);
      // handleGetRemarkssValues(id);
      // handleRoles(id)
      // console.log("response from API", Resp);
      // props?.remarksUpdate({ data: RemarksDeveloper.data });
    // } else {
    //   props?.passmodalData();
    // }
  };


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

                                onChange={(newContent) => contentFieldChanaged(newContent)}
                                onClick={handlemodalsubmit}
                            />
      <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
            Save Noting
          </Button>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}












