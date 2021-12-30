import React, { Fragment, useEffect, useState } from 'react';
import TextArea from '../atoms/TextArea';
import CustomButton from '../atoms/SendButton';
import GalleryButton from './GalleryButton';

function UserInput(props) {
    const [OptionList, setOptionDetails] = useState([]);
    const [textData, setTextData] = useState("");

    const styling = {
        position: "absolute",
        bottom: "11%",
        right: "6%",
        fontSize: "30px",
        color: "#F47738",
        border: "none",
        outline: "none",
    }

    const handleSubmit = () => {
        if (textData != "") {
            const itemDetails = {
                key: "1",
                value: textData,
                type: "button"
            }
            props.handleSubmit(props.stepDetails, itemDetails)
            console.log(textData)
        } else {
            console.log("none")
        }
    }

    const handleChange = (e) => {
        setTextData((e.target.value).trim())
    }

    const handleUpload = (img) => {
        console.log(img)
    }

    useEffect(() => {
        setOptionDetails(props.data)
    }, [props.data])

    useEffect(() => {
        setOptionDetails(props.data)
    }, [])

    return (
        OptionList.map((i) => (
            <>
                <div style={{
                    background: "#FAFAFA",
                    border: "1px solid #D6D5D4",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    height: "fit-content",
                    width: "75%",
                    padding: "10px",
                    position: "relative",
                }}>
                    <p style={{
                        color: "#505A5F",
                        marginBottom: "5px",
                        fontSize: "13px"
                    }}>{i.value}</p>

                    <TextArea onChange={handleChange}
                        style={{
                            resize: "none",
                            borderRadius: "8px",
                            height: "102px",
                            border: "1px solid #FFFFFF",
                            background: "#FFFFFF",
                            width: "100%",
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)",
                            overflow: "hidden",
                            margin: "0px",
                        }}
                        placeholder="Type here"
                    />

                    <CustomButton action={handleSubmit} buttonStyle={styling} />
                </div>
                {props.stepDetails.step === 'last' && <GalleryButton
                    header=""
                    tenantId="pb.amritsar"
                    cardText=""
                    onPhotoChange={handleUpload}
                    uploadedImages={null} />}
            </>
        ))
    );
}

export default UserInput;
