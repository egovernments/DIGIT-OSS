import React from "react";

const CustomButton = ({ text, onClick, selected }) => {
  return (
    <React.Fragment>
      <button className={selected ? "customBtn-selected" : "customBtn"} onClick={onClick}>
        {text}
      </button>
    </React.Fragment>
  );
};

export default CustomButton;
