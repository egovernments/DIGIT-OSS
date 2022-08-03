import React from "react";
import PropTypes from "prop-types";
import { UnMaskComponent } from "..";
const KeyNote = ({ keyValue, note, caption, noteStyle, children, privacy }) => {
  return (
    <div className="key-note-pair">
      <h3>{keyValue}</h3>
      <div style={{display : "inline-flex"}}>
      <p style={noteStyle}>{note}</p>
      { privacy && (
            <span style={{ display: "inline-flex", width: "fit-content", marginLeft: "10px", marginTop: "5px" }}>
              {/*  
                Feature :: Privacy
                privacy object set to the Mask Component
              */}
              <UnMaskComponent privacy={privacy}></UnMaskComponent>
            </span>
           )}
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
