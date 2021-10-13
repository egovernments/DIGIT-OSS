import React, { useEffect, useReducer } from "react"
import UploadFile from "../atoms/UploadFile"

const MultiUploadWrapper = ({module="PGR", tenantId="pb", getFormState, requestSpecifcFileRemoval, setuploadedstate, showHintBelow, hintText}) => {

    const FILES_UPLOADED = "FILES_UPLOADED"
    const TARGET_FILE_REMOVAL = "TARGET_FILE_REMOVAL"
    const SET_UPLOADED_FILE = "SET_UPLOADED_FILE";

    const uploadMultipleFiles = (state, payload) => {
        let mutatedState = new Map(state)
        const {files, fileStoreIds} = payload;
        [...files]?.forEach( (file, index) => mutatedState.set(file.name, { file, fileStoreId: fileStoreIds[index] }))
        return mutatedState
    }

    const removeFile = (state, payload) => {
        let mutatedState = new Map(state);
        mutatedState.delete(payload.file.name)
        return mutatedState
    }

    const setinitailuploadedfiles = (state,payload) => {
        let mutated = new Map(state);
        const files = payload;
        [...files]?.forEach( (file, index) => mutated.set(file.fileName, { file, fileStoreId: file.fileStoreId }))
        return mutated;
    }

    const uploadReducer = (state, action) => {
        switch(action.type){
            case SET_UPLOADED_FILE:
                return setinitailuploadedfiles(state, action.payload)
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
    const [ state, dispatch ] = useReducer(uploadReducer, new Map())

    useEffect(() => {
        setuploadedstate && setuploadedstate.length>0 && state.size == 0 ? dispatch({type: SET_UPLOADED_FILE ,payload: setuploadedstate}) : null
    },[setuploadedstate])

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