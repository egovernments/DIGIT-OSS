import React, { useEffect, useReducer, useState } from "react"
import UploadFile from "../atoms/UploadFile"

const displayError = ({ t, error, name }, customErrorMsg) => (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="validation-error">{customErrorMsg ? t(customErrorMsg) : t(error)}</div>
        <div className="validation-error">{customErrorMsg ? '' : `${t('ES_COMMON_DOC_FILENAME')} : ${name} ...`}</div>
    </span>
)

const fileValidationStatus = (file, regex, maxSize, t) => {
    
    const status = { valid: true, name: file?.name?.substring(0, 15), error: '' };
    if (!file) return;

    if (!regex.test(file.type) && (file.size / 1024 / 1024) > maxSize) {
        status.valid = false; status.error = t(`NOT_SUPPORTED_FILE_TYPE_AND_FILE_SIZE_EXCEEDED_5MB`);
    }

    if (!regex.test(file.type)) {
        status.valid = false; status.error = t(`NOT_SUPPORTED_FILE_TYPE`);
    }

    if ((file.size / 1024 / 1024) > maxSize) {
        status.valid = false; status.error = t(`FILE_SIZE_EXCEEDED_5MB`);
    }

    return status;
}
const checkIfAllValidFiles = (files, regex, maxSize, t, maxFilesAllowed, state) => {
    if (!files.length || !regex || !maxSize) return [{}, false];
    
    // added another condition files.length > 0 , for when  user uploads files more than maxFilesAllowed in one go the
    const uploadedFiles = state.length + 1
    if ( maxFilesAllowed && (uploadedFiles  > maxFilesAllowed || files.length > maxFilesAllowed)) return [[{ valid: false, name: files[0]?.name?.substring(0, 15), error: t(`FILE_LIMIT_EXCEEDED`)}],true]
   
    // Adding a check for fileSize > maxSize
    // const maxSizeInBytes = maxSize * 1000000
    // if(files?.some(file => file.size > maxSizeInBytes)){
    //     return [[{ valid: false, name: "", error: t(`FILE_SIZE_EXCEEDED_5MB`) }], true]
    // }

    const messages = [];
    let isInValidGroup = false;
    for (let file of files) {
        const fileStatus = fileValidationStatus(file, regex, maxSize, t);
        if (!fileStatus.valid) {
            isInValidGroup = true;
        }
        messages.push(fileStatus);
    }
    
    return [messages, isInValidGroup];
}

// can use react hook form to set validations @neeraj-egov
const MultiUploadWrapper = ({ t, module = "PGR", tenantId = Digit.ULBService.getStateId(), getFormState, requestSpecifcFileRemoval, extraStyleName = "", setuploadedstate = [], showHintBelow, hintText, allowedFileTypesRegex = /(.*?)(jpg|jpeg|webp|aif|png|image|pdf|msword|openxmlformats-officedocument)$/i, allowedMaxSizeInMB = 10, acceptFiles = "image/*, .jpg, .jpeg, .webp, .aif, .png, .image, .pdf, .msword, .openxmlformats-officedocument, .dxf", maxFilesAllowed, customClass="", customErrorMsg,containerStyles }) => {
    const FILES_UPLOADED = "FILES_UPLOADED"
    const TARGET_FILE_REMOVAL = "TARGET_FILE_REMOVAL"

    const [fileErrors, setFileErrors] = useState([]);
    const [enableButton, setEnableButton] = useState(true)

    const uploadMultipleFiles = (state, payload) => {
        const { files, fileStoreIds } = payload;
        const filesData = Array.from(files)
        const newUploads = filesData?.map((file, index) => [file.name, { file, fileStoreId: fileStoreIds[index] }])
        return [...state, ...newUploads]
    }

    const removeFile = (state, payload) => {
        const __indexOfItemToDelete = state.findIndex(e => e[1].fileStoreId.fileStoreId === payload.fileStoreId.fileStoreId)
        const mutatedState = state.filter((e, index) => index !== __indexOfItemToDelete)
        setFileErrors([])
        return [...mutatedState]
    }

    const uploadReducer = (state, action) => {
        switch (action.type) {
            case FILES_UPLOADED:
                return uploadMultipleFiles(state, action.payload)
            case TARGET_FILE_REMOVAL:
                return removeFile(state, action.payload)
            default:
                break;
        }
    }

    const [state, dispatch] = useReducer(uploadReducer, [...setuploadedstate])
    
    const onUploadMultipleFiles = async (e) => {
        setEnableButton(false)
        setFileErrors([])
        const files = Array.from(e.target.files);

        if (!files.length) return;
        const [validationMsg, error] = checkIfAllValidFiles(files, allowedFileTypesRegex, allowedMaxSizeInMB, t, maxFilesAllowed, state);
        
        if (!error) {
            try {
                const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, e.target.files, tenantId)
                setEnableButton(true)
                return dispatch({ type: FILES_UPLOADED, payload: { files: e.target.files, fileStoreIds } })
            } catch (err) {
                setEnableButton(true)
            }
        } else {
            setFileErrors(validationMsg)
            setEnableButton(true)
        }
    }

    useEffect(() => getFormState(state), [state])

    useEffect(() => {
        requestSpecifcFileRemoval ? dispatch({ type: TARGET_FILE_REMOVAL, payload: requestSpecifcFileRemoval }) : null
    }, [requestSpecifcFileRemoval])

    return (
        <div style={containerStyles}>
            <UploadFile
                onUpload={(e) => onUploadMultipleFiles(e)}
                removeTargetedFile={(fileDetailsData) => dispatch({ type: TARGET_FILE_REMOVAL, payload: fileDetailsData })}
                uploadedFiles={state}
                multiple={true}
                showHintBelow={showHintBelow}
                hintText={hintText}
                extraStyleName={extraStyleName}
                onDelete={() => {
                    setFileErrors([])
                }}
                accept={acceptFiles}
                message={t(`WORKS_NO_FILE_SELECTED`)}
                customClass={customClass}
                enableButton={enableButton}
            />
            <span style={{ display: 'flex' }}>
                {fileErrors.length ? fileErrors.map(({ valid, name, type, size, error }) => (
                    valid ? null : displayError({ t, error, name }, customErrorMsg)
                )) : null}
            </span>
        </div>)
}

export default MultiUploadWrapper