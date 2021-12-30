import React, { useState } from 'react';

function GalleryIcon(props) {
    const [fileUploaded, setFileUploaded] = useState([]);
    const hiddenFileInput = React.useRef(null);

    const handleUpload = (event) => {
        hiddenFileInput.current.click();
    }

    const handleChange = (event) => {
        // fileUploaded = event.target.files[0];
        let tempFile = URL.createObjectURL(event.target.files[0]);
        setFileUploaded([...fileUploaded, tempFile]);
        // props.handleFile(fileUploaded);
        // console.log(event.target.files)

    }

    const imgPreview = () => {
        if (fileUploaded && fileUploaded.length > 0) {
            fileUploaded.map((i) => {
                console.log('nabeel', i)
                return (
                    <div>
                        <img src={i} alt='Preview Image'></img>
                    </div>
                )
            })

        }
    }

    return (
        <div>
            {console.log(fileUploaded)}
            <button className='btn-container' onClick={handleUpload}
                style={{
                    width: '12%',
                    height: "22px",
                    background: "#FAFAFA",
                    border: "1px solid #D6D5D4",
                    borderRadius: "8px",
                    padding: "2px",
                    cursor: "pointer",
                    outline: "none",
                    display: "flex",
                    justifyContent: "center"

                }}> <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{ display: 'none' }} />
                <p style={{
                    color: "#F47738",
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "center",


                }}>Gallery</p>
                <i class="fa fa-picture-o" aria-hidden="true" style={{ color: "#F47738" }}></i>

            </button>
            <div style={{ display: "flex" }}>
                <div style={{
                    // border: "0.5px solid #FFFFFF",
                    // backgroundColor: "#EEEEEE",
                    display: "flex",
                    width: "fit-content",
                    height: "90px",

                }}>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png' style={{
                        border: "0.5px solid #FFFFFF",
                        backgroundColor: "#EEEEEE",
                        display: "flex",
                        width: "fit-content",
                        height: "90px",
                        marginRight: "10px"

                    }} />
                    <i class="fa fa-times" aria-hidden="true" style={{
                        position: "absolute", marginLeft: "100px", color: "#c4c4c4", cursor: "pointer"
                    }}></i>

                </div>
                <div style={{
                    // border: "0.5px solid #FFFFFF",
                    // backgroundColor: "#EEEEEE",
                    display: "flex",
                    width: "fit-content",
                    height: "90px",

                }}>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png' style={{
                        border: "0.5px solid #FFFFFF",
                        backgroundColor: "#EEEEEE",
                        display: "flex",
                        width: "fit-content",
                        height: "90px",
                        marginRight: "10px"

                    }} />
                    <i class="fa fa-times" aria-hidden="true" style={{
                        position: "absolute", marginLeft: "100px", color: "#c4c4c4", cursor: "pointer"
                    }}></i>

                </div>
                <i class="fa fa-plus" aria-hidden="true" style={{
                    width: "100px",
                    justifyContent: "center",
                    display: "grid",
                    alignContent: "center",
                    cursor: "pointer",
                    color: "#C4C4C4"

                }} onClick={handleUpload}></i>


            </div>
        </div>
    );
}


export default GalleryIcon;