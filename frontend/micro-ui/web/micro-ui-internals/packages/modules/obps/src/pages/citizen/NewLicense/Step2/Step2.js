import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step2";
import InfoIcon from "@mui/icons-material/Info";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import WorkingTable from "../../../../components/Table";

import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";

const tableData = [
  {
    key: "1",
    tehsil: "Mike",
    revenueEstate: 32,
    rectangleNo: "10 Downing Street",
    landOwner: "10 Downing Street",
    consolidationType: "10 Downing Street",
    kanal: "10 Downing Street",
    marla: "10 Downing Street",
  },
];

const optionsPurposeList = [
  {
    label: "Plotted Commercial",
    value: "plotted",
    id: "1",
  },
  {
    label: "Group Housing Commercial",
    value: "G",
    id: "2",
  },
  {
    label: "AGH",
    value: "03",
    id: "3",
  },
  {
    label: "Commercial Integrated",
    value: "04",
    id: "3",
  },
  {
    label: "Commercial Plotted",
    value: "C",
    id: "3",
  },
  {
    label: "Industrial Colony Commercial",
    value: "06",
    id: "3",
  },
  {
    label: "IT Colony Commercial",
    value: "I",
    id: "3",
  },
  {
    label: "DDJAY",
    value: "DDJAY",
    id: "3",
  },
  {
    label: "NILP",
    value: "N",
    id: "3",
  },
  {
    label: "Low Density Ecofriendly",
    value: "10",
    id: "3",
  },
  {
    label: "TOD Commercial",
    value: "TC",
    id: "3",
  },
  {
    label: "TOD Group housing",
    value: "TG",
    id: "3",
  },
];
const optionsPotentialList = [
  {
    label: "Hyper",
    value: "Hyper",
    id: "1",
  },
  {
    label: "High I",
    value: "High I",
    id: "2",
  },
  {
    label: "High II",
    value: "High II",
    id: "3",
  },
  {
    label: "Medium",
    value: "Medium",
    id: "3",
  },
  {
    label: "Low I",
    value: "Low I",
    id: "3",
  },
  {
    label: "Low II",
    value: "Low II",
    id: "3",
  },
];

