import React, { Fragment, useEffect, useState } from 'react';
import TextArea from '../atoms/TextArea';
import CustomButton from '../atoms/SendButton';
import GalleryButton from './GalleryButton';
import Toast from '../atoms/Toast';

function UserInput(props) {
    const [OptionList, setOptionDetails] = useState([]);
    const [textData, setTextData] = useState("");
    const [fileStoreIds, setFileStoreIds] = useState([]);
    const [showToast, setShowToast] = useState(null);
    const User = Digit.UserService.getUser();

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
        let isTextValid = true
        if (props.stepDetails.message && props.stepDetails.message.includes('mobile number')) {
            if (textData.length !== 10 || !(new RegExp(/^[0-9]*$/).test(textData))) {
                isTextValid = false
                setShowToast({ key: true, label: "Please enter 10 digits" })
                setTimeout(() => {
                    setShowToast(null)
                }, 2000);
            }
        } else if (props.stepDetails.message && props.stepDetails.message.includes('Application ID')) {
            if (textData.length === 20 && new RegExp(/^[A-Za-z0-9-]*$/).test(textData)) { } else {
                isTextValid = false
                setShowToast({ key: true, label: 'Valid Application Id must me of 20 characters with allowed special character "-"' })
                setTimeout(() => {
                    setShowToast(null)
                }, 2000);
            }
        }
        if (textData != "" && isTextValid) {
            let fileStoreId = ''
            if (fileStoreIds.length) {
                fileStoreId = fileStoreIds.toString()
            }
            const itemDetails = {
                key: "1",
                value: textData,
                type: "button",
                fileStoreId: fileStoreId
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
