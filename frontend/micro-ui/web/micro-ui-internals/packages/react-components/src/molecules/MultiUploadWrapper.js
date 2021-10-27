import React, { useEffect, useReducer, useState } from "react"
import UploadFile from "../atoms/UploadFile"
import CardLabelError from "../atoms/CardLabelError";


const fileValidationStatus = (file, regex, maxSize) => {
    const status = { valid: true, name: file?.name, error: '' };

    if (!file) return;

    if (!regex.test(file.type) && (file.size / 1024 / 1024) > maxSize) {
        status.valid = false; status.error = `UnSupported File Type : ${file.type?.substring(0,4)} and File Size exceeds ${maxSize} mb `;
    }

    if (!regex.test(file.type)) {
        status.valid = false; status.error = `UnSupported File Type : ${file.type}`
    }

    if ((file.size / 1024 / 1024) > maxSize) {
        status.valid = false; status.error = `File Size exceeds ${maxSize} mb`
    }

    return status;
}
const checkIfAllValidFiles = (files, regex, maxSize) => {
    if (!files.length || !regex.length || !maxSize) return[{}, false];
    const messages = [];
    let isInValidGroup = false;
    for (let file of files) {
        const fileStatus = fileValidationStatus(file, regex, maxSize);
        if (!fileStatus.valid) {
            isInValidGroup = true;
        }
        messages.push(fileStatus);
    }
    return [messages, isInValidGroup];
}


const MultiUploadWrapper = ({ module = "PGR", tenantId = "pb", getFormState, requestSpecifcFileRemoval, setuploadedstate = [], showHintBelow, hintText, allowedFileTypesRegex, allowedMaxSizeInMB }) => {

    const FILES_UPLOADED = "FILES_UPLOADED"
    const TARGET_FILE_REMOVAL = "TARGET_FILE_REMOVAL"

    const [fileErrors, setFileErrors] = useState([]);

    const uploadMultipleFiles = (state, payload) => {
        const { files, fileStoreIds } = payload;
        const filesData = Array.from(files)
        const newUploads = filesData?.map((file, index) => [file.name, { file, fileStoreId: fileStoreIds[index] }])
        return [...state, ...newUploads]
    }

    const removeFile = (state, payload) => {
        const __indexOfItemToDelete = state.findIndex(e => e[0] === payload.file.name)
        const mutatedState = state.filter((e, index) => index !== __indexOfItemToDelete)
        return mutatedState
    }

    const uploadReducer = (state, action) => {
        switch (action.type) {
            case FILES_UPLOADED:
                return uploadMultipleFiles(state, action.payload)
            case TARGET_FILE_REMOVAL:
                return removeFile(state, action.payload)
            default:
                return console.warn("ACTION NOT DEFINED")
        }
    }

    const onUploadMultipleFiles = async (e) => {
        setFileErrors([])
        const { files } = e.target;
        if (!files.length) return;
        const [validationMsg, error] = checkIfAllValidFiles(files, allowedFileTypesRegex, allowedMaxSizeInMB);
        if (!error) {
            try{
                const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, e.target.files, tenantId)
                return dispatch({ type: FILES_UPLOADED, payload: { files: e.target.files, fileStoreIds } })
            }catch(err){
                console.error('Failed to upload files', err);
            }
            } else {
                setFileErrors(validationMsg)
        }
    }
    const [state, dispatch] = useReducer(uploadReducer, [...setuploadedstate])

    useEffect(() => getFormState(state), [state])

    useEffect(() => {
        requestSpecifcFileRemoval ? dispatch({ type: TARGET_FILE_REMOVAL, payload: requestSpecifcFileRemoval }) : null
    }, [requestSpecifcFileRemoval])

    return (
        <div>
            <UploadFile
                onUpload={(e) => onUploadMultipleFiles(e)}
                removeTargetedFile={(fileDetailsData) => dispatch({ type: TARGET_FILE_REMOVAL, payload: fileDetailsData })}
                uploadedFiles={state}
                multiple={true}
                showHintBelow={showHintBelow}
                hintText={hintText}
                onDelete={()=>{
                    setFileErrors([])
                }}
            />
            <span style={{display:'flex'}}>
            {fileErrors.length ? fileErrors.map(({ valid, name, type, size, error }) => (
                valid ? null : <CardLabelError>{`${error} filename : ${name?.substring(0,10)}...`}</CardLabelError>
            )):null}
            </span>
        </div>)
}

export default MultiUploadWrapper