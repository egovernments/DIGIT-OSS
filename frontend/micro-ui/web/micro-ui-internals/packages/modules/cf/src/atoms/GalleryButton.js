import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadImages } from "@egovernments/digit-ui-react-components";

export const ImageUploadHandler = (props) => {
    // const __initImageIds = Digit.SessionStorage.get("PGR_CREATE_IMAGES");
    // const __initThumbnails = Digit.SessionStorage.get("PGR_CREATE_THUMBNAILS");
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
        if (!isDeleting) {
            (async () => {
                if (uploadedImagesIds !== null) {
                    await submit();
                    setRerender(rerender + 1);
                    props.onPhotoChange(uploadedImagesIds);
                }
            })();
        } else {
            setIsDeleting(false);
        }
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
        const response = await Digit.UploadServices.Filestorage("property-upload", image, props.tenantId);
        setUploadedImagesIds(addUploadedImageIds(response));
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
        hiddenFileInput.current.click();
    }
    const hiddenFileInput = React.useRef(null);

    return (
        <React.Fragment>
            <div className="imageUploadWrapper" style={{ width: "75%", display: !imageFile ? "none" : "block", marginTop: "8px" }}>
                <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} />
            </div>
            <button className='btn-container' onClick={handleUpload}
                style={{
                    background: "#FAFAFA",
                    border: "1px solid #D6D5D4",
                    borderRadius: "8px",
                    padding: "4px 40px",
                    margin: "8px 0px",
                    cursor: "pointer",
                    outline: "none",
                    display: "flex",
                    justifyContent: "center"

                }}> <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={getImage}
                    style={{ display: 'none' }} />
                <p style={{
                    color: "#F47738",
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "13px",
                    display: "flex",
                    justifyContent: "center",
                }}>Gallery</p>
                <svg style={{marginLeft: '8px', marginTop: '4px'}} width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.209 8.754H1.87975V9.713H0.25V0.25H11.72V1.86425H10.7607V1.20925H1.209V8.754ZM13.9585 2.432V11.8948H2.4885V2.432H13.9585ZM12.998 3.39075H3.4465V10.9355H12.998V3.39075ZM9.5715 10.415H12.1367L10.094 6.87475L8.81075 9.09725L6.93975 5.85575L4.3075 10.415H8.05075H9.5715ZM8.65975 6.54675C9.09275 6.54675 9.44275 6.1965 9.44275 5.764C9.44275 5.3315 9.09275 4.9815 8.65975 4.9815C8.227 4.9815 7.8765 5.3315 7.8765 5.764C7.8765 6.1965 8.22675 6.54675 8.65975 6.54675Z" fill="#F47738" />
                </svg>

            </button>

            {error && <Toast error={true} label={error} onClose={() => setError(null)} />}
        </React.Fragment>
    );
};
