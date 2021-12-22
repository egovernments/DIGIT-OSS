import React, { useState, useEffect } from 'react';
import AvailableOptionItem from '../atoms/AvailableOptionItem';

function AvailableOptionsList(props) {
    const [OptionList, setOptionList] = useState([]);

    const selectItem = (i) => {
        props.onItemSelect(props.stepDetails, i)
    }

    useEffect(() => {
        setOptionList(props.data)
    }, [])

    return (
        <div className="availableOptionList">
            {OptionList.map((i) => {
                return <AvailableOptionItem title={i.value} action={() => selectItem(i)} />
            })}
        </div>
    );
}

export default AvailableOptionsList;