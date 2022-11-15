import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import WorkingTable from "../../../../components/Table";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";

const ApllicantPuropseForm = (props) => {
  const columns = [
    {
      key: "tehsil",
      title: "Tehsil",
      dataIndex: "tehsil",
    },
    {
      key: "revenueEstate",
      title: "Revenue Estate",
      dataIndex: "revenueEstate",
    },
    {
      key: "rectangleNo",
      title: "Rectangle No.",
      dataIndex: "rectangleNo",
    },

    {
      key: "consolidationType",
      title: "Consolidation Type",
      dataIndex: "consolidationType",
    },
    {
      title: "Kanal/Bigha",
      dataIndex: "",
      render: (text) => (text?.kanal ? text?.kanal : text?.bigha),
    },
    {
      title: "Marla/Biswa",
      dataIndex: "",
      render: (text) => (text?.marla ? text?.marla : text?.biswa),
    },
    {
      title: "Sarsai/Biswansi",
      dataIndex: "",
      render: (text) => (text?.sarsai ? text?.sarsai : text?.biswansi),
    },
    {
      // key: "action",
      title: "Action",
      dataIndex: "",
      render: (data) => (
        <div>
          <h6
            onClick={() => {
              setmodal(true);
              setSpecificTableData(data);
            }}
          >
            Edit
          </h6>
          <h6>Delete</h6>
        </div>
      ),
    },
  ];

  const [district, setDistrict] = useState("");
  const [modalData, setModalData] = useState([]);
  const [specificTableData, setSpecificTableData] = useState(null);
  const [districtDataLbels, setDistrictDataLabels] = useState([]);
  const [tehsilDataLabels, setTehsilDataLabels] = useState([]);
  const [revenueDataLabels, setRevenueDataLabels] = useState([]);
  const [mustilDataLabels, setMustilDataLabels] = useState([]);
  const [file, setFile] = useState(null);
  const [modal, setmodal] = useState(false);
  const [tehsilCode, setTehsilCode] = useState(null);
  const [consolidateValue, setConsolidateValue] = useState("consolidated");
  const [getCollaboration, setCollaboration] = useState("");
  const [purposeOptions, setPurposeOptions] = useState([]);
  const [potentialOptons, setPotentialOptions] = useState([]);

  useEffect(() => {
    if (specificTableData) {
      setValue("tehsil", specificTableData?.tehsil);
      setValue("revenueEstate", specificTableData?.revenueEstate);
      setValue("mustil", specificTableData?.mustil);
      setValue("kanal", specificTableData?.kanal);
      setValue("marla", specificTableData?.marla);
      setValue("sarsai", specificTableData?.sarsai);
      setValue("bigha", specificTableData?.bigha);
      setValue("biswansi", specificTableData?.biswansi);
      setValue("biswa", specificTableData?.biswa);
      setValue("landOwner", specificTableData?.landOwner);
    }
  }, [specificTableData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      consolidationType: "consolidated",
    },
    shouldFocusError: true,
  });

  const stateId = Digit.ULBService.getStateId();
  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  const { data: PotentialType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["potentialZone"]);

  useEffect(() => {
    const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
      return { value: data?.purposeCode, label: data?.name };
    });
    setPurposeOptions(purpose);
  }, [PurposeType]);

  useEffect(() => {
    const potential = PotentialType?.["common-masters"]?.potentialZone?.map(function (data) {
      return { value: data?.code, label: data?.zone };
    });
    setPotentialOptions(potential);
  }, [PotentialType]);

  const DistrictApiCall = async () => {
    try {
      const postDistrict = {
        RequestInfo: {
          apiId: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msgId: "090909",
          requesterId: "",
          authToken: "",
        },
      };

      const Resp = await axios.post("/egov-mdms-service/v1/_district", postDistrict).then((Resp) => {
        return Resp;
      });
      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setDistrictDataLabels((prev) => [...prev, { label: el.districtName, id: el.districtCode, value: el.districtCode }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getTehslidata = async (data) => {
    const datapost = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };

    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_tehsil?dCode=" + data, datapost, {}).then((response) => {
        return response;
      });
      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setTehsilDataLabels((prev) => [...prev, { label: el.name, id: el.code, value: el.code }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getRevenuStateData = async (code) => {
    const datatopost = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };

    try {
      const Resp = await axios
        .post("/egov-mdms-service/v1/_village?" + "dCode=" + district + "&" + "tCode=" + code, datatopost, {})
        .then((response) => {
          return response;
        });

      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setRevenueDataLabels((prev) => [...prev, { label: el.name, id: el.khewats, value: el.code, khewats: el.khewats, code: el.code }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMustilData = async (code) => {
    const datpost = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };

    try {
      const Resp = await axios
        .post("/egov-mdms-service/v1/_must?" + "dCode=" + district + "&" + "tCode=" + tehsilCode + "&NVCode=" + code, datpost, {})
        .then((response) => {
          return response;
        });
      if (Resp.data.must.length > 0 && Resp.data.must !== undefined && Resp.data.must !== null) {
        Resp.data.must.map((el, i) => {
          setMustilDataLabels((prev) => [...prev, { label: el, id: i, value: el }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLandOwnerStateData = async (khewats) => {
    const datatopos = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };
    try {
      const Resp = await axios
        .post(
          "/egov-mdms-service/v1/_owner?" + "dCode=" + district + "&" + "tCode=" + tehsilCode + "&NVCode=" + tehsilCode + "&khewat=" + khewats,
          datatopos,
          {}
        )
        .then((response) => {
          return response;
        });
      setKhewatData(Resp.data);

      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setKhewatDataLabels((prev) => [...prev, { label: el.name, id: el.code, value: el.khewats }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    DistrictApiCall();
  }, []);

  const ApplicantPurposeModalData = (data) => {
    data["tehsil"] = data?.tehsil?.value;
    data["revenueEstate"] = data?.revenueEstate?.value;
    data["mustil"] = data?.mustil?.value;
    delete data?.district;
    delete data?.potential;
    delete data?.purpose;
    delete data?.state;

    if (data?.consolidationType === "consolidated") {
      delete data?.bigha;
      delete data?.biswa;
      delete data?.biswansi;
    }
    if (data?.consolidationType === "non-consolidated") {
      delete data?.marla;
      delete data?.kanal;
      delete data?.sarsai;
    }

    setModalData((prev) => [...prev, data]);
    setmodal(false);
    reset({
      tehsil: "",
      revenueEstate: "",
      mustil: "",
      kanal: "",
      marla: "",
      sarsai: "",
      bigha: "",
      biswa: "",
      biswansi: "",
      agreementIrrevocialble: "",
      agreementValidFrom: "",
      agreementValidTill: "",
      authSignature: "",
      collaboration: "",
      developerCompany: "",
      landOwner: "",
      nameAuthSign: "",
      registeringAuthority: "",
    });
    setCollaboration("");
  };

  const applicantPurposeBack = async () => {
    props.Step2Back();
  };

  const handleChangePurpose = (data) => {
    const purposeSelected = data?.label;
    localStorage.setItem("purpose", purposeSelected);
  };
  const handleChangePotential = (data) => {
    const potentialSelected = data?.label;
    localStorage.setItem("potential", JSON.stringify(potentialSelected));
  };

  const getDocumentData = async () => {
    if (file === null) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");

    try {
      const Resp = await axios
        .post("http://10.1.1.18:8083/filestore/v1/files", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          return response;
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDocumentData();
  }, [file]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://10.1.1.18:8443/land-services/new/licenses/_get?id=${props.getId}`);
      const userData = Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose;
      // setValue("purpose", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.purpose?.name);
      // setValue("potential", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.potential?.name);
      // setValue("district", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.district?.name);
      // // setValue("consolidationType", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.consolidationType);
      // setValue("kanal", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.kanal);
      // setValue("developerCompany", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.developerCompany);
      // setValue("developerCompany", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.developerCompany);
      // setValue("agreementValidFrom", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.registeringdate);
      // setValue("agreementValidTill", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.validitydate);
      // setValue("authSignature", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.authSignature);
      // setValue("nameAuthSign", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.nameAuthSign);
      // setValue("registeringAuthority", Resp?.data?.newServiceInfoData?.[0]?.ApplicantPurpose?.applicationPurposeData1?.registeringAuthority);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  const PurposeFormSubmitHandler = async (data) => {
    // console.log("data====", modalData);

    // const formattedData = {
    //   data,
    //   detailsOfAppliedland: modalData,
    // };
    // console.log("formattedData", formattedData);
    // props.Step2Continue(data, 7);
    // console.log("modalData===", modalData);
    const postDistrict = {
      NewServiceInfo: {
        pageName: "ApplicantPurpose",
        id: props.getId,
        newServiceInfoData: {
          ApplicantPurpose: {
            data,
            AppliedLandDetails: modalData,
          },
        },
      },
    };
    console.log("modalData===", postDistrict);
    return;
    try {
      const Resp = await axios.post("/land-services/new/_create", formattedData).then((Resp) => {
        return Resp;
      });
      props.Step2Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(PurposeFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New License </h4>
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <Form.Group>
              <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="3">
                  <div>
                    <Form.Label>
                      <h2>
                        Puropse Of License<span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>

                  <ReactMultiSelect
                    control={control}
                    name="purpose"
                    onChange={handleChangePurpose}
                    placeholder="Purpose"
                    data={purposeOptions}
                    labels="Purpose"
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.purpose && errors?.purpose?.message}
                  </h3>
                </Col>

                <Col md={4} xxl lg="3">
                  <div>
                    <Form.Label>
                      <h2>
                        Potential Zone<span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                  <ReactMultiSelect
                    control={control}
                    name="potential"
                    placeholder="Potential"
                    data={potentialOptons}
                    labels="Potential"
                    onChange={handleChangePotential}
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.potential && errors?.potential?.message}
                  </h3>
                </Col>

                <Col md={4} xxl lg="3">
                  <div>
                    <Form.Label>
                      <h2>
                        District<span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                  <ReactMultiSelect
                    control={control}
                    name="district"
                    placeholder="District"
                    data={districtDataLbels}
                    labels="District"
                    onChange={(e) => {
                      getTehslidata(e.value);
                      setDistrict(e.value);
                    }}
                  />

                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.district && errors?.district?.message}
                  </h3>
                </Col>
                <Col md={4} xxl lg="3">
                  <div>
                    <Form.Label>
                      <h2>
                        State<span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>

                  <input type="text" className="form-control" placeholder="N/A" {...register("state")} disabled defaultValue="Haryana" />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.state && errors?.state?.message}
                  </h3>
                </Col>
              </Row>

              <div className="ml-auto" style={{ marginTop: 20 }}>
                <h5>
                  <b>Details of applied land</b>
                </h5>
                <br></br>
                <p>
                  Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development
                  agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.
                </p>
                <br></br>
                <p>
                  <h3>(i) Khasra-wise information to be provided in the following format</h3>
                </p>
                <br></br>
              </div>
              <div className="ml-auto">
                <Button type="button" variant="primary" onClick={() => setmodal(true)}>
                  Enter Details
                </Button>
              </div>
              <br></br>

              <div className="applt" style={{ overflow: "auto" }}>
                <WorkingTable columns={columns} data={modalData} />
              </div>
            </Form.Group>

            <div class="row">
              <div class="col-sm-12 text-left">
                <div id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => applicantPurposeBack()}>
                  Back
                </div>
              </div>
              <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Save and Continue
                </button>
              </div>
            </div>
          </Card>
        </Card>
      </form>

      <Modal
        size="xl"
        isOpen={modal}
        toggle={() => {
          reset({
            tehsil: "",
            revenueEstate: "",
            mustil: "",
            kanal: "",
            marla: "",
            sarsai: "",
            bigha: "",
            biswa: "",
            biswansi: "",
            agreementIrrevocialble: "",
            agreementValidFrom: "",
            agreementValidTill: "",
            authSignature: "",
            collaboration: "",
            developerCompany: "",
            landOwner: "",
            nameAuthSign: "",
            registeringAuthority: "",
          });
          setCollaboration("");
          setmodal(!modal);
        }}
      >
        <ModalHeader
          toggle={() => {
            setmodal(!modal);
            reset({
              tehsil: "",
              revenueEstate: "",
              mustil: "",
              kanal: "",
              marla: "",
              sarsai: "",
              bigha: "",
              biswa: "",
              biswansi: "",
              agreementIrrevocialble: "",
              agreementValidFrom: "",
              agreementValidTill: "",
              authSignature: "",
              collaboration: "",
              developerCompany: "",
              landOwner: "",
              nameAuthSign: "",
              registeringAuthority: "",
            });
            setCollaboration("");
          }}
        ></ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(ApplicantPurposeModalData)}>
            <Row className="ml-auto mb-3">
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Tehsil <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  {...register("tehsil")}
                  data={tehsilDataLabels}
                  labels="Tehsil"
                  onChange={(e) => {
                    getRevenuStateData(e.value);
                    setTehsilCode(e.value);
                  }}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.tehsil && errors?.tehsil?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Name of Revenue Estate <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  {...register("revenueEstate")}
                  data={revenueDataLabels}
                  labels="Revenue Estate"
                  onChange={(e) => {
                    getMustilData(e.code);
                    getLandOwnerStateData(e.khewats);
                  }}
                />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.revenueEstate && errors?.revenueEstate?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Rectangle No./Mustil <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect control={control} name="mustil" data={mustilDataLabels} labels="Rectangle No." {...register("mustil")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.mustil && errors?.mustil?.message}
                </h3>
              </Col>
            </Row>
            <br></br>
            <Row className="ml-auto mb-3">
              <Col md={4} xxl lg="12">
                <div>
                  <h2>
                    Consolidation Type<span style={{ color: "red" }}>*</span>
                  </h2>

                  <label htmlFor="consolidated">
                    <input
                      {...register("consolidationType")}
                      type="radio"
                      value="consolidated"
                      defaultChecked={true}
                      defaultValue="consolidated"
                      id="consolidated"
                      onClick={() => setConsolidateValue("consolidated")}
                    />
                    Consolidated
                  </label>
                  <label htmlFor="non-consolidated">
                    <input
                      {...register("consolidationType")}
                      type="radio"
                      value="non-consolidated"
                      id="non-consolidated"
                      onClick={() => setConsolidateValue("non-consolidated")}
                    />
                    Non-Consolidated
                  </label>
                </div>

                {consolidateValue == "consolidated" && (
                  <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                    <thead>
                      <tr>
                        <th>
                          <h2>Kanal</h2>
                        </th>
                        <th>
                          <h2>Marla</h2>
                        </th>
                        <th>
                          <h2>Sarsai</h2>&nbsp;&nbsp;
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Form.Control type="text" className="form-control" placeholder="" {...register("kanal")} />
                        </td>
                        <td>
                          <Form.Control type="text" className="form-control" placeholder="" {...register("marla")} />
                        </td>
                        <td>
                          <Form.Control type="text" className="form-control" placeholder="" {...register("sarsai")} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {consolidateValue == "non-consolidated" && (
                  <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                    <thead>
                      <tr>
                        <th>
                          <h2>Bigha</h2>
                        </th>
                        <th>
                          <h2>Biswa</h2>
                        </th>
                        <th>
                          <h2>Biswansi</h2>&nbsp;&nbsp;
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Form.Control type="text" className="form-control" {...register("bigha")} />
                        </td>
                        <td>
                          <Form.Control type="text" className="form-control" {...register("biswa")} />
                        </td>
                        <td>
                          <Form.Control type="text" className="form-control" {...register("biswansi")} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </Col>
            </Row>

            <Row className="ml-auto mb-3">
              <Col md={4} xxl lg="6">
                <div>
                  <label>
                    <h2>
                      Name of Land Owner<span style={{ color: "red" }}>*</span>
                    </h2>
                  </label>
                </div>
                <Form.Control type="text" className="form-control" placeholder="" {...register("landOwner")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.landOwner && errors?.landOwner?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="6"></Col>
            </Row>
            <Row className="ml-auto mb-3">
              <div className="col col-12">
                <h2>
                  Collaboration agreement Owner<span style={{ color: "red" }}>*</span>
                </h2>

                <label htmlFor="collaboration">
                  <input {...register("collaboration")} type="radio" value="no" id="yes" onClick={() => setCollaboration("yes")} />
                  Yes
                </label>
                <label htmlFor="collaboration">
                  <input {...register("collaboration")} type="radio" value="yes" id="no" onClick={() => setCollaboration("no")} />
                  No
                </label>
                {getCollaboration === "yes" && (
                  <div className="row ">
                    <div className="col col-4">
                      <label>
                        <h2>
                          Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="text" className="form-control" placeholder="" {...register("developerCompany")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2>
                          Date of registering collaboration agreement<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="date" className="form-control" placeholder="" {...register("agreementValidFrom")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2>
                          Date of validity of collaboration agreement<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="date" className="form-control" placeholder="" {...register("agreementValidTill")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 35 }}>
                      <h2>
                        Whether collaboration agreement irrevocable (Yes/No)<span style={{ color: "red" }}>*</span>
                      </h2>
                      <label htmlFor="agreementIrrevocialble">
                        <input {...register("agreementIrrevocialble")} type="radio" value="no" id="agreementIrrevocialble" />
                        Yes
                      </label>
                      <label htmlFor="agreementIrrevocialble">
                        <input {...register("agreementIrrevocialble")} type="radio" value="yes" id="agreementIrrevocialble" />
                        No
                      </label>
                    </div>

                    <div className="col col-4" style={{ marginTop: 35 }}>
                      <label>
                        <h2>
                          Name of authorized signatory on behalf of land owner(s)<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="text" className="form-control" placeholder="" {...register("authSignature")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2>
                          Name of authorized signatory on behalf of developer to sign Collaboration agreement<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="text" className="form-control" placeholder="" {...register("nameAuthSign")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 20 }}>
                      <label>
                        <h2>
                          Registring Authority<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <br></br>
                      <Form.Control type="text" className="form-control" placeholder="" {...register("registeringAuthority")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                          Registring Authority document <span style={{ color: "red" }}>*</span>
                          <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                        </h2>
                      </label>
                      <br></br>
                      <Form.Control type="file" className="form-control" {...register("registeringAuthorityDocId")} />
                    </div>
                  </div>
                )}
              </div>
            </Row>

            <button type="submit" style={{ float: "right" }} className="btn btn-priary">
              Submit
            </button>
          </form>
        </ModalBody>
        <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
      </Modal>
    </div>
  );
};

export default ApllicantPuropseForm;
