import React from 'react';

const AvailableOptionItem = ({ title, action }) => {

    return (
        <div className="availableOptionItem" onClick={action} >
            {title}
        </div>
    );
}

export default AvailableOptionItem;