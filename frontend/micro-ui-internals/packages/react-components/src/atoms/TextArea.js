import React from "react";

const TextArea = (props) => {
  const user_type = Digit.SessionStorage.get("user_type") === "employee" ? true : false;

  return (
    <textarea
      name={props.name}
      ref={props.inputRef}
      value={props.value}
      onChange={props.onChange}
      className={user_type ? "employee-card-textarea" : "card-textarea"}
    ></textarea>
  );
};

export default TextArea;
