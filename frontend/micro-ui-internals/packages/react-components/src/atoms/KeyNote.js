import React from "react";
import PropTypes from "prop-types";

const KeyNote = ({ keyValue, note }) => {
  return (
    <div className="key-note-pair">
      <h3>{keyValue}</h3>
      <p>{note}</p>
    </div>
  );
};

KeyNote.propTypes = {
  keyValue: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
};

KeyNote.defaultProps = {
  keyValue: "",
  note: "",
};

export default KeyNote;
