import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card, SubmitBar, BackButton, ImageUploadHandler, CardLabelError, LinkButton } from "@egovernments/digit-ui-react-components";

import { LOCALIZATION_KEY } from "../../../constants/Localization";

const UploadPhoto = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  let { id } = useParams();
  const [verificationDocuments, setVerificationDocuments] = useState(null);
  const [valid, setValid] = useState(true);

  const handleUpload = (ids) => {
    setDocState(ids);
  };

  const setDocState = (ids) => {
    if (ids?.length) {
      const documents = ids.map((id) => ({
        documentType: "PHOTO",
        fileStoreId: id,
        documentUid: "",
        additionalDetails: {},
      }));
      setVerificationDocuments(documents);
    }
  };

  function save() {
    if (verificationDocuments === null) {
      setValid(false);
    } else {
      history.push(`${props.match.path}/addional-details/${id}`);
    }
  }

  function skip() {
    history.push(`${props.match.path}/addional-details/${id}`);
  }

  useEffect(() => {
    let reopenDetails = Digit.SessionStorage.get(`reopen.${id}`);
    Digit.SessionStorage.set(`reopen.${id}`, { ...reopenDetails, verificationDocuments });
  }, [verificationDocuments, id]);

  return (
    <React.Fragment>
      <Card>
        <ImageUploadHandler
          header={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_PHOTO`)}
          tenantId={props?.complaintDetails?.service?.tenantId}
          cardText=""
          onPhotoChange={handleUpload}
          uploadedImages={null}
        />
        {/* <Link to={`${props.match.path}/addional-details/${id}`}>
          <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
        </Link> */}

        {valid ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_ERROR_MESSAGE`)}</CardLabelError>}
        <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} onSubmit={save} />
        {props.skip ? <LinkButton label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} onClick={skip} /> : null}
      </Card>
    </React.Fragment>
  );
};

export default UploadPhoto;
