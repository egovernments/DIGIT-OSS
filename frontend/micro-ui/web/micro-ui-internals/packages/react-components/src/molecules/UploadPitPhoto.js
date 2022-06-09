import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UploadImages from "../atoms/UploadImages";

const UploadPitPhoto = (props) => {
    const { t } = useTranslation();

    const [image, setImage] = useState(null);
    const [uploadedImagesThumbs, setUploadedImagesThumbs] = useState(null);
    const [uploadedImagesIds, setUploadedImagesIds] = useState(props.uploadedImages);

    const [rerender, setRerender] = useState(1);
    const [imageFile, setImageFile] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

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

    useEffect(() => {
        if (imageFile && imageFile.size > 2097152) {
            setError("File is too large");
        } else {
            setImage(imageFile);
        }
    }, [imageFile]);

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

    function getImage(e) {
        setError(null);
        setImageFile(e.target.files[0]);
    }

    const uploadImage = useCallback(async () => {
        if (uploadedImagesIds === null || uploadedImagesIds.length < 3) {
            const response = await Digit.UploadServices.Filestorage("FSM", image, props.tenantId);
            setUploadedImagesIds(addUploadedImageIds(response));
        } 
    }, [addUploadedImageIds, image]);

    function addImageThumbnails(thumbnailsData) {
        var keys = Object.keys(thumbnailsData.data);
        var index = keys.findIndex((key) => key === "fileStoreIds");
        if (index > -1) {
            keys.splice(index, 1);
        }
        var thumbnails = [];
        // if (uploadedImagesThumbs !== null) {
        //   thumbnails = uploadedImagesThumbs.length > 0 ? uploadedImagesThumbs.filter((thumb) => thumb.key !== keys[0]) : [];
        // }

        const newThumbnails = keys.map((key) => {
            return { image: thumbnailsData.data[key].split(",")[2], key };
        });

        setUploadedImagesThumbs([...thumbnails, ...newThumbnails]);
    }

    const submit = useCallback(async () => {
        if (uploadedImagesIds !== null && uploadedImagesIds.length > 0) {
            const res = await Digit.UploadServices.Filefetch(uploadedImagesIds, props.tenantId);
            addImageThumbnails(res);
        }
    }, [uploadedImagesIds]);

    function deleteImage(img) {
        setIsDeleting(true);
        var deleteImageKey = uploadedImagesThumbs.filter((o, index) => o.image === img);

        var uploadedthumbs = uploadedImagesThumbs;
        var newThumbsList = uploadedthumbs.filter((thumbs) => thumbs != deleteImageKey[0]);

        var newUploadedImagesIds = uploadedImagesIds.filter((key) => key !== deleteImageKey[0].key);
        setUploadedImagesThumbs(newThumbsList);
        setUploadedImagesIds(newUploadedImagesIds);
        Digit.SessionStorage.set("PGR_CREATE_IMAGES", newUploadedImagesIds);
    }

    const handleUpload = (event) => {
        if (uploadedImagesIds === null || uploadedImagesIds.length < 3) {
            hiddenFileInput.current.click();
        } 
    }
    const hiddenFileInput = React.useRef(null);

    // Upload photo from storage by clicking the button 
    // and can view preview in pop down
    return (
        <div>
            <div className="imageUploadWrapper" style={{ display: !imageFile ? "none" : "block", marginTop: "8px" }}>
                <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} />
            </div>
            <button onClick={handleUpload} style={{
                width: "100%",
                backgroundColor: "#d6d5d4",
                borderStyle: "solid",
                borderBottom: "1px solid #464646",
                padding: "4px 40px",
                margin: "8px 0px",
                cursor: "pointer",
                outline: "none",
                display: "flex",
                justifyContent: "center",
            }}>
                <input
                    style={{ display: "none" }}
                    type="file"
                    ref={hiddenFileInput}
                    onChange={getImage}
                />
                <p>{t("UPLOAD_PIT_PHOTO")}</p>

            </button>

            {error && <Toast error={true} label={error} onClose={() => setError(null)} />}
        </div>
    );
};

export default UploadPitPhoto