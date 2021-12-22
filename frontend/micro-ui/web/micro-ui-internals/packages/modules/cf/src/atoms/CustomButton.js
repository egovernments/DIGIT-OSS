import React from 'react';

function CustomButton({ action, buttonStyle }) {
    return (
        <button style={buttonStyle} onClick={action}>
            <svg style={{transform: 'rotate(45deg)'}} width="29" height="29" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 0C4.93 0 0 4.93 0 11C0 17.07 4.93 22 11 22C17.07 22 22 17.07 22 11C22 4.93 17.07 0 11 0ZM14.57 16L11 14.42L7.43 16L7.06 15.63L11 6L14.95 15.63L14.57 16Z" fill="#F47738" />
            </svg>
        </button>
    );
}

export default CustomButton;