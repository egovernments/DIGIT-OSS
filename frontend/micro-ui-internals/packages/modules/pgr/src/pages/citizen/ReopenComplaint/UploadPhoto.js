import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card, SubmitBar, BackButton, ImageUploadHandler } from "@egovernments/digit-ui-react-components";

import { LOCALIZATION_KEY } from "../../../constants/Localization";

const UploadPhoto = (props) => {
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
        <ImageUploadHandler header={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_PHOTO`)} cardText="" onPhotoChange={handleUpload} />
        <Link to={`${props.match.path}/addional-details/${id}`}>
          <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
        </Link>
      </Card>
    </React.Fragment>
  );
};

export default UploadPhoto;
