import React from "react";
import PropTypes from "prop-types";
import { WrapUnMaskComponent } from "..";
const KeyNote = ({ keyValue, note, caption, noteStyle, children, privacy }) => {
  return (
    <div className="key-note-pair">
      <h3>{keyValue}</h3>
      <div style={{display : "inline-flex"}}>
      {privacy && <p style={noteStyle}>
        <WrapUnMaskComponent value={note} iseyevisible={note?.includes("*")?true:false} privacy={privacy}></WrapUnMaskComponent>
        </p>}
      {!privacy && <p style={noteStyle}>{note}</p>}
      </div>
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
