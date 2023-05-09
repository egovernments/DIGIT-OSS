import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import { useTranslation } from "react-i18next";
import { getDocShareholding } from "../../../docView/docView.help";
import FileUpload from "@mui/icons-material/FileUpload";
import Visibility from "@mui/icons-material/Visibility";
import axios from "axios";
import Spinner from "../../../../../../components/Loader";
import CusToaster from "../../../../../../components/Toaster";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation } from "react-router-dom";

function CompletionLic() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const token = window?.localStorage?.getItem("token");
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [successDialog, setSuccessDialog] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const { pathname: url } = useLocation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [completionCertificateDetails, setCompletionCertificate] = useState({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,

  } = useForm({});

  const documents = [
    {
      label: t("COPY_OF_APPROVED_SERVICE_PLAN_ESTIMATE"),
      selectorKey: "copyApprovalServicePlanFile",
      fileName: "copyApprovalServicePlan"
    },
    {
      label: t("ELECTRICAL_PLAN_IS_VERIFIED"),
      selectorKey: "electricServicePlanFile",
      fileName: "electricServicePlan"
    },
    {
      label: t("TRANSFER_OF_LICENSED_LAND"),
      selectorKey: "transferOfLicenseCertificateFile",
      fileName: "transferOfLicenseCertificate"
    },
    {
      label: t("OCCUPATION_CERTIFICATION"),
      selectorKey: "occupationCertificateFile",
      fileName: "occupationCertificate"
    },
    {
      label: t("UPDATED_COMPLIANCE_WITH_RULES"),
      selectorKey: "updatedComplianceWithRulesFile",
      fileName: "updatedComplianceWithRules"
    },
    {
      label: t("PAYMENT_OF_AUGMENTATION_CHARGES"),
      selectorKey: "paymentAugmentationChargesFile",
      fileName: "paymentAugmentationCharges"
    },
    {
      label: t("THIRD_PARTY_AUDIT_ON_15%"),
      selectorKey: "caCertificateFile",
      fileName: "caCertificate"
    },
    {
      label: t("STATUS_OF_DEVELOPMENT_WORK_ALONG_WITH_SITE_PHOTO"),
      selectorKey: "statusOfDevelopmentWorkFile",
      fileName: "statusOfDevelopmentWork"
    },
    {
      label: t("IF_PART_COMPLETION_IS_APPLIED"),
      selectorKey: "completionApprovalLayoutPlanFile",
      fileName: "completionApprovalLayoutPlan"
    },
    {
      label: t("NOC_FROM_MOEF"),
      selectorKey: "nocFromMOEFFile",
      fileName: "nocFromMOEF"
    },
    {
      label: t("NOC_FROM_FIRE_SAFETY"),
      selectorKey: "nocFromFairSafetyFile",
      fileName: "nocFromFairSafety"
    },
    {
      label: t("AFFIDAVIT_OF_NO_UNAUTHORIZED"),
      selectorKey: "affidavitNoUnauthorizedFile",
      fileName: "affidavitNoUnauthorized"
    },
    {
      label: t("ACCESS_PERMISSION_FROM_NHAI"),
      selectorKey: "accessPermissionFromNHAIFile",
      fileName: "accessPermissionFromNHAI"
    }
  ]

  useEffect(() => {
    if (params.get('id')) {
      getCompletionCertificate();
    }
  }, [])

  const getCompletionCertificate = async () => {
    try {
      const reqBody = {
        "RequestInfo": {
          "apiId": "Rainmaker",
          "msgId": "1669293303096|en_IN",
          "authToken": token,
          "userInfo": userInfo
        }
      }

      const Resp = await axios.post(`/tl-services/certicifate/_get?applicationNumber=${params.get('id')}`, reqBody)


      if (Resp?.data?.completionCertificate?.length) {
        const details = Resp.data?.completionCertificate[0]
        setCompletionCertificate(details);

        let temp = {
          "id": "2a6e129d-cc39-41a4-9d81-b91b8c9bc5cc",
          "licenseNumber": "123456",
          "applicationNumber": "TCP_CC_20230419_000461",
          "workFlowCode": "COMPLETION_CERTIFICATE",
          "licenseValidTill": "yes",
          "edcIdcBgValid": null,
          "statusOfComplainsIfAny": "rgergergergergerge",
          "statusOfTotalComunity": "rgergergergergergerge",
          "statusOfNplPlot": "rgergergergeger",
          "statusOfHandlingOver": "gergergergergergergerg",
          "statusOfReadingHandlingOver": "ergergergergergerg",
          "handlingOverComunitySite": "ergergergergerg",
          "isDraft": "0",
          "isCompleteProfileLessThen": 0,
          "caCertificate": "e37e192b-810c-4aaf-a14c-6daaae1589b1",
          "iacAplicable": "2.2",
          "statusOfComplainsForRules": "yes",
          "statusOfEDCisFullyPaid": "yes",
          "statusOfSIDCisFullyPaid": "yes",
          "bgOnAccountTillValid": "yes",
          "paymentType": 1,
          "applicationStatus": 1,
          "paidAmount": null,
          "isFullPaymentDone": false,
          "totalCompletionCertificateCharge": null,
          "createdDate": 1681916898468,
          "copyApprovalServicePlan": "e4977118-6c32-4484-899a-87fb56b5cd57",
          "electricServicePlan": "5c013863-3a9c-4abc-b52e-98ff4286d711",
          "transferOfLicenseCertificate": "cfff1987-94a3-480f-9176-a378c31a2915",
          "occupationCertificate": "3384a7b5-e5b7-42f2-99f0-eaaceadcba2c",
          "updatedComplianceWithRules": "555c5d55-897a-4182-af7f-df66f8f30967",
          "paymentAugmentationCharges": "c9d1e8dd-d373-4806-a318-838d69ae5a80",
          "caCertificateRegarding15Percentage": "no",
          "statusOfDevelopmentWork": "0471dfc8-6722-4222-bf14-6f24f57e13a9",
          "completionApprovalLayoutPlan": "209b69b4-75b7-4bb4-81e8-91366bec1d2c",
          "nocFromMOEF": "4d1fe912-a29d-457f-8609-decd4159f4ba",
          "nocFromFairSafety": "357e9c19-aad4-4d44-a5d8-c49eebffe4f8",
          "complianceOfRules": null,
          "affidavitNoUnauthorized": "4bf38e9f-36bd-4e04-8cad-29227a39d11b",
          "complainsDetails": null,
          "accessPermissionFromNHAI": "78dc6473-86af-4256-88ab-0fe59864f924",
          "tranactionId": null,
          "auditDetails": {
            "createdBy": "697ea677-243f-4c09-a25b-707d740119c1",
            "lastModifiedBy": "bf50c235-0c49-4a15-8bcb-fa70c41b00fc",
            "createdTime": 1681897098171,
            "lastModifiedTime": 1683196252887
          },
          "createdTime": 0,
          "newAdditionalDetails": {
            "tehsil": "regerge",
            "district": "rgergerg"
          },
          "tcpApplicationNumber": null,
          "tcpCaseNumber": null,
          "tcpDairyNumber": null
        }

        setValue("licenceNo", details?.licenseNumber);
        setValue("licenseValidTill", details?.licenseValidTill);
        setValue("statusOfComplainsIfAny", details?.statusOfComplainsIfAny);
        setValue("complianceOfRules", details?.complianceOfRules);
        setValue("complainsDetails", details?.complainsDetails);
        setValue("statusOfComplainsIfAny", details?.statusOfComplainsIfAny);
        setValue("statusOfTotalComunity", details?.statusOfTotalComunity);
        setValue("statusOfNplPlot", details?.statusOfNplPlot);
        setValue("statusOfHandlingOver", details?.statusOfHandlingOver);
        setValue("statusOfReadingHandlingOver", details?.statusOfReadingHandlingOver);
        setValue("handlingOverComunitySite", details?.handlingOverComunitySite);
        setValue("caCertificate", details?.caCertificate);
        setValue("iacAplicable", details?.iacAplicable);
        setValue("statusOfComplainsForRules", details?.statusOfComplainsForRules);
        setValue("statusOfEDCisFullyPaid", details?.statusOfEDCisFullyPaid);
        setValue("statusOfSIDCisFullyPaid", details?.statusOfSIDCisFullyPaid);
        setValue("bgOnAccountTillValid", details?.bgOnAccountTillValid);
        setValue("copyApprovalServicePlan", details?.copyApprovalServicePlan);
        setValue("electricServicePlan", details?.electricServicePlan);
        setValue("transferOfLicenseCertificate", details?.transferOfLicenseCertificate);
        setValue("occupationCertificate", details?.occupationCertificate);
        setValue("updatedComplianceWithRules", details?.updatedComplianceWithRules);
        setValue("paymentAugmentationCharges", details?.paymentAugmentationCharges);
        setValue("caCertificateRegarding15Percentage", details?.caCertificateRegarding15Percentage);
        setValue("statusOfDevelopmentWork", details?.statusOfDevelopmentWork);
        setValue("completionApprovalLayoutPlan", details?.completionApprovalLayoutPlan);
        setValue("nocFromMOEF", details?.nocFromMOEF);
        setValue("nocFromFairSafety", details?.nocFromFairSafety);
        setValue("affidavitNoUnauthorized", details?.affidavitNoUnauthorized);
        setValue("accessPermissionFromNHAI", details?.accessPermissionFromNHAI);


        setValue("areaAcres", details?.newAdditionalDetails?.areaAcres);
        setValue("colonizerName", details?.newAdditionalDetails?.colonizerName);
        setValue("colonyType", details?.newAdditionalDetails?.colonyType);
        setValue("developmentPlan", details?.newAdditionalDetails?.developmentPlan);
        setValue("district", details?.newAdditionalDetails?.district);
        setValue("periodOfRenewal", details?.newAdditionalDetails?.periodOfRenewal);
        setValue("renewalRequiredUpto", details?.newAdditionalDetails?.renewalRequiredUpto);
        setValue("revenueEstate", details?.newAdditionalDetails?.revenueEstate);
        setValue("sectorNo", details?.newAdditionalDetails?.sectorNo);
        setValue("selectLicence", details?.newAdditionalDetails?.selectLicence);
        setValue("tehsil", details?.newAdditionalDetails?.tehsil);
        setValue("validUpto", details?.newAdditionalDetails?.validUpto);


      } else {
        setShowToastError({ label: Resp?.data?.message, error: true, success: false });
      }

    } catch (error) {
      console.log("GET COMPLETION CERTIFICATION ERROR ====> ", error?.message)
    }
  }


  const updateCompletionCertificate = async (data) => {
    try {

      const requestBody = {
        "RequestInfo": {
          "apiId": "Rainmaker",
          "ver": null,
          "ts": null,
          "action": null,
          "did": null,
          "key": null,
          "msgId": "1669293303096|en_IN",
          "authToken": token,
          "correlationId": null,
          "userInfo": userInfo
        },
        completionCertificate: [
          {
            ...completionCertificateDetails,
            ...data
          }
        ]
      }

      const Resp = await axios.post("/tl-services/certicifate/_update", requestBody);

      setLoader(false);

      if (Resp?.data?.completionCertificate?.length) {
        setShowToastError({ label: "Completion Certificate Updated Successfully", error: false, success: true });

        setSuccessDialog(true);
        setApplicationNumber(Resp?.data?.completionCertificate?.[0]?.applicationNumber || "");
      } else {
        setShowToastError({ label: Resp?.data?.message, error: true, success: false });
      }

      // setApplicationNumber(Resp.data.completionCertificate.applicationNumber);
    } catch (error) {
      console.log("Submit Error ====> ", error.message);
      setLoader(false);
      setShowToastError({ label: error.message, error: true, success: false });
    }
  }


  const handleClose = () => {
    setSuccessDialog(false);
    window.location.href = `/digit-ui/citizen/tl/CompletionLic/my-application`;
  };


  const uploadFile = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ label: "Duplicate File", error: true, success: false });
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
      // setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      // if (fieldName === "uploadBg") {
      //   setValue("uploadBgFileName", file.name);
      // }
      // if (fieldName === "tcpSubmissionReceived") {
      //   setValue("tcpSubmissionReceivedFileName", file.name);
      // }
      setSelectedFiles([...selectedFiles, file.name]);
      // console.log("Submit Error ====> ", err.message);

      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
    } catch (error) {
      console.log("Submit Error ====> ", error.message);
      setLoader(false);
      setShowToastError({ label: error.message, error: true, success: false });
    }
  };

  const completionLic = async (data) => {

    try {
      const requestBody = {
        "RequestInfo": {
          "apiId": "Rainmaker",
          "ver": null,
          "ts": null,
          "action": null,
          "did": null,
          "key": null,
          "msgId": "1669293303096|en_IN",
          "authToken": token,
          "correlationId": null,
          "userInfo": userInfo
        },
        "completionCertificate": [
          {
            ...data,
            licenseNumber: datalicenceNo,
            newAdditionalDetails: {
              selectLicence: data?.selectLicence,
              validUpto: data?.validUpto,
              renewalRequiredUpto: data?.renewalRequiredUpto,
              colonizerName: data?.colonizerName,
              periodOfRenewal: data?.periodOfRenewal,
              colonyType: data?.colonyType,
              areaAcres: data?.areaAcres,
              sectorNo: data?.sectorNo,
              revenueEstate: data?.revenueEstate,
              developmentPlan: data?.developmentPlan,
              tehsil: data?.tehsil,
              district: data?.district
            }
          }
        ]
      }
      const Resp = await axios.post('/tl-services/certicifate/_create', requestBody);
      setLoader(false);

      if (Resp?.data?.completionCertificate?.length) {
        setShowToastError({ label: "Completion Certificate Created Successfully", error: false, success: true });

        setSuccessDialog(true);
        setApplicationNumber(Resp?.data?.completionCertificate?.[0]?.applicationNumber || "");
      } else {
        setShowToastError({ label: Resp?.data?.message, error: true, success: false });
      }

      // setApplicationNumber(Resp.data.completionCertificate.applicationNumber);
    } catch (error) {
      console.log("Submit Error ====> ", error.message);
      setLoader(false);
      setShowToastError({ label: error.message, error: true, success: false });
    }

  };

  const handleSubmitCompletion = (data) => {
    if (params.get("id")) {
      updateCompletionCertificate(data);
    } else {
      completionLic(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitCompletion)}>


      {loader && <Spinner />}

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

      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Completion Certificate In Licence Colony</h4>
        <div className="card">
          <div className="col-12 p-3">
            <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} />
          </div>
          <div className="row px-3" style={{ placeItems: "end", rowGap: "10px" }}>

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('IS_LICENSE_NO_VALID_TILL_COMPLETION_CERTIFICATE')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("licenseValidTill", {
                  required: "This field can not be blank",
                  minLength: {
                    value: 2,
                    message: "Invalid Value"
                  },
                  maxLength: {
                    value: 3,
                    message: "Invalid Value"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.licenseValidTill) && errors?.licenseValidTill?.message}
              </h3>
            </div>

            {/* <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('DEPOSIT_APPLICABLE')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("iacAplicable", {
                  required: "This field cannot be blank",
                  pattern: {
                    value: /^[0-9]+(\.[0-9]+)?$/,
                    message: "Invalid Value."
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.iacAplicable) && errors?.iacAplicable?.message}
              </h3>
            </div> */}

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('COMPLIANCE_STATUS_WITH_RULES')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfComplainsForRules", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 2,
                    message: "Invalid Value"
                  },
                  maxLength: {
                    value: 3,
                    message: "Invalid Value"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfComplainsForRules) && errors?.statusOfComplainsForRules?.message}
              </h3>
            </div>

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('STATUS_OF_EDC')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfEDCisFullyPaid", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 2,
                    message: "Invalid Value"
                  },
                  maxLength: {
                    value: 3,
                    message: "Invalid Value"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfEDCisFullyPaid) && errors?.statusOfEDCisFullyPaid?.message}
              </h3>
            </div>

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('STATUS_OF_SIDC')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfSIDCisFullyPaid", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 2,
                    message: "Invalid Value"
                  },
                  maxLength: {
                    value: 3,
                    message: "Invalid Value"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfSIDCisFullyPaid) && errors?.statusOfSIDCisFullyPaid?.message}
              </h3>
            </div>


            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('BANK_GUARANTEE_ON_ACCOUNT_OF_IDW')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("bgOnAccountTillValid", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 2,
                    message: "Invalid Value"
                  },
                  maxLength: {
                    value: 3,
                    message: "Invalid Value"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.bgOnAccountTillValid) && errors?.bgOnAccountTillValid?.message}
              </h3>
            </div>

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('STATUS_OF_COMPLAINT')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfComplainsIfAny", {
                  minLength: {
                    value: 10,
                    message: "Its must be within 10-100 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Its must be within 10-100 characters"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfComplainsIfAny) && errors?.statusOfComplainsIfAny?.message}
              </h3>
            </div>

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('STATUS_OF_TOTAL_COMMUNITY')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfTotalComunity", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 10,
                    message: "Its must be within 10-100 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Its must be within 10-100 characters"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfTotalComunity) && errors?.statusOfTotalComunity?.message}
              </h3>
            </div>


            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('STATUS_OF_NPNL_PLOTS')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfNplPlot", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 10,
                    message: "Its must be within 10-100 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Its must be within 10-100 characters"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfNplPlot) && errors?.statusOfNplPlot?.message}
              </h3>
            </div>

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('STATUS_OF_HANDLING_OVER_EWS_PLOTS')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfHandlingOver", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 10,
                    message: "Its must be within 10-100 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Its must be within 10-100 characters"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfHandlingOver) && errors?.statusOfHandlingOver?.message}
              </h3>
            </div>


            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('STATUS_REGARDING_HANDLING_OVER_OF_PARK')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("statusOfReadingHandlingOver", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 10,
                    message: "Its must be within 10-100 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Its must be within 10-100 characters"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.statusOfReadingHandlingOver) && errors?.statusOfReadingHandlingOver?.message}
              </h3>
            </div>

            <div className="col-4">
              <FormControl class="w-100">
                <h2 class="mb-2">
                  {t('HANDING_OVER_COMMUNITY')}  <span style={{ color: "red" }}>*</span>
                </h2>

                <input className="form-control" placeholder="" {...register("handlingOverComunitySite", {
                  required: "This field cannot be blank",
                  minLength: {
                    value: 10,
                    message: "Its must be within 10-100 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Its must be within 10-100 characters"
                  }
                })} />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {Boolean(errors?.handlingOverComunitySite) && errors?.handlingOverComunitySite?.message}
              </h3>
            </div>

          </div>
          <br />
          <div className="row px-3">
            <div className="col col-12 ">
              <h6>
                {`${t("IF_PROFIT_COMPONENT_IS_LESS_THAN_15%")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                <label htmlFor="caCertificateRegarding15Percentage">
                  <input
                    type="radio"
                    value="yes"
                    label="Yes"
                    name="areaFallingUnder"
                    id="areaFallingUnder"
                    {...register("caCertificateRegarding15Percentage", {
                      required: "Please Select (Yes/No)",
                    })}
                  // onChange={(e) => handleselects(e)}
                  />
                  &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                </label>
                <label htmlFor="caCertificateRegarding15Percentage">
                  <input
                    type="radio"
                    value="no"
                    label="No"
                    name="caCertificateRegarding15Percentage"
                    id="caCertificateRegarding15Percentage"
                    {...register("caCertificateRegarding15Percentage", {
                      required: "Please Select (Yes/No)",
                    })}
                  // onChange={(e) => handleselects(e)}
                  />
                  &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                </label>
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.caCertificateRegarding15Percentage && errors?.caCertificateRegarding15Percentage?.message}
                </h3>
              </h6>
            </div>

            {
              watch('caCertificateRegarding15Percentage') && (
                <div className="col-4">
                  <FormControl class="w-100">
                    <h2 class="mb-2">
                      {t('DEPOSIT_APPLICABLE')}  <span style={{ color: "red" }}>*</span>
                    </h2>

                    <input className="form-control" placeholder="" {...register("iacAplicable", {
                      required: "This field cannot be blank",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]+)?$/,
                        message: "Invalid Value."
                      }
                    })} />
                  </FormControl>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {Boolean(errors?.iacAplicable) && errors?.iacAplicable?.message}
                  </h3>
                </div>

              )
            }

          </div>

          <br></br>

          <div className="table table-bordered table-responsive">
            {/* <caption>List of users</caption> */}
            <thead>
              <tr>
                <th class="fw-normal">Sr.No</th>
                <th class="fw-normal">Field Name</th>
                <th class="fw-normal">Upload Documents</th>
              </tr>
            </thead>
            <tbody>


              {documents.map((item, index) => (
                <tr key={index}>
                  <th class="fw-normal">{index + 1}</th>
                  <td>{item.label}</td>

                  {watch(item.fileName) ? (
                    <td>
                      <div className="d-flex justify-content-center">
                        <label title="Upload Document" for={item.selectorKey}>
                          {" "}
                          <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                        </label>
                        <input
                          id={item.selectorKey}
                          type="file"
                          placeholder=""
                          className="form-control d-none"
                          onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                        ></input>

                        {watch(item.fileName) && (
                          <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                            <Visibility color="info" className="icon" />
                          </a>
                        )}
                      </div>
                    </td>
                  ) : (
                    <td>
                      <div className="d-flex justify-content-center">
                        <label title="Upload Document" for={item.selectorKey}>
                          {" "}
                          <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                        </label>
                        <input
                          id={item.selectorKey}
                          type="file"
                          placeholder=""
                          className="form-control d-none"
                          {...register(item.selectorKey, { required: "This Document is required" })}
                          onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                        ></input>

                        {watch(item.fileName) && (
                          <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm "></a>
                        )}
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.[item.selectorKey] && errors?.[item.selectorKey]?.message}
                      </h3>
                    </td>
                  )}
                </tr>
              ))}


              <tr>
                <th class="fw-normal">15</th>
                <td>{t('DETAILS_OF_COMPLAINT')}</td>

                {watch("complainsDetails") ? (
                  <td>
                    <div className="d-flex justify-content-center">
                      <label title="Upload Document" for={"complainsDetailsFile"}>
                        {" "}
                        <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={"complainsDetailsFile"} />
                      </label>
                      <input
                        id={"complainsDetailsFile"}
                        type="file"
                        placeholder=""
                        className="form-control d-none"
                        onChange={(e) => uploadFile(e.target.files[0], "complainsDetails")}
                      ></input>

                      {watch("complainsDetails") && (
                        <a onClick={() => getDocShareholding(watch("complainsDetails"), setLoader)} className="btn btn-sm ">
                          <Visibility color="info" className="icon" />
                        </a>
                      )}
                    </div>
                  </td>
                ) : (
                  <td>
                    <div className="d-flex justify-content-center">
                      <label title="Upload Document" for={"complainsDetailsFile"}>
                        {" "}
                        <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={"complainsDetailsFile"} />
                      </label>
                      <input
                        id={"complainsDetailsFile"}
                        type="file"
                        placeholder=""
                        className="form-control d-none"
                        {...register("complainsDetailsFile")}
                        onChange={(e) => uploadFile(e.target.files[0], "complainsDetails")}
                      ></input>

                      {watch("complainsDetails") && (
                        <a onClick={() => getDocShareholding(watch("complainsDetails"), setLoader)} className="btn btn-sm "></a>
                      )}
                    </div>

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.["complainsDetailsFile"] && errors?.["complainsDetailsFile"]?.message}
                    </h3>
                  </td>
                )}
              </tr>


              <tr>
                <th class="fw-normal">16</th>
                <td>{t('UPLOAD_COMPLIANCE_OF_RULES')}</td>

                {watch("complianceOfRules") ? (
                  <td>
                    <div className="d-flex justify-content-center">
                      <label title="Upload Document" for={"complianceOfRulesFile"}>
                        {" "}
                        <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={"complianceOfRulesFile"} />
                      </label>
                      <input
                        id={"complianceOfRulesFile"}
                        type="file"
                        placeholder=""
                        className="form-control d-none"
                        onChange={(e) => uploadFile(e.target.files[0], "complianceOfRules")}
                      ></input>

                      {watch("complianceOfRules") && (
                        <a onClick={() => getDocShareholding(watch("complianceOfRules"), setLoader)} className="btn btn-sm ">
                          <Visibility color="info" className="icon" />
                        </a>
                      )}
                    </div>
                  </td>
                ) : (
                  <td>
                    <div className="d-flex justify-content-center">
                      <label title="Upload Document" for={"complianceOfRulesFile"}>
                        {" "}
                        <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={"complianceOfRulesFile"} />
                      </label>
                      <input
                        id={"complianceOfRulesFile"}
                        type="file"
                        placeholder=""
                        className="form-control d-none"
                        {...register("complianceOfRulesFile")}
                        onChange={(e) => uploadFile(e.target.files[0], "complianceOfRules")}
                      ></input>

                      {watch("complianceOfRules") && (
                        <a onClick={() => getDocShareholding(watch("complianceOfRules"), setLoader)} className="btn btn-sm "></a>
                      )}
                    </div>

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.["complianceOfRulesFile"] && errors?.["complianceOfRulesFile"]?.message}
                    </h3>
                  </td>
                )}
              </tr>


            </tbody>
          </div>

          <div class="col-sm-12 text-right">
            {/* <Button variant="contained" class="btn btn-primary btn-md center-block" aria-label="right-end">
              Save as Draft{" "}
            </Button>
            &nbsp; */}
            <button id="btnSearch" type="submit" class="btn btn-primary btn-md center-block" style={{}}>
              Submit
            </button>
          </div>
        </div>
      </div>


      <Dialog open={successDialog} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Change In Beneficial Interest Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your Completion Certificate is submitted successfully{" "}
              <span>
                <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
              </span>
            </p>
            <p>
              Please Note down your Application Number <span style={{ padding: "5px", color: "blue" }}>{applicationNumber}</span> for further
              assistance
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

    </form>
  );
}

export default CompletionLic;
