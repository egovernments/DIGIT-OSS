import { CardLabel, LabelFieldPair, TextInput, UploadFile, CardLabelError, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { checkValidFileType, documentUploadMessage, getFileSize } from "../../utils";



const EngagementDocUploadDocument = ({ userType, t, onSelect, setValue, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  const [fileStoreId, setFileStoreId] = useState(() => formData?.[config.key]?.filestoreId);
  const [fileSize, setFileSize] = useState();
  const [fileType, setFileType] = useState('');
  const [file, setFile] = useState();
  const [urlDisabled, setUrlDisabled] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [controllerProps, setProps] = useState({});
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageUploadError, setUploadError] = useState("")

  // TO BE UNCOMMENTED IF BOTH URL AND FILESTORE ID CANT BE SEND
  const disableUrlField = () => {
    // setUrlDisabled(true);
    // setValue(config.key + ".documentLink", "");
  };
  const selectFile = (e, props) => {
    setFile()
    setFileSize()
    setFileType()
    setUploadError("")
    if (!e.target?.files?.length) return

    const size = e?.target?.files[0]?.size;
    const type = e?.target?.files[0]?.type;
    if (size && (size / 1024 / 1024) > 5) {
      setUploadError('FILE_SIZE_EXCEEDED')
      return
    }

    if (type && checkValidFileType(type)) {
      setFileSize(size);
      setFileType(type);
      setProps(props);
      setFile(e.target.files[0]);
      return
    } else {
      setUploadError('NOT_SUPPORTED_FILE_TYPE')
    }
  };

  useEffect(() => {
    if (file) uploadFile();
  }, [file]);

  useEffect(() => {
    if (fileStoreId) disableUrlField();
    else setUrlDisabled(false);
    controllerProps?.onChange?.({ fileStoreId, fileSize, fileType });
  }, [fileStoreId, controllerProps]);

  const uploadFile = async () => {
    try {
      setIsUploadingImage(true)
      const response = await Digit.UploadServices.Filestorage("engagement", file, Digit.ULBService.getStateId());
      if (response?.data?.files?.length > 0) {
        setFileStoreId(response?.data?.files[0]?.fileStoreId);
      } else {
        setError(t("CS_FILE_UPLOAD_ERROR"));
      }

    } catch (err) {
    } finally {
      setIsUploadingImage(false)
    }
  };

  const location = useLocation();
  const isInEditFormMode = useMemo(() => {
    if (location.pathname.includes('/documents/inbox/update')) return true;
    return false;
  }, [location.pathname])

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_DOC_DOCUMENT") + "*"}</CardLabel>
        <div className="field">
          <Controller
            name={config.key + ".filestoreId"}
            control={control}
            render={(props) => (
              <UploadFile
                id={"city-engagement-doc"}
                onUpload={(d) => selectFile(d, props)}
                onDelete={() => {
                  setFileStoreId(null);
                  setFileSize(100);
                }}
                accept="image/*, .pdf, .png, .jpeg, .doc"
                showHintBelow={true}
                hintText={t("DOCUMENTS_ATTACH_RESTRICTIONS_SIZE")}
                message={isUploadingImage ? <Loader /> : documentUploadMessage(t, fileStoreId, isInEditFormMode)}
                textStyles={{ width: "100%" }}
                inputStyles={{ width: "280px" }}
              />
            )}
          />
          {fileSize ? `${getFileSize(fileSize)}` : null}
          {imageUploadError ? <CardLabelError>{t(imageUploadError)}</CardLabelError> : null}
        </div>
      </LabelFieldPair>

      {/* <LabelFieldPair style={{ margin: "25px" }}>
        <CardLabel></CardLabel>
        <div style={{ textAlign: "center" }} className="field links-wrapper">
          <span style={{ color: "#505a5f", fontWeight: "bold" }} className="cell-text">
            {"(" + t("CS_COMMON_OR") + ")"}
          </span>
        </div>
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_LINK_LABEL") + "*"}</CardLabel>
        <div className="field">
          <TextInput name={config.key + ".documentLink"} inputRef={register()} disable={urlDisabled} />
        </div>
      </LabelFieldPair> */}
    </React.Fragment>
  );
};

export default EngagementDocUploadDocument;
