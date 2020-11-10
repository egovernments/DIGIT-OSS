import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CardHeader, CardText, UploadImages } from "@egovernments/digit-ui-react-components";
import { Filestorage, Filefetch } from "../@egovernments/digit-utils/services/Filestorage";

const ImageUploaderHandler = (props) => {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [uploadedImagesThumbs, setUploadedImagesThumbs] = useState(null);
  const [uploadedImagesIds, setUploadedImagesIds] = useState(null);
  const [rerender, setRerender] = useState(1);

  const addUploadedImageIds = useCallback(
    (imageIdData) => {
      if (uploadedImagesIds === null) {
        var arr = [];
      } else {
        arr = uploadedImagesIds;
      }
      return [...arr, imageIdData.data.files[0].fileStoreId];
    },
    [uploadedImagesIds]
  );

  const uploadImage = useCallback(async () => {
    const response = await Filestorage(image);
    setUploadedImagesIds(addUploadedImageIds(response));
  }, [addUploadedImageIds, image]);

  const addImageThumbnails = useCallback(
    (thumbnailsData) => {
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
    },
    [uploadedImagesThumbs]
  );

  const submit = useCallback(async () => {
    if (uploadedImagesIds !== null) {
      const res = await Filefetch([uploadedImagesIds[uploadedImagesIds.length - 1]], "pb.amritsar");
      addImageThumbnails(res);
    }
  }, [addImageThumbnails, uploadedImagesIds]);

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
        props.onPhotoChange(uploadedImagesIds);
      }
    })();
  }, [uploadedImagesIds]);

  function getImage(e) {
    setImage(e.target.files[0]);
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
    // <Card>
    <>
      <CardHeader>{props.header}</CardHeader>

      <CardText>
        {/* Click on the icon below to upload the complaint photos as evidence. You
        can capture photos directly through your camera or upload from your
        Gallery. If you do not have complaint photo, you can skip the continue
        for next step. */}
        {t("CS_ADDCOMPLAINT_UPLOAD_PHOTO_TEXT")}
      </CardText>

      <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} />

      {/* <Link
        to="/create-complaint/details"
        onClick={() => props.save(uploadedImagesIds)}
      >
        <SubmitBar label="Next" />
      </Link> */}
    </>
  );
};

export default ImageUploaderHandler;
