import React from "react";

const Paragraph = (props) => {
  const {value, customClassName, customStyle, inputRef} = props;

  return (
    <p className={`fc-paragraph ${customClassName}`} style={customStyle} ref={inputRef}>{value}</p>
  )
}

export default Paragraph;