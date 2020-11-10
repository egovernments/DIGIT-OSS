import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Card, SubmitBar, BackButton } from "@egovernments/digit-ui-react-components";
import ImageUploaderHandler from "../../components/ImageUploadHandler";

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
    let reopenDetails = Digit.SessionStorage.get(`reopen.${id}`);
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
