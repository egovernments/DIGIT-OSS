import React, { Fragment, useEffect, useState } from 'react';
import TextArea from '../atoms/TextArea';
import CustomButton from '../atoms/SendButton';
import GalleryButton from './GalleryButton';
import Toast from '../atoms/Toast';
import TextInput from '../atoms/TextInput';

function UserInput(props) {
    const [OptionList, setOptionDetails] = useState([]);
    const [textData, setTextData] = useState("");
    const [fileStoreIds, setFileStoreIds] = useState([]);
    const [showToast, setShowToast] = useState(null);
    const User = Digit.UserService.getUser();

    const textAreaStyling = {
        position: "absolute",
        bottom: "11%",
        right: "6%",
        fontSize: "30px",
        color: "#F47738",
        border: "none",
        outline: "none",
    }

    const textInputStyling = {
        position: "absolute",
        bottom: "24%",
        right: "4%",
        fontSize: "30px",
        color: "#F47738",
        border: "none",
        outline: "none",
    }

    const handleSubmit = () => {
        let isTextValid = true
        let itemName = 'textArea'
        if (props.stepDetails.message && props.stepDetails.message.includes('mobile number')) {
            itemName = 'mobile number'
            if (textData.length !== 10 || !(new RegExp(/^[0-9]*$/).test(textData))) {
                isTextValid = false
                setShowToast({ key: true, label: "Invalid Phone Number. Please enter a new Number and try again." })
                setTimeout(() => {
                    setShowToast(null)
                }, 3000);
            }
        } else if (props.stepDetails.message && props.stepDetails.message.includes('Application ID')) {
            itemName = 'Application ID'
            if (textData.length <= 20 && new RegExp(/^[A-Za-z0-9-]*$/).test(textData)) { } else {
                isTextValid = false
                setShowToast({ key: true, label: 'Invalid Application ID. Please enter a new Application ID and try again.' })
                setTimeout(() => {
                    setShowToast(null)
                }, 4000);
            }
        }
        if (textData != "" && isTextValid) {
            let fileStoreId = ''
            if (fileStoreIds.length) {
                fileStoreId = fileStoreIds.toString()
            }
            const itemDetails = {
                key: textData,
                value: textData,
                type: "button",
                fileStoreId: fileStoreId,
                itemName: itemName
            }
            props.handleSubmit(props.stepDetails, itemDetails)
            console.log(textData)
        }
    }

    const handleChange = (e) => {
        setTextData((e.target.value).trim())
    }

    const handleUpload = (img) => {
        setFileStoreIds(img)
    }

    useEffect(() => {
        setOptionDetails(props.data)
    }, [props.data])

    useEffect(() => {
        setOptionDetails(props.data)
    }, [])

    
// render multi line text Area in case of comment 
// and single line text area for mobile number and Application ID
    return (
        OptionList.map((i) => (
            <>
                <div className='userInputContainer'>
                    <p style={{
                        color: "#505A5F",
                        marginBottom: "5px",
                        fontSize: "13px"
                    }}>{i.value}</p>
                    {props.stepDetails.optionType === "textarea" ?
                        <>
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
                            <CustomButton action={handleSubmit} buttonStyle={textAreaStyling} /> </> :
                        <>
                            <TextInput onChange={handleChange} placeholder={"Type here"} style={{
                                borderRadius: "8px",
                                border: "1px solid #FFFFFF",
                                background: "#FFFFFF",
                                width: "100%",
                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)",
                                overflow: "hidden",
                                margin: "0px",
                            }} onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    handleSubmit()
                                }
                            }}></TextInput>
                            <CustomButton action={handleSubmit} buttonStyle={textInputStyling} />
                        </>
                    }
                </div>

                {props.stepDetails.step === 'last' && <GalleryButton
                    header=""
                    tenantId={User.info.tenantId}
                    cardText=""
                    onPhotoChange={handleUpload}
                    uploadedImages={null} />}
                {showToast && (
                    <Toast
                        error={showToast.key}
                        label={showToast.label}
                        onClose={() => {
                            setShowToast(null);
                        }}
                    />
                )}
            </>
        ))
    );
}

export default UserInput;
