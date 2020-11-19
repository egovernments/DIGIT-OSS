import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card, SubmitBar, BackButton } from "@egovernments/digit-ui-react-components";
import ImageUploaderHandler from "../../components/ImageUploadHandler";

import { LOCALIZATION_KEY } from "../../constants/Localization";

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
    Digit.SessionStorage.set(`reopen.${id}`, { ...reopenDetails, verificationDocuments });
  }, [verificationDocuments, id]);

  return (
    <React.Fragment>
      <Card>
        <ImageUploaderHandler header={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_PHOTO`)} cardText="" onPhotoChange={handleUpload} />

        <Link to={`/reopen/addional-details/${id}`}>
          <SubmitBar label="Next" />
        </Link>
      </Card>
    </React.Fragment>
  );
};

export default UploadPhoto;
