import React from 'react';
import { SendIcon } from "./svgindex";

function SendButton({ action, buttonStyle }) {
    return (
        <button style={buttonStyle} onClick={action}>
            <SendIcon />
        </button>
    );
}

export default SendButton;