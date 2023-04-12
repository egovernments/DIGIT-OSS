import React, { useEffect, useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function AddPost({modal=false,state , setState}) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContent, setConvertedContent] = useState(null);
  
  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    if (modal) {
      setState(html);
      
    }
    else{
      setConvertedContent(html); 
    }
  
  }, [editorState]);
 console.log("DATAEDITOR",editorState);
 console.log("DATAEDITOR",setState);
//  console.log();
//  console.log();

  return (
    <div className="text-editorEmp">
      {/* <header className="App-header">Rich Text Editor Example</header> */}
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      {
        !modal && 
        <button onClick={() => console.log(convertedContent)}>Submit</button>
      }
    </div>
    
  );
  
}

export default AddPost;