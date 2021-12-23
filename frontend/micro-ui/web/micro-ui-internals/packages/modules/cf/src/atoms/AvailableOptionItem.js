import React from 'react';

function AvailableOptionItem({ title, action }) {

    return (
        <div className="availableOptionItem" onClick={action} >
            {title}
        </div>
    );
}

export default AvailableOptionItem;