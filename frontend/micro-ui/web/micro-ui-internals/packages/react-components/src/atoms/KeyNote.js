import React from "react";
import PropTypes from "prop-types";

const KeyNote = ({ keyValue, note, caption, noteStyle, children }) => {
  return (
    <div className="key-note-pair">
      <h3>{keyValue}</h3>
      <p style={noteStyle}>{note}</p>
      <p className="caption">{caption}</p>
      {children}
    </div>
  );
};

KeyNote.propTypes = {
  keyValue: PropTypes.string,
  note: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noteStyle: PropTypes.any,
};

KeyNote.defaultProps = {
  keyValue: "",
  note: "",
  noteStyle: {},
};

export default KeyNote;
