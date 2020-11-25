import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardText, SubmitBar, UploadImages, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
// import {
//   Filestorage,
//   Filefetch,
// } from "@egovernments/digit-utils/services/Filestorage";
import { useTranslation } from "react-i18next";

const UploadPhotos = (props) => {
  // const Filestorage = Digit.UploadServices.Filestorage;
  // const Filefetch = Digit.UploadPhotos.Filefetch;
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [uploadedImagesThumbs, setUploadedImagesThumbs] = useState(null);
  const [uploadedImagesIds, setUploadedImagesIds] = useState(null);
  const [rerender, setRerender] = useState(1);

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  useEffect(() => {
    (async () => {
      if (uploadedImagesIds !== null) {
        await submit();
        setRerender(rerender + 1);
      }
    })();
  }, [uploadedImagesIds]);

  function addUploadedImageIds(imageIdData) {
    if (uploadedImagesIds === null) {
      var arr = [];
    } else {
      arr = uploadedImagesIds;
    }
    return [...arr, imageIdData.data.files[0].fileStoreId];
  }

  function addImageThumbnails(thumbnailsData) {
    var keys = Object.keys(thumbnailsData.data);
    var index = keys.findIndex((key) => key === "fileStoreIds");
    if (index > -1) {
      keys.splice(index, 1);
    }
    var thumbnails = [];
    if (uploadedImagesThumbs !== null) {
      thumbnails = uploadedImagesThumbs;
    }
    setUploadedImagesThumbs([...thumbnails, { image: thumbnailsData.data[keys[0]].split(",")[2], key: keys[0] }]);
  }

  function getImage(e) {
    if (e.target.files[0] && e.target.files[0].size > 2097152) {
      alert("File is too big!");
    } else {
      setImage(e.target.files[0]);
    }
  }

  async function uploadImage() {
    const response = await Digit.UploadServices.Filestorage(image);
    setUploadedImagesIds(addUploadedImageIds(response));
  }

  async function submit() {
    if (uploadedImagesIds !== null) {
      const res = await Digit.UploadServices.Filefetch([uploadedImagesIds[uploadedImagesIds.length - 1]], "pb.amritsar");
      addImageThumbnails(res);
    }
  }

  function deleteImage(img) {
    var deleteImageKey;
    uploadedImagesThumbs.flatMap((o, index) => {
      if (o.image === img) {
        deleteImageKey = [o.key, index];
      }
    });

    var index = uploadedImagesIds.findIndex((key) => key === deleteImageKey[0]);

    if (index > -1) {
      var arr = uploadedImagesIds;
      arr.splice(index, 1);
      setUploadedImagesIds(arr);
    }

    var thumbs = uploadedImagesThumbs;
    thumbs.splice(deleteImageKey[1], 1);
    setUploadedImagesThumbs(thumbs);
    setRerender(rerender + 1);
  }

  return (
    <Card>
      <CardHeader>{t("CS_ADDCOMPLAINT_UPLOAD_PHOTO")}</CardHeader>

      <CardText>
        {/* Click on the icon below to upload the complaint photos as evidence. You
        can capture photos directly through your camera or upload from your
        Gallery. If you do not have complaint photo, you can skip the continue
        for next step. */}
        {t("CS_ADDCOMPLAINT_UPLOAD_PHOTO_TEXT")}
      </CardText>

      <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} />

      <Link to="/create-complaint/details" onClick={() => props.save(uploadedImagesIds)}>
        <SubmitBar label="Next" />
      </Link>
      {props.skip ? (
        <Link to="/create-complaint/details">
          <LinkButton label={t("CORE_COMMON_SKIP_CONTINUE")} />
        </Link>
      ) : null}
    </Card>
  );
};

export default UploadPhotos;
