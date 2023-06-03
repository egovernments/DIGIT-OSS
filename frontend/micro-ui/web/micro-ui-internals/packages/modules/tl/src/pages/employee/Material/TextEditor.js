import React, { useEffect, useState } from "react";
import { convertFromRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertFromHTML, convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function AddPost({ modal = false, state, setState }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);

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
        margin: 5,
        padding: 3,
        minHeight: "300px",
      }}
    >
      {/* <header className="App-header">Rich Text Editor Example</header> */}
      
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        // wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      {!modal && <button onClick={() => console.log(convertedContent)}>Submit</button>}
    </div>
  );
}

export default AddPost;
