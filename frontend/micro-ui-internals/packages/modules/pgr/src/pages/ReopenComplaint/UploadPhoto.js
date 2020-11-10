import React, { useEffect, useState } from "react";
import Card from "../../@egovernments/components/js/Card";
import SubmitBar from "../../@egovernments/components/js/SubmitBar";
import { Link, useParams } from "react-router-dom";
import ImageUploaderHandler from "../../components/ImageUploadHandler";
import { Storage } from "../../@egovernments/digit-utils/services/Storage";
import BackButton from "../../@egovernments/components/js/BackButton";
import { useTranslation } from "react-i18next";

const UploadPhoto = () => {
  const { t } = useTranslation();
  let { id } = useParams();
  const [verificationDocuments, setVerificationDocuments] = useState([]);

  const handleUpload = (ids) => {
    setDocState(ids);
  };

  const setDocState = (ids) => {
    const documents = ids.map((id) => ({
      documentType: "PHOTO",
      fileStore: id,
      documentUid: "",
      additionalDetails: {},
    }));
    setVerificationDocuments(documents);
  };

  useEffect(() => {
    let reopenDetails = Storage.get(`reopen.${id}`);
    Storage.set(`reopen.${id}`, { ...reopenDetails, verificationDocuments });
  }, [verificationDocuments, id]);

  return (
    <>
      <BackButton>Back</BackButton>
      <Card>
        <ImageUploaderHandler header={t("CS_ADDCOMPLAINT_UPLOAD_PHOTO")} cardText="" onPhotoChange={handleUpload} />

        <Link to={`/reopen/addional-details/${id}`}>
          <SubmitBar label="Next" />
        </Link>
      </Card>
    </>
  );
};

export default UploadPhoto;
