import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import WorkingTable from "../../../../components/Table";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step2";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";

const ApllicantPuropseForm = (props) => {
  const resetFields = {
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
  };
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
    { key: "kanal", title: "Kanal", dataIndex: "kanal" },
    {
      key: "kanal",
      title: "Bigha",
      dataIndex: "bigha",
    },
    {
      key: "marla",
      title: "Marla",
      dataIndex: "marla",
    },
    {
      key: "biswa",
      title: "Biswa",
      dataIndex: "biswa",
    },
    {
      key: "sarsai",
      title: "Sarsai",
      dataIndex: "sarsai",
    },
    {
      key: "biswansi",
      title: "Biswansi",
      dataIndex: "biswansi",
    },
    {
      key: "landOwner",
      title: "Name of Land Owner",
      dataIndex: "landOwner",
    },
    {
      key: "agreementIrrevocialble",
      title: "Whether collaboration agreement irrevocable (Yes/No)",
      dataIndex: "agreementIrrevocialble",
    },
    {
      key: "agreementValidFrom",
      title: "Date of registering collaboration agreement",
      dataIndex: "agreementValidFrom",
    },
    {
      key: "agreementValidTill",
      title: "Date of validity of collaboration agreement",
      dataIndex: "agreementValidTill",
    },
    {
      key: "authSignature",
      title: "Name of authorized signatory on behalf of land owner(s)",
      dataIndex: "authSignature",
    },
    {
      key: "collaboration",
      title: "Collaboration agreement Owner",
      dataIndex: "collaboration",
    },
    {
      key: "developerCompany",
      title: "Name of the developer company",
      dataIndex: "developerCompany",
    },
    {
      key: "nameAuthSign",
      title: " Name of authorized signatory",
      dataIndex: "nameAuthSign",
    },
    {
      key: "registeringAuthority",
      title: "Registring Authority",
      dataIndex: "registeringAuthority",
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
  const [districtDataLbels, setDistrictDataLabels] = useState({ data: [], isLoading: true });
  const [tehsilDataLabels, setTehsilDataLabels] = useState({ data: [], isLoading: true });
  const [revenueDataLabels, setRevenueDataLabels] = useState({ data: [], isLoading: true });
  const [mustilDataLabels, setMustilDataLabels] = useState({ data: [], isLoading: true });
  const [file, setFile] = useState(null);
  const [modal, setmodal] = useState(false);
  const [tehsilCode, setTehsilCode] = useState(null);
  const [consolidateValue, setConsolidateValue] = useState("consolidated");
  const [getCollaboration, setCollaboration] = useState("");
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });
  const [potentialOptons, setPotentialOptions] = useState({ data: [], isLoading: true });

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
    getValues,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    defaultValues: {
      consolidationType: "consolidated",
    },
    shouldFocusError: true,
  });

  const stateId = Digit.ULBService.getStateId();
  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  const { data: PotentialType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["PotentialZone"]);

  useEffect(() => {
    const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
      return { value: data?.purposeCode, label: data?.name };
    });
    setPurposeOptions({ data: purpose, isLoading: false });
  }, [PurposeType]);

  useEffect(() => {
    const potential = PotentialType?.["common-masters"]?.PotentialZone?.map(function (data) {
      return { value: data?.code, label: data?.zone };
    });
    setPotentialOptions({ data: potential, isLoading: false });
  }, [PotentialType]);

  const DistrictApiCall = async () => {
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_district", datapost);
      const distData = Resp?.data?.map((el) => {
        return { label: el?.districtName, id: el?.districtCode, value: el?.districtCode };
      });
      setDistrictDataLabels({ data: distData, isLoading: false });
    } catch (error) {
      console.log(error?.message);
    }
  };

  const getTehslidata = async (data) => {
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_tehsil?dCode=" + data, datapost, {});
      const tehsilData = Resp?.data?.map((el) => {
        return { label: el?.name, id: el?.code, value: el?.code };
      });
      setTehsilDataLabels({ data: tehsilData, isLoading: false });
    } catch (error) {
      console.log(error?.message);
    }
  };

  const getRevenuStateData = async (code) => {
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_village?" + "dCode=" + district + "&" + "tCode=" + code, datapost, {});
      const revenData = Resp?.data?.map((el) => {
        return { label: el?.name, id: el?.khewats, value: el?.code, khewats: el?.khewats, code: el?.code };
      });
      setRevenueDataLabels({ data: revenData, isLoading: false });
    } catch (error) {
      console.log(error?.message);
    }
  };

  const getMustilData = async (code) => {
    try {
      const Resp = await axios.post(
        "/egov-mdms-service/v1/_must?" + "dCode=" + district + "&" + "tCode=" + tehsilCode + "&NVCode=" + code,
        datapost,
        {}
      );
      const mustData = Resp?.data?.must?.map((el, i) => {
        return { label: el, id: i, value: el };
      });
      setMustilDataLabels({ data: mustData, isLoading: false });
    } catch (error) {
      return error;
    }
  };

  const getLandOwnerStateData = async (khewats) => {
    try {
      const Resp = await axios.post(
        "/egov-mdms-service/v1/_owner?" + "dCode=" + district + "&" + "tCode=" + tehsilCode + "&NVCode=" + tehsilCode + "&khewat=" + khewats,
        datapost,
        {}
      );
      console.log("Resp.data", Resp?.data);
    } catch (error) {
      console.log(error?.message);
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
    console.log("data===", data);

    setModalData((prev) => [...prev, data]);
    setmodal(false);
    reset(resetFields);
    setCollaboration("");
  };

  const PurposeFormSubmitHandler = async (data) => {
    props.Step2Continue(data, "9");
    return;
    const token = window?.localStorage?.getItem("token");
    const postDistrict = {
      pageName: "ApplicantPurpose",
      id: props.getId,
      createdBy: props?.userInfo?.id,
      updatedBy: props?.userInfo?.id,
      LicenseDetails: {
        ApplicantPurpose: {
          ...data,
          AppliedLandDetails: modalData,
        },
      },
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: token,
        userInfo: props?.userInfo,
      },
    };
    console.log("modalData===", postDistrict);
    try {
      const Resp = await axios.post("/tl-services/new/_create", postDistrict);
      console.log(Resp?.data);
      props.Step2Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangePurpose = (data) => {
    const purposeSelected = data?.label;
    window?.localStorage.setItem("purpose", purposeSelected);
  };
  const handleChangePotential = (data) => {
    const potentialSelected = data?.label;
    window?.localStorage.setItem("potential", JSON.stringify(potentialSelected));
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
                    data={purposeOptions?.data}
                    labels="Purpose"
                    loading={purposeOptions?.isLoading}
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.purpose?.value && errors?.purpose?.value?.message}
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
                    data={potentialOptons?.data}
                    labels="Potential"
                    onChange={handleChangePotential}
                    loading={potentialOptons?.isLoading}
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.potential?.value && errors?.potential?.value?.message}
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
                    data={districtDataLbels?.data}
                    labels="District"
                    loading={districtDataLbels?.isLoading}
                    onChange={(e) => {
                      getTehslidata(e.value);
                      setDistrict(e.value);
                    }}
                  />

                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.district?.value && errors?.district?.value?.message}
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
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (!getValues()?.district) alert("Please Select District First To Proceed Further");
                    else setmodal(true);
                  }}
                >
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
                <div id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => props.Step2Back()}>
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
          reset(resetFields);
          setCollaboration("");
          setmodal(!modal);
        }}
      >
        <ModalHeader
          toggle={() => {
            setmodal(!modal);
            reset(resetFields);
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
                  data={tehsilDataLabels?.data}
                  labels="Tehsil"
                  loading={tehsilDataLabels?.isLoading}
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
                  data={revenueDataLabels?.data}
                  labels="Revenue Estate"
                  loading={revenueDataLabels?.isLoading}
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
                <ReactMultiSelect
                  control={control}
                  name="mustil"
                  data={mustilDataLabels?.data}
                  loading={mustilDataLabels?.isLoading}
                  labels="Rectangle No."
                  {...register("mustil")}
                />
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
