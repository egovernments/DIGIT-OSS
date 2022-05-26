import React, { useEffect, useReducer, useState } from "react"
import UploadFile from "../atoms/UploadFile"

const displayError = ({ t, error, name }) => (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="validation-error">{t(error)}</div>
        <div className="validation-error">{`${t('ES_COMMON_DOC_FILENAME')} : ${name} ...`}</div>
    </span>
)

const fileValidationStatus = (file, regex, maxSize, t) => {
    const status = { valid: true, name: file?.name?.substring(0, 15), error: '' };
    if (!file) return;

    if (!regex.test(file.type) && (file.size / 1024 / 1024) > maxSize) {
        status.valid = false; status.error = t(`NOT_SUPPORTED_FILE_TYPE_AND_FILE_SIZE_EXCEEDED`);
    }

    if (!regex.test(file.type)) {
        status.valid = false; status.error = t(`NOT_SUPPORTED_FILE_TYPE`);
    }

    if ((file.size / 1024 / 1024) > maxSize) {
        status.valid = false; status.error = t(`FILE_SIZE_EXCEEDED`);
    }

    return status;
}
const checkIfAllValidFiles = (files, regex, maxSize, t) => {
    if (!files.length || !regex || !maxSize) return [{}, false];
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
const MultiUploadWrapper = ({ t, module = "PGR", tenantId = Digit.ULBService.getStateId(), getFormState, requestSpecifcFileRemoval, extraStyleName="",setuploadedstate = [], showHintBelow, hintText, allowedFileTypesRegex=/(.*?)(jpg|jpeg|webp|aif|png|image|pdf|msword|openxmlformats-officedocument)$/i, allowedMaxSizeInMB=10, acceptFiles = "image/*, .jpg, .jpeg, .webp, .aif, .png, .image, .pdf, .msword, .openxmlformats-officedocument, .dxf" }) => {
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

    const onUploadMultipleFiles = async (e) => {
        setFileErrors([])
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const [validationMsg, error] = checkIfAllValidFiles(files, allowedFileTypesRegex, allowedMaxSizeInMB, t);
        if (!error) {
            try {
                const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, e.target.files, tenantId)
                return dispatch({ type: FILES_UPLOADED, payload: { files: e.target.files, fileStoreIds } })
            } catch (err) {
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
                extraStyleName={extraStyleName}
                onDelete={() => {
                    setFileErrors([])
                }}
                accept={acceptFiles}
            />
            <span style={{ display: 'flex' }}>
                {fileErrors.length ? fileErrors.map(({ valid, name, type, size, error }) => (
                    valid ? null : displayError({ t, error, name })
                )) : null}
            </span>
        </div>)
}

export default MultiUploadWrapper