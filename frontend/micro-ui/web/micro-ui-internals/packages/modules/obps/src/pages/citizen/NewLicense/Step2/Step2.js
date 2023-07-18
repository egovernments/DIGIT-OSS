import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import WorkingTable from "../../../../components/Table";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import { VALIDATION_SCHEMA, MODAL_VALIDATION_SCHEMA } from "../../../../utils/schema/step2";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";
import Spinner from "../../../../components/Loader";
import { getDocShareholding } from "../docView/docView.help";
import { convertEpochToDate } from "../../../../../../tl/src/utils";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import CusToaster from "../../../../components/Toaster";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { getMaxNorms, getMinimumNorms } from "./validation.helper";

const applicationType = [
  { label: "New Licence", value: "newLicence" },
  { label: "Addition", value: "addition" },
  { label: "Migration", value: "migration" },
];

const ApllicantPuropseForm = (props) => {
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
      title: "District",
      render: (data) => (data?.district ? data?.district?.label : "N/A"),
    },
    {
      title: "Development Plan",
      render: (data) => (data?.developmentPlan ? data?.developmentPlan?.label : "N/A"),
    },
    {
      title: "Zone",
      render: (data) => (data?.potential ? data?.potential : "N/A"),
    },
    {
      title: "Sector",
      render: (data) => (data?.sector ? data?.sector : "N/A"),
    },
    {
      title: "Tehsil",
      render: (data) => (data?.tehsil ? data?.tehsil?.label : "N/A"),
    },
    {
      title: "Revenue Estate",
      render: (data) => (data?.revenueEstate ? data?.revenueEstate?.label : "N/A"),
    },
    {
      title: "Hadbast No.",
      render: (data) => (data?.hadbastNo ? data?.hadbastNo : "N/A"),
    },
    {
      title: "Rectangle No.",
      render: (data) => (data?.rectangleNo ? data?.rectangleNo : "N/A"),
    },
    {
      title: "Khasra No.",
      render: (data) => (data?.khewats ? data?.khewats : "N/A"),
    },
    {
      title: "Min",
      render: (data) => (data?.min ? "Yes" : "No"),
    },
    {
      key: "landOwner",
      title: "Name of Land Owner",
      dataIndex: "landOwner",
      render: (data) => (
        <h6 data-toggle="tooltip" data-placement="top" title={data}>
          {data?.split(" ")?.slice(0, 2)?.join(" ") + "..."}
        </h6>
      ),
    },
    {
      title: "Type of land",
      render: (data) => (data?.typeLand ? data?.typeLand?.label : "N/A"),
    },
    {
      title: "change in information",
      render: (data) => (data?.isChange == "false" ? "Incorrect" : data?.isChange == "true" || data?.isChange ? "Correct" : "Incorrect"),
    },
    {
      title: "Rectangle No./Mustil(Changed)",
      render: (data) => (data?.editRectangleNo ? data?.editRectangleNo : "N/A"),
    },
    {
      title: "Khasra Number(Changed)",
      render: (data) => (data?.editKhewats ? data?.editKhewats : "N/A"),
    },
    {
      title: "Name of the Land Owner as per Mutation/Jamabandi",
      render: (data) => (data?.landOwnerRegistry ? data?.landOwnerRegistry : "N/A"),
    },
    {
      title: "Whether Khasra been developed in collaboration",
      render: (data) => (data?.collaboration ? data?.collaboration : "N/A"),
    },
    {
      title: "Name of the developer company",
      render: (data) => (data?.developerCompany ? data?.developerCompany : "N/A"),
    },
    {
      title: "Date of registering collaboration agreement",
      render: (data) => (data?.agreementValidFrom ? data?.agreementValidFrom : "N/A"),
    },
    {
      title: "Whether collaboration agreement irrevocable (Yes/No)",
      render: (data) => (data?.agreementIrrevocialble ? data?.agreementIrrevocialble : "N/A"),
    },
    {
      title: "Name of authorized signatory on behalf of land owner(s)",
      render: (data) => (data?.authSignature ? data?.authSignature : "N/A"),
    },
    {
      title: "Name of authorized signatory on behalf of developer",
      render: (data) => (data?.nameAuthSign ? data?.nameAuthSign : "N/A"),
    },
    {
      title: "Registering Authority",
      render: (data) => (data?.registeringAuthority ? data?.registeringAuthority : "N/A"),
    },
    {
      key: "registeringAuthorityDoc",
      title: "Registering Authority document",
      dataIndex: "",
      render: (data) => (
        <div>
          {data?.registeringAuthorityDoc && (
            <a onClick={() => getDocShareholding(data?.registeringAuthorityDoc, setLoader)} className="btn btn-sm ">
              <VisibilityIcon color="info" className="icon" />
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Consolidation Type",
      render: (data) => (data?.consolidationType ? data?.consolidationType : "N/A"),
    },
    {
      title: "Kanal",
      render: (data) => (data?.kanal ? data?.kanal : "N/A"),
    },
    {
      title: "Marla",
      render: (data) => (data?.marla ? data?.marla : "N/A"),
    },
    {
      title: "Sarsai",
      render: (data) => (data?.sarsai ? data?.sarsai : "N/A"),
    },
    {
      title: "Bigha",
      render: (data) => (data?.bigha ? data?.bigha : "N/A"),
    },
    {
      title: "Biswa",
      render: (data) => (data?.biswa ? data?.biswa : "N/A"),
    },
    {
      title: "Biswansi",
      render: (data) => (data?.biswansi ? data?.biswansi : "N/A"),
    },
    {
      title: "Acquisition Status",
      render: (data) => (data?.acquistionStatus ? data?.acquistionStatus : "N/A"),
    },
    {
      title: "Consolidated Total Area",
      render: (data) => (data?.consolidatedTotal ? data?.consolidatedTotal : "N/A"),
    },
    {
      title: "Non-Consolidated Total Area",
      render: (data) => (data?.nonConsolidatedTotal ? data?.nonConsolidatedTotal : "N/A"),
    },
    {
      title: "Action",
      dataIndex: "",
      render: (data) => (
        <div style={{ width: "116px", display: "flex", justifyContent: "space-between" }}>
          <EditIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSpecificTableData(data);
              setmodal(true);
            }}
            color="primary"
          />

          <DeleteIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              const filteredData = modalData?.filter((item) => item?.rowid !== data?.rowid);
              setModalData(filteredData);
            }}
            color="error"
          />
          <ContentCopyIcon
            onClick={() => {
              var obj = data;
              const arrB = JSON.parse(JSON.stringify(obj));
              const length = modalData?.length + 1;
              arrB["rowid"] = length.toString();
              setModalData([...modalData, arrB]);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];
  const migColumns = [
    {
      title: "District",
      render: (data) => (data?.district ? data?.district?.label : "N/A"),
    },
    {
      title: "Development Plan",
      render: (data) => (data?.developmentPlan ? data?.developmentPlan?.label : "N/A"),
    },
    {
      title: "Zone",
      render: (data) => (data?.potential ? data?.potential : "N/A"),
    },
    {
      title: "Sector",
      render: (data) => (data?.sector ? data?.sector : "N/A"),
    },
    {
      title: "Tehsil",
      render: (data) => (data?.tehsil ? data?.tehsil?.label : "N/A"),
    },
    {
      title: "Revenue Estate",
      render: (data) => (data?.revenueEstate ? data?.revenueEstate?.label : "N/A"),
    },
    {
      title: "Hadbast No.",
      render: (data) => (data?.hadbastNo ? data?.hadbastNo : "N/A"),
    },
    {
      title: "Rectangle No.",
      render: (data) => (data?.rectangleNo ? data?.rectangleNo : "N/A"),
    },
    {
      title: "Khasra No.",
      render: (data) => (data?.khewats ? data?.khewats : "N/A"),
    },
    {
      title: "Min",
      render: (data) => (data?.min ? "Yes" : "No"),
    },
    {
      key: "landOwner",
      title: "Name of Land Owner",
      dataIndex: "landOwner",
      render: (data) => (
        <h6 data-toggle="tooltip" data-placement="top" title={data}>
          {data?.split(" ")?.slice(0, 2)?.join(" ") + "..."}
        </h6>
      ),
    },
    {
      title: "Type of land",
      render: (data) => (data?.typeLand ? data?.typeLand?.label : "N/A"),
    },
    {
      title: "change in information",
      render: (data) => (data?.isChange == "false" ? "Incorrect" : data?.isChange == "true" || data?.isChange ? "Correct" : "Incorrect"),
    },
    {
      title: "Rectangle No./Mustil(Changed)",
      render: (data) => (data?.editRectangleNo ? data?.editRectangleNo : "N/A"),
    },
    {
      title: "Khasra Number(Changed)",
      render: (data) => (data?.editKhewats ? data?.editKhewats : "N/A"),
    },
    {
      title: "Name of the Land Owner as per Mutation/Jamabandi",
      render: (data) => (data?.landOwnerRegistry ? data?.landOwnerRegistry : "N/A"),
    },
    {
      title: "Whether Khasra been developed in collaboration",
      render: (data) => (data?.collaboration ? data?.collaboration : "N/A"),
    },
    {
      title: "Name of the developer company",
      render: (data) => (data?.developerCompany ? data?.developerCompany : "N/A"),
    },
    {
      title: "Date of registering collaboration agreement",
      render: (data) => (data?.agreementValidFrom ? data?.agreementValidFrom : "N/A"),
    },
    {
      title: "Whether collaboration agreement irrevocable (Yes/No)",
      render: (data) => (data?.agreementIrrevocialble ? data?.agreementIrrevocialble : "N/A"),
    },
    {
      title: "Name of authorized signatory on behalf of land owner(s)",
      render: (data) => (data?.authSignature ? data?.authSignature : "N/A"),
    },
    {
      title: "Name of authorized signatory on behalf of developer",
      render: (data) => (data?.nameAuthSign ? data?.nameAuthSign : "N/A"),
    },
    {
      title: "Registering Authority",
      render: (data) => (data?.registeringAuthority ? data?.registeringAuthority : "N/A"),
    },
    {
      key: "registeringAuthorityDoc",
      title: "Registering Authority document",
      dataIndex: "",
      render: (data) => (
        <div>
          {data?.registeringAuthorityDoc && (
            <a onClick={() => getDocShareholding(data?.registeringAuthorityDoc, setLoader)} className="btn btn-sm ">
              <VisibilityIcon color="info" className="icon" />
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Consolidation Type",
      render: (data) => (data?.consolidationType ? data?.consolidationType : "N/A"),
    },
    {
      title: "Kanal",
      render: (data) => (data?.kanal ? data?.kanal : "N/A"),
    },
    {
      title: "Marla",
      render: (data) => (data?.marla ? data?.marla : "N/A"),
    },
    {
      title: "Sarsai",
      render: (data) => (data?.sarsai ? data?.sarsai : "N/A"),
    },
    {
      title: "Bigha",
      render: (data) => (data?.bigha ? data?.bigha : "N/A"),
    },
    {
      title: "Biswa",
      render: (data) => (data?.biswa ? data?.biswa : "N/A"),
    },
    {
      title: "Biswansi",
      render: (data) => (data?.biswansi ? data?.biswansi : "N/A"),
    },
    {
      title: "Acquisition Status",
      render: (data) => (data?.acquistionStatus ? data?.acquistionStatus : "N/A"),
    },
    {
      title: "Consolidated Total Area",
      render: (data) => (data?.consolidatedTotal ? data?.consolidatedTotal : "N/A"),
    },
    {
      title: "Non-Consolidated Total Area",
      render: (data) => (data?.nonConsolidatedTotal ? data?.nonConsolidatedTotal : "N/A"),
    },
    {
      title: "Action",
      dataIndex: "",
      render: (data) => (
        <div style={{ width: "116px", display: "flex", justifyContent: "space-between" }}>
          <ContentCopyIcon
            onClick={() => {
              var obj = data;
              const arrB = JSON.parse(JSON.stringify(obj));
              const length = migModalData?.length + 1;
              arrB["rowid"] = length.toString();
              setMigModalData([...migModalData, arrB]);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  const { t } = useTranslation();
  const location = useLocation();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [district, setDistrict] = useState("");
  const [modalData, setModalData] = useState([]);
  const [migModalData, setMigModalData] = useState([]);
  const [specificTableData, setSpecificTableData] = useState(null);
  // const [districtDataLabels, setDistrictDataLabels] = useState({ data: [], isLoading: true });
  const [tehsilDataLabels, setTehsilDataLabels] = useState({ data: [], isLoading: true });
  const [revenueDataLabels, setRevenueDataLabels] = useState({ data: [], isLoading: true });
  const [mustilDataLabels, setMustilDataLabels] = useState({ data: [], isLoading: true });
  const [modal, setmodal] = useState(false);
  const [tehsilCode, setTehsilCode] = useState(null);
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });
  const [districtOptons, setDistrictOptions] = useState({ data: [], isLoading: true });
  const [devPlanOptons, setDevPlanOptions] = useState({ data: [], isLoading: true });
  const [ZoneOptions, setZoneOptions] = useState({ data: [], isLoading: true });
  const [sectorOptions, setSectorOptions] = useState({ data: [], isLoading: true });
  const [loader, setLoader] = useState(false);
  const [getKhewats, setKhewats] = useState("");
  const [fileStoreId, setFileStoreId] = useState({});
  const [stepData, setStepData] = useState(null);
  const [applicantId, setApplicantId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const stateId = Digit.ULBService.getStateId();
  const [typeOfLand, setYypeOfLand] = useState({ data: [], isLoading: true });
  const [showFields, setShowFields] = useState(false);
  const [getDTCP, setDTCP] = useState(null);
  const [getDevPlanVal, setDevPlanVal] = useState("");
  const [getSectorVal, setSectorVal] = useState("");
  const [getNameRevenueState, setNameRevenueState] = useState("");
  const [getMustil, setMustil] = useState("");
  const [getData, setData] = useState({ caseNumber: "", dairyNumber: "" });
  const [getTotalArea, setTotlArea] = useState();
  const [getAppNumbers, setAppNumbers] = useState([]);

  const resetValues = () => {
    resetField("district");
    resetField("potential");
    resetField("zone");
    resetField("sector");
    resetField("tehsil");
    resetField("revenueEstate");
    resetField("rectangleNo");
    resetField("hadbastNo");
    resetField("khewats");
    resetField("kanal");
    resetField("marla");
    resetField("sarsai");
    resetField("bigha");
    resetField("biswa");
    resetField("biswansi");
    resetField("agreementValidFrom");
    resetField("validitydate");
    resetField("authSignature");
    resetField("collaboration");
    resetField("developerCompany");
    resetField("validitydate");
    resetField("landOwner");
    resetField("nameAuthSign");
    resetField("registeringAuthority");
    resetField("consolidationType");
    resetField("agreementIrrevocialble");
    resetField("registeringAuthorityDoc");
    resetField("editKhewats");
    resetField("editRectangleNo");
    resetField("landOwnerRegistry");
    resetField("typeLand");
    resetField("developmentPlan");
    resetField("nonConsolidationType");
    resetField("acquistionStatus");
    resetField("nonConsolidatedTotal");
    resetField("consolidatedTotal");
  };

  useEffect(() => {
    if (specificTableData) {
      setValue("hadbastNo", specificTableData?.hadbastNo);
      setValue("khewats", specificTableData?.khewats);
      setValue("consolidationType", specificTableData?.consolidationType);
      setValue("kanal", specificTableData?.kanal);
      setValue("marla", specificTableData?.marla);
      setValue("sarsai", specificTableData?.sarsai);
      setValue("bigha", specificTableData?.bigha);
      setValue("biswansi", specificTableData?.biswansi);
      setValue("biswa", specificTableData?.biswa);
      setValue("acquistionStatus", specificTableData?.biswa);
      setValue("collaboration", specificTableData?.collaboration);
      setValue("landOwner", specificTableData?.landOwner);
      setValue("developerCompany", specificTableData?.developerCompany);
      setValue("validitydate", specificTableData?.validitydate);
      setValue("validitydate", specificTableData?.validitydate);
      setValue("agreementIrrevocialble", specificTableData?.agreementIrrevocialble);
      setValue("authSignature", specificTableData?.authSignature);
      setValue("nameAuthSign", specificTableData?.nameAuthSign);
      setValue("registeringAuthority", specificTableData?.registeringAuthority);
      setValue("registeringAuthorityDoc", specificTableData?.registeringAuthorityDoc);
      setValue("editRectangleNo", specificTableData?.editRectangleNo);
      setValue("editKhewats", specificTableData?.editKhewats);
      setValue("acquistionStatus", specificTableData?.acquistionStatus);
      setValue("landOwnerRegistry", specificTableData?.landOwnerRegistry);
      const districtValue = districtOptons?.data?.filter((item) => item?.value === specificTableData?.district?.value);
      // getDevPlanOption(districtValue?.[0]?.distCodeTCP);
      setValue("district", { label: districtValue?.[0]?.label, value: districtValue?.[0]?.value });
      if (districtValue?.[0]?.distCodeTCP) setDTCP(districtValue?.[0]);
      const tehsilValue = tehsilDataLabels?.data?.filter((item) => item?.value === specificTableData?.tehsil?.value);
      setNameRevenueState(tehsilValue?.[0]?.value);
      setValue("tehsil", { label: tehsilValue?.[0]?.label, value: tehsilValue?.[0]?.value });
      // dev plan
      const devPlanValue = devPlanOptons?.data?.filter((item) => item?.value === specificTableData?.developmentPlan?.value);
      setDevPlanVal(devPlanValue?.[0]?.value);
      setValue("developmentPlan", { label: devPlanValue?.[0]?.label, value: devPlanValue?.[0]?.value });
      // revenue
      const revenueValue = revenueDataLabels?.data?.filter((item) => item?.value === specificTableData?.revenueEstate?.value);
      setMustil(revenueValue?.[0]?.value);
      setValue("revenueEstate", { label: revenueValue?.[0]?.label, value: revenueValue?.[0]?.value });
      const mustilValue = mustilDataLabels?.data?.filter((item) => item?.value === specificTableData?.rectangleNo);
      setValue("rectangleNo", { label: mustilValue?.[0]?.label, value: mustilValue?.[0]?.value });
      const typeOfLandValue = typeOfLand?.data?.filter((item) => item?.value === specificTableData?.typeLand?.value);
      setValue("typeLand", { label: typeOfLandValue?.[0]?.label, value: typeOfLandValue?.[0]?.value });
      setValue("isChange", JSON.parse(specificTableData?.isChange));
    }
  }, [devPlanOptons, specificTableData, districtOptons, tehsilDataLabels, revenueDataLabels, mustilDataLabels, typeOfLand, devPlanOptons]);

  useEffect(() => {
    if (getDTCP) {
      getDevPlanOption(getDTCP?.distCodeTCP);
      setDistrict(getDTCP?.value);
      getTehslidata(getDTCP?.value);
    }
  }, [getDTCP]);

  useEffect(() => {
    if (getDevPlanVal) getZoneOption(getDevPlanVal);
  }, [getDevPlanVal]);

  useEffect(() => {
    if (getSectorVal) getSectorOptions(getSectorVal);
  }, [getSectorVal]);

  useEffect(() => {
    if (getMustil) getMustilData(getMustil);
  }, [getMustil]);

  useEffect(() => {
    if (getNameRevenueState) {
      getRevenuStateData(getNameRevenueState);
      setTehsilCode(getNameRevenueState);
    }
  }, [getNameRevenueState]);

  useEffect(() => {
    const potential = ZoneOptions?.data?.filter((item) => item?.label === specificTableData?.potential);
    setSectorVal(potential?.[0]?.value);
    setValue("potential", { label: potential?.[0]?.label, value: potential?.[0]?.value });
  }, [ZoneOptions, specificTableData]);

  useEffect(() => {
    const sectorOpt = sectorOptions?.data?.filter((item) => item?.label === specificTableData?.sector);
    setValue("sector", { label: sectorOpt?.[0]?.label, value: sectorOpt?.[0]?.value });
  }, [sectorOptions, specificTableData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    getValues,
    watch,
    resetField,
  } = useForm({
    // mode: "onChange",
    // reValidateMode: "onChange",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    // resolver: yupResolver(modal ? MODAL_VALIDATION_SCHEMA : VALIDATION_SCHEMA),
    // shouldFocusError: true,
  });

  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);
  const { data: DistrictType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["District"]);

  useEffect(() => {
    // const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
    //   return data;
    // });
    const filteredData = PurposeType?.["common-masters"]?.Purpose?.filter((item) => item.isActive == "1");
    const test = filteredData?.map((item) => {
      return { value: item?.purposeCode, label: item?.name };
    });
    setPurposeOptions({ data: test, isLoading: false });
  }, [PurposeType]);

  useEffect(() => {
    const district = DistrictType?.["common-masters"]?.District?.map(function (data) {
      return { value: data?.disCode, label: data?.disName, distCodeTCP: data?.distCodeTCP, applicationTenantId: data?.tenantId };
    });
    setDistrictOptions({ data: district, isLoading: false });
  }, [DistrictType]);

  const getDevPlanOption = async (val) => {
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            tenantId: "hr",
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "DevPlan",
                filter: `[?(@.distCodeTCP=="${val}")]`,
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_search", payload);
      const devPlan = Resp?.data?.MdmsRes?.["common-masters"]?.DevPlan?.map(function (data) {
        return { value: data?.devPlanCode, label: data?.devPlan };
      });
      setDevPlanOptions({ data: devPlan, isLoading: false });
    } catch (error) {
      return error;
    }
  };

  const getZoneOption = async (val) => {
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            tenantId: "hr",
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "PotentialZone",
                filter: `[?(@.devPlanCode=="${val}")]`,
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_search", payload);
      const zonePlan = Resp?.data?.MdmsRes?.["common-masters"]?.PotentialZone?.map(function (data) {
        return { value: data?.devPlanCode, label: data?.potentialZone };
      });
      setZoneOptions({ data: zonePlan, isLoading: false });
    } catch (error) {
      return error;
    }
  };

  const getSectorOptions = async (val) => {
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            tenantId: "hr",
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "Sector",
                filter: `[?(@.devPlanCode=="${val}")]`,
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_search", payload);
      const sectorPlan = Resp?.data?.MdmsRes?.["common-masters"]?.Sector?.map(function (data) {
        return { value: data?.sectorCode, label: data?.sectorNo };
      });
      setSectorOptions({ data: sectorPlan, isLoading: false });
    } catch (error) {
      return error;
    }
  };

  const getTehslidata = async (data) => {
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            tenantId: "hr",
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "tehsil",
                filter: `[?(@.disCode=="${data}")]`,
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_search", payload);
      const tehsilData = Resp?.data?.MdmsRes?.["common-masters"]?.tehsil?.map(function (data) {
        return { value: data?.tehCode, label: data?.tehName };
      });
      setTehsilDataLabels({ data: tehsilData, isLoading: false });
    } catch (error) {
      return error;
    }
  };

  const getRevenuStateData = async (data) => {
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            tenantId: "hr",
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "village",
                filter: `[?(@.tehCode=="${data}")]`,
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_search", payload);
      const revenData = Resp?.data?.MdmsRes?.["common-masters"]?.village?.map(function (data) {
        return { value: data?.nvCODE, label: data?.villageName };
      });
      setRevenueDataLabels({ data: revenData, isLoading: false });
    } catch (error) {
      return error;
    }
  };

  const getMustilData = async (code) => {
    try {
      const Resp = await axios.post(
        "/egov-mdms-service/v1/_must?" + "dCode=" + district + "&" + "tCode=" + tehsilCode + "&NVCode=" + code,
        datapost,
        {}
      );

      const sortedNumbers = Resp?.data?.must?.sort((a, b) => a - b);

      const mustData = sortedNumbers?.map((el, i) => {
        return { label: el, id: i, value: el };
      });
      setMustilDataLabels({ data: mustData, isLoading: false });
    } catch (error) {
      return error;
    }
  };

  const getLandOwnerStateData = async (text) => {
    setLoader(true);
    try {
      const Resp = await axios.post(
        "/egov-mdms-service/v1/_owner?" +
          "dCode=" +
          district +
          "&" +
          "tCode=" +
          tehsilCode +
          "&NVCode=" +
          watch("revenueEstate")?.value +
          "&khewat=" +
          text,
        datapost,
        {}
      );
      setLoader(false);
      setValue("landOwner", Resp?.data?.[0]?.name);
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  const ApplicantPurposeModalData = (modaldata) => {
    modaldata["potential"] = modaldata?.potential?.label;
    modaldata["sector"] = modaldata?.sector?.label;
    modaldata["rectangleNo"] = modaldata?.rectangleNo?.value;
    modaldata["isChange"] = showFields;
    delete modaldata?.purpose;
    if (modaldata?.consolidationType === "consolidated") {
      delete modaldata?.bigha;
      delete modaldata?.biswa;
      delete modaldata?.biswansi;
    }
    if (modaldata?.consolidationType === "non-consolidated") {
      delete modaldata?.marla;
      delete modaldata?.kanal;
      delete modaldata?.sarsai;
    }
    if (!specificTableData?.rowid) {
      const length = modalData?.length + 1;
      modaldata["rowid"] = length.toString();
    } else {
      modaldata["rowid"] = specificTableData?.rowid;
    }
    if (specificTableData?.rowid) {
      const filteredRowData = modalData?.filter((item) => item?.rowid !== specificTableData?.rowid);
      setModalData([...filteredRowData, modaldata]);
    } else if (stepData?.AppliedLandDetails) {
      setModalData([...stepData?.AppliedLandDetails, modaldata]);
    } else {
      setModalData((prev) => [...prev, modaldata]);
    }
    setSpecificTableData(null);
    // resetValues();
    setmodal(false);
  };

  useEffect(() => {
    if (stepData?.AppliedLandDetails) setModalData(stepData?.AppliedLandDetails);
  }, [stepData?.AppliedLandDetails]);

  const PurposeFormSubmitHandler = async (data) => {
    const token = window?.localStorage?.getItem("token");
    data["purpose"] = data?.purpose?.value;
    data["totalArea"] = getTotalArea;
    delete data?.district;
    delete data?.developmentPlan;
    delete data?.typeLand;
    delete data?.landOwnerRegistry;
    delete data?.nonConsolidatedTotal;
    delete data?.consolidatedTotal;
    delete data?.editKhewats;
    delete data?.editRectangleNo;
    delete data?.hadbastNo;
    delete data?.potential;
    delete data?.zone;
    delete data?.sector;
    delete data?.tehsil;
    delete data?.revenueEstate;
    delete data?.rectangleNo;
    delete data?.kanal;
    delete data?.marla;
    delete data?.sarsai;
    delete data?.bigha;
    delete data?.biswa;
    delete data?.biswansi;
    delete data?.acquistionStatus;
    delete data?.agreementIrrevocialble;
    delete data?.agreementValidFrom;
    delete data?.validitydate;
    delete data?.authSignature;
    delete data?.collaboration;
    delete data?.developerCompany;
    delete data?.landOwner;
    delete data?.nameAuthSign;
    delete data?.registeringAuthority;
    delete data?.registeringAuthorityDoc;
    delete data?.consolidationType;
    delete data?.khewats;
    delete data?.rowid;
    if (!modalData?.length && !stepData?.AppliedLandDetails) alert("Please enter atleast one record");
    else {
      const postDistrict = {
        pageName: "ApplicantPurpose",
        action: "PURPOSE",
        applicationNumber: applicantId,
        createdBy: userInfo?.id,
        updatedBy: userInfo?.id,
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
          userInfo: userInfo,
        },
      };
      setLoader(true);
      try {
        const Resp = await axios.post("/tl-services/new/_create", postDistrict);
        setLoader(false);
        const useData = Resp?.data?.LicenseServiceResponseInfo?.[0]?.LicenseDetails?.[0];
        props.Step2Continue(useData);
      } catch (error) {
        setLoader(false);
        return error;
      }
    }
  };

  useEffect(() => {
    var nameArray = modalData?.map(function (itm) {
      if (isNaN(itm?.consolidatedTotal)) return 0;
      return itm?.consolidatedTotal;
    });
    var nameArrayB = modalData?.map(function (it) {
      if (isNaN(it?.nonConsolidatedTotal)) return 0;
      return it?.nonConsolidatedTotal;
    });

    const mixedSum = (nameArray = []) => {
      let sum = 0;
      for (let i = 0; i < nameArray.length; i++) {
        const el = nameArray[i];
        sum += +el;
      }
      return sum;
    };
    const mixedSumB = (nameArrayB = []) => {
      let sumA = 0;
      for (let i = 0; i < nameArrayB.length; i++) {
        const el = nameArrayB[i];
        sumA += +el;
      }
      return sumA;
    };

    const totalVal = mixedSum(nameArray) + mixedSumB(nameArrayB);
    setTotlArea(totalVal?.toFixed(3));
  }, [modalData]);

  const handleWorkflow = async () => {
    const token = window?.localStorage?.getItem("token");
    setLoader(true);
    const payload = {
      ProcessInstances: [
        {
          businessService: "NewTL",
          documents: null,
          businessId: applicantId,
          tenantId: "hr",
          moduleName: "TL",
          action: "INITIATE",
          previousStatus: "INITIATED",
          comment: null,
        },
      ],
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
      },
    };
    // try {
    //   const Resp = await axios.post("/tl-services/new/_create", postDistrict);
    //   setLoader(false);
    //   const useData = Resp?.data?.LicenseServiceResponseInfo?.[0]?.LicenseDetails?.[0];
    //   props.Step2Continue(useData);
    // } catch (error) {
    //   setLoader(false);
    //   return error;
    // }
    try {
      await axios.post("/egov-workflow-v2/egov-wf/process/_transition", payload);
      setLoader(false);
      props.Step2Back();
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  useEffect(() => {
    if (stepData) {
      const data = purposeOptions?.data?.filter((item) => item?.value === stepData?.purpose);
      setValue("purpose", { label: data?.[0]?.label, value: data?.[0]?.value });
    }
  }, [stepData, purposeOptions]);

  const { data: LandData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["LandType"]);

  useEffect(() => {
    const landType = LandData?.["common-masters"]?.LandType?.map(function (data) {
      return { value: data?.landId, label: data?.land };
    });
    setYypeOfLand({ data: landType, isLoading: false });
  }, [LandData]);

  const handleChangePurpose = (data) => {
    const purposeSelected = data?.value;
    window?.localStorage.setItem("purpose", purposeSelected);
  };

  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
      return;
    }

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

      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
    } catch (error) {
      setShowToastError({ label: error?.response?.data?.Errors[0]?.message, error: true, success: false });
      setLoader(false);
      return error.message;
    }
  };

  let delay;

  useEffect(() => {
    delay = setTimeout(() => {
      if (getKhewats) getLandOwnerStateData(getKhewats);
    }, 500);
    return () => clearTimeout(delay);
  }, [getKhewats]);

  const getApplicantUserData = async (id) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
      },
    };
    try {
      const Resp = await axios.post(`/tl-services/new/licenses/object/_getByApplicationNumber?applicationNumber=${id}`, payload);
      const userData = Resp?.data?.LicenseDetails?.[0]?.ApplicantPurpose;
      setData({ caseNumber: Resp?.data?.caseNumber, dairyNumber: Resp?.data?.dairyNumber });
      setStepData(userData);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    setApplicantId(id?.toString());
    if (id) getApplicantUserData(id);
  }, []);

  useEffect(() => {
    if (watch("consolidationType") == "consolidated") {
      resetField("nonConsolidationType");
      resetField("bigha");
      resetField("biswa");
      resetField("biswansi");
      resetField("nonConsolidatedTotal");
    }
    if (watch("consolidationType") == "non-consolidated") {
      resetField("kanal");
      resetField("marla");
      resetField("sarsai");
      resetField("consolidatedTotal");
    }
  }, [watch("consolidationType")]);

  useEffect(() => {
    const val = watch("marla") * 0.00625 + watch("sarsai") * 0.00069 + watch("kanal") * 0.125;
    setValue("consolidatedTotal", isNaN(val) ? "N/A" : val?.toFixed(5));
  }, [watch("sarsai"), watch("marla"), watch("kanal")]);

  useEffect(() => {
    if (watch("nonConsolidationType") == "kachha") {
      const valueA = watch("bigha") * 1008 + watch("biswa") * 50.41 + watch("biswansi") * 2.52;
      setValue("nonConsolidatedTotal", isNaN(valueA) ? "N/A" : (valueA / 4840)?.toFixed(5));
    }
    if (watch("nonConsolidationType") == "pucka") {
      const valueB = watch("bigha") * 3025 + watch("biswa") * 151.25 + watch("biswansi") * 7.56;
      setValue("nonConsolidatedTotal", isNaN(valueB) ? "N/A" : (valueB / 4840)?.toFixed(5));
    }
  }, [watch("bigha"), watch("biswa"), watch("biswansi"), watch("nonConsolidationType")]);

  const fetchLicenceNumbers = async () => {
    const token = window?.localStorage?.getItem("token");
    setLoader(true);
    const payload = {
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
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/_getServices/_search?type=LicenceNumber&businessService=NewTL", payload);
      setLoader(false);
      const appNumbers = Resp?.data?.applicationNumbers?.map(function (data) {
        return { value: data, label: data };
      });
      setAppNumbers(appNumbers);
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  useEffect(() => {
    fetchLicenceNumbers();
  }, []);

  const handleFetch = async () => {
    const token = window?.localStorage?.getItem("token");
    const appNumber = watch("licenceNumber")?.value;
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
      },
    };
    try {
      const Resp = await axios.post(`/tl-services/new/licenses/object/_getByApplicationNumber?applicationNumber=${appNumber}`, payload);
      const userData = Resp?.data?.LicenseDetails?.[0]?.ApplicantPurpose?.AppliedLandDetails;
      // setArray(oldArray => [...oldArray,newValue] );
      setMigModalData(userData);
      // setModalData([...modalData, ...userData]);
      // setStepData(userData);
    } catch (error) {
      return error;
    }
  };

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(PurposeFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence Application </h4>
            <h6 style={{ display: "flex", alignItems: "center" }}>Application No: {applicantId}</h6>
          </div>
          {getData?.caseNumber && (
            <div>
              <h6 className="mt-1" style={{ marginLeft: "21px" }}>
                Case No: {getData?.caseNumber.slice(0, 7)}
              </h6>
              <h6 className="mt-1" style={{ marginLeft: "21px" }}>
                Diary No: {getData?.dairyNumber}
              </h6>
            </div>
          )}
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <Form.Group>
              {/* <div className="row" style={{ alignItems: "self-end" }}>
                <div className="col col-lg-3 col-md-6 col-sm-6">
                  <label>
                    <h2>Type of Application</h2>
                  </label>
                  <ReactMultiSelect
                    control={control}
                    name="typeOfApplication"
                    placeholder="Select type"
                    data={applicationType}
                    labels="typeOfApplication"
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.typeOfApplication && errors?.typeOfApplication?.message}
                  </h3>
                </div>
                {(watch("typeOfApplication")?.value == "addition" || watch("typeOfApplication")?.value == "migration") && (
                  <div className="col col-lg-3 col-md-6 col-sm-6">
                    <label>
                      <h2>Licence Number</h2>
                    </label>
                    <ReactMultiSelect control={control} name="licenceNumber" placeholder="Select type" data={getAppNumbers} labels="licenceNumber" />
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.licenceNumber && errors?.licenceNumber?.message}
                    </h3>
                  </div>
                )}
                {(watch("typeOfApplication")?.value == "addition" || watch("typeOfApplication")?.value == "migration") &&
                  watch("licenceNumber")?.value && (
                    <div className="col col-lg-3 col-md-6 col-sm-6">
                      <div
                        style={{
                          background: "#024f9d",
                          color: "white",
                          height: "38px",
                          display: "flex",
                          borderRadius: "5px",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={handleFetch}
                      >
                        Fetch
                      </div>
                    </div>
                  )}
              </div> */}
              <Row className="mt-3" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        {`${t("NWL_APPLICANT_PURPOSE_OF_LICENCE")}`}
                        {/* Purpose Of Licence */}
                        <span style={{ color: "red" }}>*</span>
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
                    rules={{ required: "This field is required" }}
                    loading={purposeOptions?.isLoading}
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors.purpose && "This field is required"}
                  </h3>
                </Col>

                <Col md={8} xxl lg="8" style={{ display: "flex", alignItems: "end" }}>
                  <p>Note: The application to be received under policy dated 10.11.17 shall only be accepted within window period.</p>
                </Col>
              </Row>

              <div className="ml-auto" style={{ marginTop: 20 }}>
                <h5>
                  <b>Land schedule</b>
                </h5>
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
                    if (!getValues()?.purpose) alert("Please Select Purpose First To Proceed Further");
                    else {
                      setSelectedFiles([]);
                      setValue("registeringAuthorityDoc", "");
                      setValue("landOwnerSPAGPADoc", "");
                      setValue("developerSPAGPADoc", "");
                      setValue("collaboratorAgreementDocument", "");
                      resetValues();
                      setSpecificTableData(null);
                      setmodal(true);
                    }
                  }}
                >
                  Enter Details
                </Button>
              </div>
              <br></br>

              {modalData.length > 0 && (
                <div className="applt" style={{ overflow: "auto" }}>
                  <WorkingTable columns={columns} data={modalData} />
                </div>
              )}
              {/* {migModalData.length > 0 && (
                <div className="applt" style={{ overflow: "auto" }}>
                  <WorkingTable columns={migColumns} data={migModalData} />
                </div>
              )} */}
            </Form.Group>
            <br></br>
            <div class="row">
              <div class="col-sm-6 text-left">
                <div id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => handleWorkflow()}>
                  Back
                </div>
              </div>
              <div class="col-sm-6 text-right">
                <label className="mr-4">Total Area: {getTotalArea}</label>
                &nbsp;&nbsp;&nbsp;
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Save and Continue
                </button>
              </div>
            </div>
          </Card>
        </Card>
      </form>

      <Modal size="xl" isOpen={modal} toggle={() => setmodal(!modal)}>
        <div style={{ padding: "4px", textAlign: "right" }}>
          <span onClick={() => setmodal(!modal)} style={{ cursor: "pointer" }}>
            X
          </span>
        </div>
        <ModalBody>
          <form onSubmit={handleSubmit(ApplicantPurposeModalData)}>
            <Row className="ml-auto mb-3">
              <Col className="mt-2" md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      {`${t("NWL_APPLICANT_DISTRICT_LAND_SCHEDULE")}`}
                      {/* District */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  name="district"
                  rules={{ required: "This field is required" }}
                  data={districtOptons?.data}
                  labels="District"
                  loading={districtOptons?.isLoading}
                  onChange={(e) => {
                    getTehslidata(e.value);
                    setDistrict(e.value);
                    getDevPlanOption(e.distCodeTCP);
                  }}
                />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors.district && "This field is required"}
                </h3>
              </Col>
              <br></br>
              {watch("district")?.value && (
                <Col className="mt-2" md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        {`${t("NWL_APPLICANT_DEVELOPMENT_PLAN_LAND_SCHEDULE")}`}
                        {/* Development Plan */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>

                  <ReactMultiSelect
                    control={control}
                    name="developmentPlan"
                    rules={{ required: "This field is required" }}
                    placeholder="DevPlan"
                    data={devPlanOptons?.data}
                    labels="DevPlan"
                    loading={devPlanOptons?.isLoading}
                    onChange={(e) => getZoneOption(e?.value)}
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.developmentPlan && "This field is required"}
                  </h3>
                </Col>
              )}
              <br></br>
              {watch("developmentPlan")?.value && (
                <Col className="mt-2" md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        {`${t("NWL_APPLICANT_ZONE_LAND_SCHEDULE")}`}
                        {/* Zone */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                  <ReactMultiSelect
                    control={control}
                    rules={{ required: "This field is required" }}
                    name="potential"
                    placeholder="zonePlan"
                    data={ZoneOptions?.data}
                    labels="PotentialZone"
                    loading={ZoneOptions?.isLoading}
                    onChange={(e) => getSectorOptions(e?.value)}
                  />

                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.potential && "This field is required"}
                  </h3>
                </Col>
              )}
              <br></br>
              {watch("potential")?.value && (
                <Col className="mt-2" md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        {`${t("NWL_APPLICANT_SECTOR_LAND_SCHEDULE")}`}
                        {/* Sector */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                  <ReactMultiSelect
                    control={control}
                    name="sector"
                    rules={{ required: "This field is required" }}
                    placeholder="Sector"
                    data={sectorOptions?.data}
                    labels="Sector"
                    loading={sectorOptions?.isLoading}
                  />

                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.sector && "This field is required"}
                  </h3>
                </Col>
              )}
              <br></br>
              <Col className="mt-2" md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      {`${t("NWL_APPLICANT_TEHSIL_LAND_SCHEDULE")}`}
                      {/* Tehsil  */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  name="tehsil"
                  rules={{ required: "This field is required" }}
                  data={tehsilDataLabels?.data}
                  labels="Tehsil"
                  loading={tehsilDataLabels?.isLoading}
                  onChange={(e) => {
                    getRevenuStateData(e.value);
                    setTehsilCode(e.value);
                  }}
                />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.tehsil && "This field is required"}
                </h3>
              </Col>
              <Col className="mt-2" md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      {`${t("NWL_APPLICANT_REVENUE_ESTATE_LAND_SCHEDULE")}`}
                      {/* Name of Revenue Estate */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  name="revenueEstate"
                  rules={{ required: "This field is required" }}
                  data={revenueDataLabels?.data}
                  labels="Revenue Estate"
                  loading={revenueDataLabels?.isLoading}
                  onChange={(e) => getMustilData(e.value)}
                />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.revenueEstate && "This field is required"}
                </h3>
              </Col>
              <br></br>
              <Col className="mt-2" md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      {`${t(" NWL_APPLICANT_HADBAST_NUMBER_LAND_SCHEDULE")}`}
                      {/* Hadbast No. */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <input
                  // type="number"
                  className="form-control"
                  placeholder=""
                  {...register("hadbastNo", {
                    required: "This field is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]*$/,
                      message: "Only alphanumeric characters are allowed",
                    },
                    maxLength: {
                      value: 10,
                      message: "Maximum length exceeded (10 characters)",
                    },
                  })}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.hadbastNo && errors?.hadbastNo?.message}
                </h3>
              </Col>
            </Row>

            <Row className="ml-auto mb-3">
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      {`${t("NWL_APPLICANT_RECTANGLE_NUMBER_LAND_SCHEDULE")}`}
                      {/* Rectangle No./Mustil */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  rules={{ required: "This field is required" }}
                  data={mustilDataLabels?.data}
                  loading={mustilDataLabels?.isLoading}
                  labels="Rectangle No."
                  name="rectangleNo"
                />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.rectangleNo && "This field is required"}
                </h3>
              </Col>

              <Col md={4} xxl lg="4">
                <div>
                  <label>
                    <h2>
                      {`${t("NWL_APPLICANT_KHASRA_NUMBER_LAND_SCHEDULE")}`}
                      {/* Khasra Number */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </label>
                </div>
                <input
                  autoComplete="off"
                  type="text"
                  className="form-control"
                  placeholder="Enter Khasra"
                  {...register("khewats", {
                    required: "This field is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]*$/,
                      message: "Only alphanumeric characters are allowed",
                    },
                    maxLength: {
                      value: 10,
                      message: "Maximum length exceeded (10 characters)",
                    },
                  })}
                  onChange={(e) => setKhewats(e?.target?.value)}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors.khewats && errors.khewats.message}
                </h3>
              </Col>

              <Col style={{ display: "flex", alignItems: "center" }} md={4} xxl lg="4">
                <div className="form-check">
                  <label style={{ marginRight: "23px" }} className="checkbox" for="selectMIN">
                    {`${t("NWL_APPLICANT_MIN")}`}
                    {/* MIN */}
                  </label>
                  <input className="form-check-input" formControlName="agreeCheck" type="checkbox" value="" id="selectMIN" {...register("min")} />
                </div>
              </Col>

              <Col className="mt-3" md={4} xxl lg="4">
                <div>
                  <label>
                    <h2>
                      {`${t("NWL_APPLICANT_NAME_OF_LAND_OWNER_LAND_SCHEDULE")}`}
                      {/* Name of Land Owner */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </label>
                </div>
                <Form.Control as="textarea" rows={1} type="text" className="form-control" placeholder="" {...register("landOwner")} disabled />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.landOwner && errors?.landOwner?.message}
                </h3>
              </Col>
              <div className="col col-12 mt-3">
                <h2>
                  <b>
                    {`${t("NWL_APPLICANT_DEVELOPED_IN_COLLABORATION_LAND_SCHEDULE")}`}
                    {/* Whether Khasra been developed in collaboration */}
                    <span style={{ color: "red" }}>*</span>
                  </b>
                  &nbsp;&nbsp;
                  <label htmlFor="collaborationYes">
                    <input {...register("collaboration")} type="radio" value="Y" id="collaborationYes" />
                    &nbsp;&nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="collaborationNo">
                    <input {...register("collaboration")} type="radio" value="N" id="collaborationNo" />
                    &nbsp;&nbsp; No &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.collaboration && errors?.collaboration?.message}
                  </h3>
                </h2>
                {watch("collaboration") === "Y" && (
                  <div>
                    <p className="mt-3 mb-3">
                      Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development
                      agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.
                    </p>
                    <div style={{ placeItems: "end" }} className="row ">
                      <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                        <label>
                          <h2>
                            {`${t("NWL_APPLICANT_NAME_OF_THE_DEVELOPER_COMPANY_LAND_SCHEDULE")}`}
                            {/* Name of the developer company */}
                            <span style={{ color: "red" }}>*</span>
                            <Tooltip title=" Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered.">
                              <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                            </Tooltip>
                          </h2>
                        </label>
                        <input
                          className="form-control"
                          {...register("developerCompany", {
                            pattern: {
                              value: /^[a-zA-Z0-9]*$/,
                              message: "Only alphanumeric characters are allowed",
                            },
                            maxLength: {
                              value: 200,
                              message: "Maximum length exceeded (200 characters)",
                            },
                            required: watch("collaboration") === "Y" ? "This field is required" : false,
                          })}
                          placeholder=""
                          type="text"
                        />
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.developerCompany && errors?.developerCompany?.message}
                        </h3>
                      </div>
                      <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                        <label>
                          <h2>
                            {`${t("NWL_APPLICANT_DATA_OF_REGISTERING_COLLOABORATION_AGREEMENT_LAND_SCHEDULE")}`}
                            {/* Date of registering collaboration agreement */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                        </label>
                        <Form.Control
                          type="date"
                          value={modalData.agreementValidFrom}
                          className="form-control"
                          placeholder=""
                          {...register("agreementValidFrom", {
                            required: watch("collaboration") === "Y" ? "This field is required" : false,
                          })}
                          max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                        />
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.agreementValidFrom && errors?.agreementValidFrom?.message}
                        </h3>
                      </div>
                      <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                        <h2>
                          {`${t("NWL_APPLICANT_WHETER_COLLABORATION_AGREEMENT_IRREVOCABLE_LAND_SCHEDULE")}`}
                          {/* Whether collaboration agreement irrevocable (Yes/No) */}
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                        <br></br>
                        <label htmlFor="agreementIrrevocialbleyes">
                          <input
                            {...register("agreementIrrevocialble", {
                              required: watch("collaboration") === "Y" ? "This field is required" : false,
                            })}
                            type="radio"
                            value="Y"
                            id="agreementIrrevocialbleyes"
                          />
                          &nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="agreementIrrevocialbleno">
                          <input
                            {...register("agreementIrrevocialble", {
                              required: watch("collaboration") === "Y" ? "This field is required" : false,
                            })}
                            type="radio"
                            value="N"
                            id="agreementIrrevocialbleno"
                          />
                          &nbsp;&nbsp; No &nbsp;&nbsp;
                        </label>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.agreementIrrevocialble && errors?.agreementValidFrom?.message}
                        </h3>
                      </div>
                      <div className="col col-lg-4 col-md-6 col-sm-6 mb-2 mt-3">
                        <label>
                          <h2>
                            {`${t("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_LAND_OWNER")}`}
                            {/* Name of authorized signatory on behalf of land owner(s) */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                        </label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder=""
                          {...register("authSignature", {
                            pattern: {
                              value: /^[a-zA-Z0-9]*$/,
                              message: "Only alphanumeric characters are allowed",
                            },
                            maxLength: {
                              value: 200,
                              message: "Maximum length exceeded (200 characters)",
                            },
                            required: watch("collaboration") === "Y" ? "This field is required" : false,
                          })}
                        />
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.authSignature && errors?.authSignature?.message}
                        </h3>
                      </div>
                      <div className="col col-lg-4 col-md-6 col-sm-6 mb-2 mt-3">
                        <label>
                          <h2>
                            {`${t("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_DEVELOPER")}`}
                            {/* Name of authorized signatory on behalf of developer */}
                            <span style={{ color: "red" }}>*</span>
                            <Tooltip title="  Name of authorized signatory on behalf of developer to sign Collaboration agreement.">
                              <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                            </Tooltip>
                          </h2>
                        </label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder=""
                          {...register("nameAuthSign", {
                            pattern: {
                              value: /^[a-zA-Z0-9]*$/,
                              message: "Only alphanumeric characters are allowed",
                            },
                            maxLength: {
                              value: 200,
                              message: "Maximum length exceeded (200 characters)",
                            },
                            required: watch("collaboration") === "Y" ? "This field is required" : false,
                          })}
                        />
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.nameAuthSign && errors?.nameAuthSign?.message}
                        </h3>
                      </div>
                      <div className="col col-lg-4 col-md-6 col-sm-6 mb-2 mt-3">
                        <label>
                          <h2>
                            {`${t("NWL_APPLICANT_REGISTERING_AUTHORITY_LAND_SCHEDULE")}`}
                            {/* Registering Authority */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                        </label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder=""
                          {...register("registeringAuthority", {
                            pattern: {
                              value: /^[a-zA-Z0-9]*$/,
                              message: "Only alphanumeric characters are allowed",
                            },
                            maxLength: {
                              value: 200,
                              message: "Maximum length exceeded (200 characters)",
                            },
                            required: watch("collaboration") === "Y" ? "This field is required" : false,
                          })}
                        />
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.registeringAuthority && errors?.registeringAuthority?.message}
                        </h3>
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col col-3">
                        <h6 style={{ display: "flex" }}>
                          {`${t("NWL_APPLICANT_REGISTERING_AUTHORITY_DOCUMENT_LAND_SCHEDULE")}`}
                          {/* Collaboration document */}
                          <span style={{ color: "red" }}>*</span>
                        </h6>
                        <label>
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => getDocumentData(e?.target?.files[0], "registeringAuthorityDoc")}
                            accept="application/pdf/jpeg/png"
                          />
                        </label>
                        {watch("registeringAuthorityDoc") && (
                          <a onClick={() => getDocShareholding(watch("registeringAuthorityDoc"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        )}
                      </div>

                      <div className="col col-3">
                        <h6 style={{ display: "flex" }}>
                          {`${t("NWL_APPLICANT_BEHALF_OF_LAND_OWNER_DOCUMENT")}`}
                          {/* Upload SPA/GPA of authorized signatory on behalf of land owner */}
                        </h6>
                        <label>
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => getDocumentData(e?.target?.files[0], "landOwnerSPAGPADoc")}
                            accept="application/pdf/jpeg/png"
                          />
                        </label>
                        {watch("landOwnerSPAGPADoc") && (
                          <a onClick={() => getDocShareholding(watch("landOwnerSPAGPADoc"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        )}
                      </div>

                      <div className="col col-3">
                        <h6 style={{ display: "flex" }}>
                          {`${t("NWL_APPLICANT_BEHALF_OF_DEVELOPER_DOCUMENT")}`}
                          {/* Upload SPA/GPA of authorized signatory on behalf of developer */}
                        </h6>
                        <label>
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => getDocumentData(e?.target?.files[0], "developerSPAGPADoc")}
                            accept="application/pdf/jpeg/png"
                          />
                        </label>
                        {watch("developerSPAGPADoc") && (
                          <a onClick={() => getDocShareholding(watch("developerSPAGPADoc"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        )}
                      </div>

                      <div className="col col-3">
                        <h6 style={{ display: "flex" }}>
                          {`${t("NWL_APPLICANT_COLLABORATOR_AGREEMENT_DOCUMENT")}`}
                          {/* Collaborator Agreement Document */}
                        </h6>
                        <label>
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => getDocumentData(e?.target?.files[0], "collaboratorAgreementDocument")}
                            accept="application/pdf/jpeg/png"
                          />
                        </label>
                        {watch("collaboratorAgreementDocument") && (
                          <a onClick={() => getDocShareholding(watch("collaboratorAgreementDocument"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Col className="mt-3" md={4} xxl lg="4">
                <label>
                  <h2>
                    {`${t("NWL_APPLICANT_TYPE_OF_LAND_SCHEDULE")}`}
                    {/* Type of land */}
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </label>
                <ReactMultiSelect
                  control={control}
                  name="typeLand"
                  rules={{ required: "This field is required" }}
                  data={typeOfLand?.data}
                  labels="typeland"
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.typeLand && "This field is required"}
                </h3>
              </Col>
            </Row>
            <br></br>
            <Row className="ml-auto mb-3">
              <div className="form-check">
                <label style={{ marginRight: "23px" }} className="checkbox" for="flexCheckDefault">
                  <b>
                    {`${t("NWL_APPLICANT_CHANGE_IN_INFORMATION_LAND_SCHEDULE")}`}

                    {/* If there is a change in information auto-populated, then the information be provided in the following format. */}
                  </b>
                </label>
                <input
                  onClick={(e) => setShowFields(e.target.checked)}
                  className="form-check-input"
                  formControlName="agreeCheck"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                  {...register("isChange")}
                />
              </div>
              {watch("isChange") && (
                <Row className="ml-auto mb-3">
                  <Col md={4} xxl lg="4">
                    <div>
                      <Form.Label>
                        <h2>
                          {`${t("NWL_APPLICANT_RECTANGLE_NO_MUSTIL_LAND_SCHEDULE")}`}
                          {/* Rectangle No./Mustil */}
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </Form.Label>
                    </div>
                    <input
                      autoComplete="off"
                      type="number"
                      className="form-control"
                      placeholder="Rectangle No./Mustil"
                      {...register("editRectangleNo")}
                    />
                  </Col>

                  <Col md={4} xxl lg="4">
                    <div>
                      <label>
                        <h2>
                          {`${t("NWL_APPLICANT_KHEWATS_NUMBER_CHANGED_LAND_SCHEDULE")}`}
                          {/* Khasra Number */}
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                    </div>
                    <input autoComplete="off" type="text" className="form-control" placeholder="khasra No." {...register("editKhewats")} />
                  </Col>

                  <Col md={4} xxl lg="4">
                    <div>
                      <label>
                        <h2>
                          {`${t("NWL_APPLICANT_NAME_OF_THE_LAND_OWNER_AS_PER_MUTATION_LAND_SCHEDULE")}`}
                          {/* Name of the Land Ower as per Mutation/Jamabandi */}
                        </h2>
                      </label>
                    </div>
                    <input autoComplete="off" type="text" className="form-control" placeholder="" {...register("landOwnerRegistry")} />
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.landOwnerRegistry && errors?.landOwnerRegistry?.message}
                    </h3>
                  </Col>
                </Row>
              )}

              <Col md={4} xxl lg="12">
                <div>
                  <h2>
                    <b>
                      {" "}
                      {`${t("NWL_APPLICANT_CONSLIDATION_TYPE_LAND_SCHEDULE")}`}
                      {/* Consolidation Type */}
                      <span style={{ color: "red" }}>*</span>{" "}
                    </b>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <label htmlFor="consolidatedyes">
                      <input
                        {...register("consolidationType", { required: "This field is required" })}
                        type="radio"
                        value="consolidated"
                        defaultValue="consolidated"
                        id="consolidatedyes"
                      />
                      &nbsp; Consolidated &nbsp;&nbsp;
                    </label>
                    <label htmlFor="nonConsolidatedno">
                      <input
                        {...register("consolidationType", { required: "This field is required" })}
                        type="radio"
                        value="non-consolidated"
                        id="nonConsolidatedno"
                      />
                      &nbsp; Non-Consolidated &nbsp;&nbsp;
                    </label>
                  </h2>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.consolidationType && errors?.consolidationType?.message}
                  </h3>
                </div>

                {watch("consolidationType") == "non-consolidated" && (
                  <div>
                    <div className="col col-4 mt-2 mb-3 p-0">
                      <label>
                        <h2>
                          {`${t("NWL_APPLICANT_ACQUISITION_STATUS")}`}
                          {/* Acquisition status */}
                        </h2>
                      </label>
                      <Form.Control type="text" className="form-control" placeholder="" {...register("acquistionStatus")} />
                      {/* <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.registeringAuthority && errors?.registeringAuthority?.message}
                  </h3> */}
                    </div>
                    <div>
                      <h2>
                        <b>
                          Non Consolidation Type<span style={{ color: "red" }}>*</span>{" "}
                        </b>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label htmlFor="nonConsolidationTypekacha">
                          <input
                            {...register("nonConsolidationType", {
                              required: " Please Select Non Consolidation Type",
                            })}
                            type="radio"
                            value="kachha"
                            id="nonConsolidationTypekacha"
                          />
                          &nbsp; Kachha &nbsp;&nbsp;
                        </label>
                        <label htmlFor="nonConsolidatedTypepucha">
                          <input
                            {...register("nonConsolidationType", {
                              required: " Please Select Non Consolidation Type",
                            })}
                            type="radio"
                            value="pucka"
                            id="nonConsolidatedTypepucha"
                            onChange={(e) => {
                              resetField("bigha");
                              resetField("biswa");
                              resetField("biswansi");
                            }}
                          />
                          &nbsp; Pucka &nbsp;&nbsp;
                        </label>
                      </h2>
                    </div>

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.nonConsolidationType && errors?.nonConsolidationType?.message}
                    </h3>
                  </div>
                )}

                {watch("consolidationType") == "consolidated" && (
                  <div>
                    <div className="col col-4 mt-2 mb-3 p-0">
                      <label>
                        <h2>
                          {`${t("NWL_APPLICANT_ACQUISITION_STATUS")}`}
                          {/* Acquisition status */}
                        </h2>
                      </label>
                      <Form.Control type="text" className="form-control" placeholder="" {...register("acquistionStatus")} />
                    </div>

                    <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                      <thead>
                        <tr>
                          <th>
                            <h2>
                              {`${t("NWL_APPLICANT_KANAL_LAND_SCHEDULE")}`}
                              {/* Kanal  */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </th>
                          <th>
                            <h2>
                              {`${t("NWL_APPLICANT_MARLA_LAND_SCHEDULE")}`}
                              {/* Marla  */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </th>
                          <th>
                            <h2>
                              {`${t("NWL_APPLICANT_SARSAI_LAND_SCHEDULE")}`}
                              {/* Sarsai */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </th>
                          <th>
                            <h2>
                              {`${t("NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE")}`}
                              {/* Total Area (in acres)  */}
                            </h2>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              {...register("kanal", {
                                required: watch("consolidationType") === "consolidated" ? "This field is required" : false,
                              })}
                              id="kanal"
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.kanal && errors?.kanal?.message}
                            </h3>
                            <label htmlFor="sum">Total: {(watch("kanal") * 0.125)?.toFixed(3)}</label>&nbsp;&nbsp;
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              {...register("marla", {
                                required: watch("consolidationType") === "consolidated" ? "This field is required" : false,
                              })}
                              id="marla"
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.marla && errors?.marla?.message}
                            </h3>
                            <label htmlFor="summarla">Total: {(watch("marla") * 0.00625)?.toFixed(3)}</label>&nbsp;&nbsp;
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              {...register("sarsai", {
                                required: watch("consolidationType") === "consolidated" ? "This field is required" : false,
                              })}
                              id="sarsai"
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.sarsai && errors?.sarsai?.message}
                            </h3>
                            <label htmlFor="sumsarsai">Total: {(watch("sarsai") * 0.00069)?.toFixed(3)}</label>&nbsp;&nbsp;
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              {...register("consolidatedTotal", {
                                maxLength: {
                                  value: 99,
                                  message: "Maximum length exceeded",
                                },
                                // min: {
                                //   value: getMinimumNorms(watch("purpose").label, watch("potential").label),
                                //   message: "It should be " + getMinimumNorms(watch("purpose").label, watch("potential").label) + " acres minimum",
                                // },
                                max: {
                                  value: getMaxNorms(watch("purpose").label, watch("potential").label),
                                  message: "It should be " + getMaxNorms(watch("purpose").label, watch("potential").label) + " acres maximum",
                                },
                              })}
                              disabled
                            />
                            &nbsp;&nbsp;
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.consolidatedTotal && errors?.consolidatedTotal?.message}
                            </h3>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                {(watch("nonConsolidationType") == "kachha" || watch("nonConsolidationType") == "pucka") && (
                  <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                    <thead>
                      <tr>
                        <th>
                          <h2>
                            {`${t("NWL_APPLICANT_BIGHA_LAND_SCHEDULE")}`}
                            {/* Bigha (sq. yard) */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                        </th>
                        <th>
                          <h2>
                            {`${t("NWL_APPLICANT_BISWA_LAND_SCHEDULE")}`}
                            {/* Biswa (sq. yard)  */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                        </th>
                        <th>
                          <h2>
                            {`${t("NWL_APPLICANT_BISWANSI_LAND_SCHEDULE")}`}
                            {/* Biswansi (sq. yard)  */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                          &nbsp;&nbsp;
                        </th>
                        <th>
                          <h2>
                            {`${t("NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE")}`}
                            {/* Total Area (in acres) */}
                          </h2>
                          &nbsp;&nbsp;
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="number"
                            id="bigha"
                            className="form-control"
                            {...register("bigha", {
                              required: watch("consolidationType") === "non-consolidated" ? "This field is required" : false,
                            })}
                          />
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.bigha && errors?.bigha?.message}
                          </h3>
                          <label htmlFor="sumBigha">
                            Total:
                            {watch("nonConsolidationType") == "kachha" && Number(watch("bigha")) * 1008}
                            {watch("nonConsolidationType") == "pucka" && Number(watch("bigha")) * 3025}
                          </label>
                          &nbsp;&nbsp;
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            id="biswa"
                            {...register("biswa", {
                              required: watch("consolidationType") === "non-consolidated" ? "This field is required" : false,
                            })}
                          />
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.biswa && errors?.biswa?.message}
                          </h3>
                          <label htmlFor="sumBiswa">
                            Total:
                            {watch("nonConsolidationType") == "kachha" && (Number(watch("biswa")) * 50.41)?.toFixed(3)}
                            {watch("nonConsolidationType") == "pucka" && (Number(watch("biswa")) * 151.25)?.toFixed(3)}
                          </label>
                          &nbsp;&nbsp;
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            id="biswansi"
                            {...register("biswansi", {
                              required: watch("consolidationType") === "non-consolidated" ? "This field is required" : false,
                            })}
                          />
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.biswansi && errors?.biswansi?.message}
                          </h3>
                          <label htmlFor="sumBiswansi">
                            Total:
                            {watch("nonConsolidationType") == "kachha" && (Number(watch("biswansi")) * 2.52)?.toFixed(3)}
                            {watch("nonConsolidationType") == "pucka" && (Number(watch("biswansi")) * 7.56)?.toFixed(3)}
                          </label>
                          &nbsp;&nbsp;
                        </td>
                        <td>
                          <input
                            disabled
                            type="number"
                            className="form-control"
                            {...register("nonConsolidatedTotal", {
                              maxLength: {
                                value: 99,
                                message: "Maximum length exceeded",
                              },
                              min: {
                                value: getMinimumNorms(watch("purpose").label, watch("potential").label),
                                message: "It should be " + getMinimumNorms(watch("purpose").label, watch("potential").label) + " acres minimum",
                              },
                              max: {
                                value: getMaxNorms(watch("purpose").label, watch("potential").label),
                                message: "It should be " + getMaxNorms(watch("purpose").label, watch("potential").label) + " acres maximum",
                              },
                            })}
                          />
                          &nbsp;&nbsp;
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.consolidatedTotal && errors?.consolidatedTotal?.message}
                          </h3>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </Col>
            </Row>

            <button type="submit" style={{ float: "right" }} class="btn btn-primary btn-md center-block">
              Submit
            </button>
          </form>
        </ModalBody>
        <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
      </Modal>
      {showToastError && (
        <CusToaster
          label={showToastError?.label}
          success={showToastError?.success}
          error={showToastError?.error}
          onClose={() => {
            setShowToastError({ label: "", success: false, error: false });
          }}
        />
      )}
    </div>
  );
};

export default ApllicantPuropseForm;
