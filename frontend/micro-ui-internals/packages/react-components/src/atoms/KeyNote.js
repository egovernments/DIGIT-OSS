import React from "react";

const KeyNote = ({ keyValue, note }) => {
  return (
    <div className="key-note-pair">
      <h3>{keyValue}</h3>
      <p>{note}</p>
    </div>
  );
};

export default KeyNote;
