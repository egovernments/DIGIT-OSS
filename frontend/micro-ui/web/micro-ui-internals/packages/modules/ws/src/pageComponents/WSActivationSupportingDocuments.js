import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, UploadFile, Toast, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const WSActivationSupportingDocuments = ({ t, config, userType, formData, onSelect }) => {
    const stateId = Digit.ULBService.getStateId();
    const tenantIdCode = Digit.ULBService.getCurrentTenantId();
    const [documents, setDocuments] = useState(formData?.supportingDocuments?.[0] ? [formData?.supportingDocuments?.[0]] : []);
    const [error, setError] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [file, setFile] = useState(null);

    const goNext = () => {
        onSelect(config.key, { documents });
    };

    function selectfile(e) {
        setFile(e.target.files[0]);
    }

    useEffect(() => {
        goNext();
    }, [documents]);

    useEffect(() => {
        if (userType === "employee") {
            onSelect(config.key, { ...formData[config.key], ...documents });
        }
    }, [documents]);

    useEffect(() => {
        (async () => {
            setError(null);
            if (file) {
                const allowedFileTypesRegex = /(.*?)(jpg|jpeg|png|image|pdf)$/i
                if (file.size >= 5242880) {
                  setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
                } else if (file?.type && !allowedFileTypesRegex.test(file?.type)) {
                  setError(t(`NOT_SUPPORTED_FILE_TYPE`))
                } else {
                    try {
                        const response = await Digit.UploadServices.Filestorage("WS", file, tenantIdCode);
                        if (response?.data?.files?.length > 0) {
                            setUploadedFile(response?.data?.files[0]?.fileStoreId);
                        } else {
                            setError(t("CS_FILE_UPLOAD_ERROR"));
                        }
                    } catch (err) {
                        setError(t("CS_FILE_UPLOAD_ERROR"));
                    }
                }
            }
        })();
    }, [file]);

    useEffect(() => {
        if (uploadedFile) {
          setDocuments((prev) => {
            return [{ fileStoreId: uploadedFile, documentUid: uploadedFile }];
          });
        }
      }, [uploadedFile]);

    return (
        <div>
            <LabelFieldPair>
                <CardLabel className="card-label-smaller" style={{ fontWeight: "700"}}>{t(`WF_APPROVAL_UPLOAD_HEAD`)}:</CardLabel>
                <div className="field">
                    <UploadFile
                        // id={id}
                        onUpload={(e) => { selectfile(e, "DOCUMENT-!") }}
                        onDelete={() => { setUploadedFile(null); }}
                        message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                        textStyles={{ width: "100%" }}
                        inputStyles={{ width: "280px" }}
                        buttonType="button"
                        accept= "image/*, .pdf, .png, .jpeg, .jpg"
                        iserror={error}
                    />
                </div>
            </LabelFieldPair>
        </div>
    );
};

export default WSActivationSupportingDocuments;
