import React from "react";

const ChatBubble = (props) => {
  return (
    <div style={{ margin: "0", display: "flex", width: "100%", justifyContent: props.type === "right" ? "flex-end" : "flex-start" }}>
      <div className={props.type === "right" ? "rightBox" : "leftBox"}>
        <div className={props.type === "right" ? "rightChat" : "leftChat"}></div>
        {props.children}
      </div>
    </div>
  );
};

export default ChatBubble