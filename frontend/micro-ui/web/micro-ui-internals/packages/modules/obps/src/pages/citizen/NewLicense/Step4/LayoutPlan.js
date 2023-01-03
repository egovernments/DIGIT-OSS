import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { getDocShareholding } from "../docView/docView.help";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
const LayoutPlan = (props) => {
  const [fileStoreId, setFileStoreId] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    // reValidateMode: "onChange",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const [loader, setLoader] = useState(false);
  const getDocumentData = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      return error;
    }
  };
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  return (
    <div className="col col-9">
      <h2 style={{ display: "flex" }}>
        Upload Layout Plan.{" "}
        <span className="text-primary">
          {" "}
          <a onClick={() => setmodal1(true)}>(Click here for instructions to Upload Layout Plan. )</a>
        </span>
        <span style={{ color: "red" }}>*</span>
      </h2>
      <div>
        <Modal size="lg" isOpen={modal1} toggle={() => setmodal(!modal1)} aria-labelledby="contained-modal-title-vcenter" centered>
          <ModalHeader toggle={() => setmodal1(!modal1)}></ModalHeader>
          <ModalBody style={{ fontSize: 20 }}>
            <h2>
              {" "}
              <b>1.</b> Standard Formats for preparation of GIS-based layout plans: <br></br>• GIS Format: Plans to be prepared in GIS Format (each
              layer of the plan in shapefile format) and submitted along with base GIS data used, i.e. Shajra Plan (Shajra plan layers in shapefile
              format).
              <br></br>- GIS-based Vector Data Format: Shapefile <br></br>- Projection (Coordinate) system: Universal Transverse Mercator (UTM){" "}
              <br></br>- Datum: WGS 84<br></br> - Zone: 43 Northern <br></br>
              <br></br>
              <b>2.</b> Type of colonies: <br></br>• Plotted Colonies: Layout-cum-Demarcation Plan to be submitted with site plan <br></br>• Other
              than plotted colonies: Demarcation Plan to be submitted with site plan <br></br>
              <br></br>
              <b>3.</b> GIS Format data to be used: <br></br>- The Department will provide the bundle of predefined blank layers (Layout plan's
              operational GIS layers), including attribute structure (in shapefile format) through the e-licensing Portal. <br></br>- The applicant
              has to download the bundle of predefined blank layers and may use it in any GIS software for the preparation of the layout/demarcation
              plan. <br></br>
              <br></br>
              <b>4.</b> Preparation of GIS-based Layout plan- <br></br>- The applicant must prepare the layout/Demarcation plans in predefined
              opera-tional GIS layers.<br></br> - All attribute fields of GIS layers are to be updated by the applicant. <br></br>
              <br></br>
              <b>5.</b> Submission of Layout Plan on e-License Portal: <br></br>
              <b>5.1 </b>Submission of plans in GIS Format: <br></br>- Prepare the zip file of each layer and put it in the main folder. <br></br>-
              Convert the folder to a zip file and upload it online.<br></br> <b>5.2 </b>Submission of Print Layout in pdf format: <br></br>- PDF of
              the print layout of the plan is essentially required to be submitted along with the GIS format. <br></br>- Components of the print
              layout (A1/A0 size) should be the same as finalized by the Department including Title, Map, Legend, Scale, Direction, Detail of Plots,
              Labels, etc.
            </h2>
          </ModalBody>
          <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
        </Modal>
      </div>
      <label>
        <FileUpload color="primary" />
        <input
          type="file"
          style={{ display: "none" }}
          onChange={(e) => getDocumentData(e?.target?.files[0], "uploadLayoutPlan")}
          accept="application/shp/zip"
          required
        />
      </label>
      {fileStoreId?.uploadLayoutPlan ? (
        <a onClick={() => getDocShareholding(fileStoreId?.uploadLayoutPlan)} className="btn btn-sm ">
          <VisibilityIcon color="info" className="icon" />
        </a>
      ) : (
        <p></p>
      )}
      {/* <div>
                        <input
                          type="file"
                          className="form-control"
                          accept="application/pdf"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "copyOfShajraPlan")}
                          required
                        />
                      </div> */}
      <h3 className="error-message" style={{ color: "red" }}>
        {errors?.uploadLayoutPlan && errors?.uploadLayoutPlan?.message}
      </h3>
    </div>
  );
};
export default LayoutPlan;
