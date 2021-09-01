import { CardLabel, LabelFieldPair, TextInput, UploadFile } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const SelectULB = ({ userType, t, onSelect, setValue, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {

  const [fileStoreId, setFileStoreId] = useState()
  const [file, setFile] = useState()
  const [url, setUrl] = useState("")
  const [urlDisabled, setUrlDisabled] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const disableUrlField = () => {
    setUrlDisabled(true)
    setUrl("")
  }

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    if (file) uploadFile()
  }, [file])

  useEffect(() => {
    setValue(config.key, fileStoreId)
    if (fileStoreId) disableUrlField()
    else setUrlDisabled(false)
  }, [fileStoreId])

  useEffect(() => {
    console.log(formData, "assac >>> sassa")
    // if(!fileStoreId && url !== formData?.[config.key]) setValue(config.key,url)
  }, [url])

  const uploadFile = async () => {
    try {
      const response = await Digit.UploadServices.Filestorage("engagement", file, tenantId?.split(".")[0]);
      if (response?.data?.files?.length > 0) {
        setFileStoreId(response?.data?.files[0]?.fileStoreId);
      } else {
        setError(t("CS_FILE_UPLOAD_ERROR"));
      }
    } catch (err) {
      console.error("Modal -> err ", err);
    }
  }

  return <React.Fragment>
    <LabelFieldPair>
      <CardLabel>
        {t("ES_COMMON_DOC_DOCUMENT") + "*"}
      </CardLabel>
      <div className="field">
        <Controller
          name={config.key}
          control={control}
          render={(props) =>
            <UploadFile
              id={"cit-engagement-doc"}
              onUpload={selectFile}
              onDelete={() => {
                setFileStoreId(null);
              }}
              message={fileStoreId ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
              textStyles={{ width: "100%" }}
              inputStyles={{ width: "280px" }}
            />}
        />
      </div>
    </LabelFieldPair>

    <LabelFieldPair style={{ margin: "25px" }}>
      <CardLabel></CardLabel>
      <div style={{ textAlign: "center" }} className="field links-wrapper">
        <span style={{ color: "#f47738" }} className="link">{"(" + t("CS_COMMON_OR") + ")"}</span>
      </div>
    </LabelFieldPair>

    <LabelFieldPair>
      <CardLabel>
        {t("ES_COMMON_LINK_LABEL") + "*"}
      </CardLabel>
      <div className="field">
        <TextInput disable={urlDisabled} onChange={e => setUrl(e.target.value)} value={url} />
      </div>
    </LabelFieldPair>
  </React.Fragment>

}

export default SelectULB