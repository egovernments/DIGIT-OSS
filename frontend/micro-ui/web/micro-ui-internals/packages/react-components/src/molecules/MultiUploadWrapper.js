import React, { useEffect, useReducer } from "react"
import UploadFile from "../atoms/UploadFile"

const MultiUploadWrapper = ({module="PGR", tenantId="pb", getFormState, requestSpecifcFileRemoval, setuploadedstate=[], showHintBelow, hintText}) => {

    const FILES_UPLOADED = "FILES_UPLOADED"
    const TARGET_FILE_REMOVAL = "TARGET_FILE_REMOVAL"

    const uploadMultipleFiles = (state, payload) => {
        const {files, fileStoreIds} = payload;
        const filesData = Array.from(files)
        const newUploads = filesData?.map( (file, index) => [file.name, { file, fileStoreId: fileStoreIds[index] }])
        return [...state, ...newUploads]
    }

    const removeFile = (state, payload) => {
        const __indexOfItemToDelete = state.findIndex( e => e[0] === payload.file.name )
        const mutatedState = state.filter((e, index) => index !== __indexOfItemToDelete)
        return mutatedState
    }

    const uploadReducer = (state, action) => {
        switch(action.type){
            case FILES_UPLOADED:
                return uploadMultipleFiles(state, action.payload)
            case TARGET_FILE_REMOVAL:
                return removeFile(state, action.payload)
            default:
                return console.warn("ACTION NOT DEFINED")
        }
    }

    const onUploadMultipleFiles = async(e) => {
        const {data: {files: fileStoreIds} = {}} = await Digit.UploadServices.MultipleFilesStorage(module, e.target.files, tenantId)
        return dispatch({type: FILES_UPLOADED ,payload: {files: e.target.files, fileStoreIds}})
    }
    const [ state, dispatch ] = useReducer(uploadReducer,[...setuploadedstate])

    useEffect(() => getFormState(state),[state])

    useEffect(()=> {
        requestSpecifcFileRemoval ? dispatch({type: TARGET_FILE_REMOVAL ,payload: requestSpecifcFileRemoval}) : null
    },[requestSpecifcFileRemoval])

    return <UploadFile
            onUpload={(e) => onUploadMultipleFiles(e)}
            removeTargetedFile={(fileDetailsData) => dispatch({type: TARGET_FILE_REMOVAL ,payload: fileDetailsData})} 
            uploadedFiles={state}
            multiple={true}
            showHintBelow={showHintBelow}
            hintText={hintText}
        />
}

export default MultiUploadWrapper