const ApllicantPuropseForm = (props) => {
  console.log("Props", props);
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
              console.log("data", data);
            }}
          >
            Edit
          </h6>
          <h6>Delete</h6>
        </div>
      ),
    },
  ];
  const consolidatedColumns = [
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
      key: "killa",
      title: "Killa",
      dataIndex: "killa",
    },
    {
      key: "landOwner",
      title: "Land Owner",
      dataIndex: "landOwner",
    },
    {
      key: "consolidationType",
      title: "Consolidation Type",
      dataIndex: "consolidationType",
    },
    {
      key: "bigha",
      title: "Kanal/Bigha",
      dataIndex: "bigha",
    },
    {
      // key: "biswa",
      title: "Marla/Biswa",
      dataIndex: "",
      render: (text) => <div onClick={() => console.log("text", text)}>text</div>,
    },
    {
      key: "biswansi",
      title: "Sarsai/Biswansi",
      dataIndex: "biswansi",
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
              // console.log("data", data)
            }}
          >
            Edit
          </h6>
          <h6>Delete</h6>
        </div>
      ),
    },
  ];

  const stateId = Digit.ULBService.getStateId();
  const { data: Menu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "Purpose");
  let menu = [];
  Menu &&
    Menu["common-masters"] &&
    Menu["common-masters"].StructureType.map((ob) => {
      console.log("log", ob);
    });
  console.log("kjh", menu);
  const [purposeDd, setSelectPurpose] = useState("");
  const [potential, setPotentialDev] = useState("");
  const [getColumns, setColumns] = useState(columns);
  const [district, setDistrict] = useState("");
  const [modalData, setModalData] = useState([]);
  const [specificTableData, setSpecificTableData] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [tehsilData, setTehsilData] = useState([]);
  const [revenueStateData, setRevenuStateData] = useState([]);
  const [mustilData, setMustilData] = useState([]);
  const [potentialDataLabels, setPotentialDataLabels] = useState([]);
  const [purposeDataLabels, setPurposeDataLabels] = useState([]);
  const [districtDataLbels, setDistrictDataLabels] = useState([]);
  const [tehsilDataLabels, setTehsilDataLabels] = useState([]);
  const [revenueDataLabels, setRevenueDataLabels] = useState([]);
  const [mustilDataLabels, setMustilDataLabels] = useState([]);
  const [docUpload, setDocuploadData] = useState([]);
  const [file, setFile] = useState(null);
  const [modal, setmodal] = useState(false);
  const [showhide1, setShowhide1] = useState("No");
  const [showhide2, setShowhide2] = useState("No");
  const [tehsilCode, setTehsilCode] = useState(null);
  const [consolidateValue, setConsolidateValue] = useState(null);
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  const [finalSubmitData, setFinalSubmitData] = useState([]);
  const ID = props.getId;
  console.log("ID", ID);
  useEffect(() => {
    if (specificTableData) {
      setValue("tehsil", specificTableData?.tehsil);
      setValue("revenueEstate", specificTableData?.revenueEstate);
      setValue("rectangleNo", specificTableData?.rectangleNo);
      setValue("kanal", specificTableData?.kanal);
      setValue("marla", specificTableData?.marla);
      setValue("sarsai", specificTableData?.sarsai);
      setValue("bigha", specificTableData?.bigha);
      setValue("biswansi", specificTableData?.biswansi);
      setValue("biswa", specificTableData?.biswa);
      setValue("landOwner", specificTableData?.landOwner);
    }
    console.log("specificTableData", specificTableData);
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
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleshow2 = (e) => {
    const getshow = e.target.value;
    if (getshow === "1") {
      setConsolidateValue("consolidated");
    } else {
      setConsolidateValue("non-consolidated");
    }
    setShowhide2(getshow);
  };

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
      setDistrictData(Resp.data);
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
      setTehsilData(Resp.data);
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
      setRevenuStateData(Resp.data);

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
      setMustilData(Resp.data.must);
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
    console.log("khewat", khewats);
    try {
      const Resp = await axios
        .post(
          "/egov-mdms-service/v1/_owner?" + "dCode=" + district + "&" + "tCode=" + tehsilCode + "&NVCode=" + tehsilCode + "&khewat=" + khewats,
          datatopos,
          {}
        )
        .then((response) => {
          console.log("Resp", response);
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

  useEffect(() => {
    console.log("Revenue", revenueDataLabels);
  }, [revenueDataLabels]);

  const ApplicantPurposeModalData = (data) => {
    console.log("data++++++", data);
    data["tehsil"] = data?.tehsil?.label;
    data["revenueEstate"] = data?.revenueEstate?.label;
    data["rectangleNo"] = data?.rectangleNo;
    if (showhide2 === "consolidated") {
      delete data?.bigha;
      delete data?.biswa;
      delete data?.biswansi;
    }
    if (showhide2 === "Non-Consolidated") {
      delete data?.marla;
      delete data?.kanal;
      delete data?.sarsai;
    }
    if (data.consolidationType === "consolidated") {
      setColumns(columns);
    } else {
      setColumns(consolidatedColumns);
    }
    setModalData((prev) => [...prev, data]);
    setmodal(false);
    reset({
      tehsil: "",
      revenueEstate: "",
      rectangleNo: "",
      kanal: "",
      marla: "",
      sarsai: "",
      bigha: "",
      biswa: "",
      biswansi: "",
    });
  };

  const applicantPurposeBack = async () => {
    props.Step2Back();
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const handleChangePurpose = (data) => {
    const purposeSelected = data?.label;
    setSelectPurpose(purposeSelected);
    localStorage.setItem("purpose", purposeSelected);
  };
  const handleChangePotential = (data) => {
    const potentialSelected = data?.label;
    setPotentialDev(potentialSelected);
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
      setDocuploadData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDocumentData();
  }, [file]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://10.1.1.18:8443/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
        return response;
      });
      console.log("RESP+++", Resp?.data);
      setSubmitDataLabel(Resp?.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  const PurposeFormSubmitHandler = async (data) => {
    console.log("data===", data);
    try {
      const postDistrict = {
        NewServiceInfo: {
          pageName: "ApplicantPurpose",
          id: props.getId,
          newServiceInfoData: {
            ApplicantPurpose: {
              purposeDd: data?.purposeDd?.Label,
              potential: data?.potential?.label,
              district: data?.district?.label,
              state: data.state,
              applicationPurposeData1: {
                tehsil: data?.tehsil?.label,
                revenueEstate: data?.revenueEstate?.label,
                mustil: data?.rectangleNo,
                consolidation: data?.consolidationType,
                sarsai: data?.sarsai,
                kanal: data?.kanal,
                marla: data?.marla,
                bigha: data?.bigha,
                biswansi: data?.biswansi,
                biswa: data?.biswa,
                landOwner: data?.landOwner,
                developerCompany: data?.devCompany,
                registeringdate: data?.registering,
                validitydate: data?.dateValidity,
                colirrevocialble: "",
                authSignature: data?.authorizedSign,
                nameAuthSign: data?.authorizedDev,
                registeringAuthority: data?.registeringAuth,
              },
            },
          },
        },
      };

      const Resp = await axios.post("/land-services/new/_create", postDistrict).then((Resp) => {
        return Resp;
      });
      props.Step2Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
      setFinalSubmitData(Resp.data);
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
                    name="purposeDd"
                    onChange={handleChangePurpose}
                    placeholder="Purpose"
                    data={optionsPurposeList}
                    labels="Purpose"
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.purposeDd && errors?.purposeDd?.message}
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
                    data={optionsPotentialList}
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
            rectangleNo: "",
            kanal: "",
            marla: "",
            sarsai: "",
            bigha: "",
            biswa: "",
            biswansi: "",
          });
          setmodal(!modal);
        }}
      >
        <ModalHeader
          toggle={() => {
            setmodal(!modal);
            reset({
              tehsil: "",
              revenueEstate: "",
              rectangleNo: "",
              kanal: "",
              marla: "",
              sarsai: "",
              bigha: "",
              biswa: "",
              biswansi: "",
            });
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
                <ReactMultiSelect control={control} name="mustil" data={mustilDataLabels} labels="Rectangle No." {...register("rectangleNo")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.mustil && errors?.mustil?.message}
                </h3>
              </Col>
            </Row>
            <br></br>
            <Row className="ml-auto mb-3">
              <Col md={4} xxl lg="12">
                <div>
                  <label>
                    <h2>
                      Consolidation Type<span style={{ color: "red" }}>*</span>
                    </h2>
                  </label>{" "}
                  &nbsp;&nbsp;
                  <input type="radio" id="Yes" value="Consolidated" name="Yes" onClick={handleshow2} {...register("consolidationType")} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>
                  <label htmlFor="gen">Consolidated</label>&nbsp;&nbsp;
                  <input type="radio" id="No" value="Non-Consolidated" name="Yes" onClick={handleshow2} {...register("consolidationType")} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>
                  <label htmlFor="npnl">Non-Consolidated</label>
                  {/* </Form.Select> */}
                </div>{" "}
                {showhide2 === "Consolidated" && (
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
                          <Form.Control type="text" className="form-control" {...register("kanal")} />
                        </td>
                        <td>
                          <Form.Control type="text" className="form-control" {...register("marla")} />
                        </td>
                        <td>
                          <Form.Control type="text" className="form-control" {...register("sarsai")} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {showhide2 === "Non-Consolidated" && (
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
                <h2 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)">
                  Collaboration agreement Owner<span style={{ color: "red" }}>*</span>
                  &nbsp;&nbsp;
                  <input type="radio" value="Yes" id="Yes" name="Yes" onClick={handleshow1} />
                  &nbsp;&nbsp;
                  <label for="Yes">
                    <h6>Yes</h6>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" value="No" id="No" name="Yes" onClick={handleshow1} />
                  &nbsp;&nbsp;
                  <label for="No">
                    <h6>No</h6>
                  </label>
                </h2>
                {showhide1 === "Yes" && (
                  <div className="row ">
                    <div className="col col-4">
                      <label>
                        <h2>
                          Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="text" className="form-control" placeholder="N/A" {...register("devCompany")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2>
                          Date of registering collaboration agreement<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="date" className="form-control" placeholder="N/A" {...register("registering")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2>
                          Date of validity of collaboration agreement<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="date" className="form-control" placeholder="N/A" {...register("dateValidity")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 35 }}>
                      <label>
                        <h2>
                          Whether collaboration agreement irrevocable (Yes/No)<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <br></br>
                      <input type="radio" value="Yes" id="Yes1" name="Yes" />
                      &nbsp;&nbsp;
                      <label for="Yes">
                        <h6>Yes</h6>
                      </label>
                      &nbsp;&nbsp;
                      <input type="radio" value="No" id="No1" onChange={handleChange} name="Yes" />
                      &nbsp;&nbsp;
                      <label for="No">
                        <h6>No</h6>
                      </label>
                    </div>

                    <div className="col col-4" style={{ marginTop: 35 }}>
                      <label>
                        <h2>
                          Name of authorized signatory on behalf of land owner(s)<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="text" className="form-control" placeholder="N/A" {...register("authorizedSign")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2>
                          Name of authorized signatory on behalf of developer to sign Collaboration agreement<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <Form.Control type="date" className="form-control" placeholder="N/A" {...register("authorizedDev")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 20 }}>
                      <label>
                        <h2>
                          Registring Authority<span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <br></br>
                      <Form.Control type="text" className="form-control" placeholder="N/A" {...register("registeringAuth")} />
                    </div>
                    <div className="col col-4" style={{ marginTop: 15 }}>
                      <label>
                        <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                          Registring Authority document <span style={{ color: "red" }}>*</span>
                          <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                        </h2>
                      </label>
                      <br></br>
                      <Form.Control type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })} />
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
