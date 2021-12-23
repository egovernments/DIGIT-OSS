import React, { Fragment, useEffect, useState } from 'react';
import CustomButton from '../atoms/CustomButton';

function MultipleSelect(props) {
    const [itemList, setItemList] = useState([]);
    const [itemInfo, setItemInfo] = useState([]);

    const styling = {
        position: "static",
        float: 'right',
        fontSize: "30px",
        color: "#F47738",
        border: "none",
        outline: "none",
        marginTop: "-7px"
    }

    const saveData = (e) => {
        e.preventDefault();
        console.log(itemInfo)
        if (itemInfo.length) {
            props.handleSubmit(props.stepDetails, itemInfo)
        }
    }

    const handleChange = (e) => {
        if (e.target.checked) {
            setItemInfo([
                ...itemInfo,
                {
                    key: e.target.id,
                    value: e.target.name,
                },
            ]);
        } else {
            setItemInfo(
                itemInfo.filter((item) => e.target.id !== item.key),
            );
        }
    }

    useEffect(() => {
        setItemList(props.data)
    }, [props.data])

    useEffect(() => {
        setItemList(props.data)
    }, [])

    return (
        itemList.length ? <form className="textAreaContainer" onSubmit={saveData}>
            <ul style={{ listStyleType: "none" }}>
                {itemList.map((i) => {
                    return (
                        <div className='listContainer'>
                            <label className='textContainer' for={i.key}>{i.value}</label>
                            <input className='inputContainer' type="checkbox" id={i.key} name={i.value} onChange={handleChange} />
                            <label className='labelContainer' for={i.key}></label>
                        </div>
                    )
                })
                }
            </ul>

            <CustomButton buttonStyle={styling} />
        </form>
            : <></>
    );
}

export default MultipleSelect;