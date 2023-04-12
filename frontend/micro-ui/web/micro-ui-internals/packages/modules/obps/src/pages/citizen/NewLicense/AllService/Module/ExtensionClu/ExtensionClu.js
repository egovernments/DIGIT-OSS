import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import { FormHelperText } from "@mui/material";
import { Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import Spinner from "../../../../../../components/Loader";
import CusToaster from "../../../../../../components/Toaster";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

function ExtensionClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues
  } = useForm({});
  const [loader, setLoading] = useState(false);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const {t} = useTranslation();
  const {pathname:url} = useLocation();
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const extensionClu = (data) => console.log(data);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  

  const getData = async () => {
    setLoading(true);
    try {
      let body = {
        "requestInfo": {
          "api_id": "Rainmaker",
          "ver": "1",
          "ts": 0,
          "action": "_search",
          "did": "",
          "key": "",
          "msg_id": "090909",
          "requesterId": "",
          "authToken": authToken,
          "userInfo": userInfo
        }
      };
      const response = await axios.post(`/tl-services/v1/_search?tcpCaseNumber=${getValues('caseNo')}`, body)
      const details = response?.data?.Licenses?.[0];
      console.log("CLU response ====> ", response, details);
      setValue('applicationNo', details?.applicationNumber);
      setValue('naturePurpose', details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.purpose);
      setValue('totalAreaSq', details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.totalArea);
      // setValue('cluDate',details?.applicationNumber);
      // setValue('expiryClu',details?.applicationNumber);
      setValue('applicantName', details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.name);
      setValue('mobile', details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.mobileNumber);
      setValue('emailAddress', details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.emailId);
      setLoading(false);

    } catch (err) {
      setLoading(false);

    }
  }


  const uploadFile = async (file, fieldName) => {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoading(false);
    try {
      setLoading(true);
      const Resp = await axios.post("/filestore/v1/files", formData, {}).then((response) => {
        return response;
      });
      setLoading(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });

      setValue(fieldName + "fileUrl", Resp?.data?.files?.[0]?.fileStoreId);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error?.response?.data?.Errors?.[0]?.description);
    }
  };

  return (
    <form onSubmit={handleSubmit(extensionClu)}>

      {
        loader && <Spinner />
      }

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
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>
        {`${t("EXTENSION_CLU_PERMISSION")}`}</h4>
        <div className="card">
          <Row className="col-12">
            <Form.Group className="col-4" as={Col} controlId="formGridCase">
              <Form.Label>
                <h2>
                {`${t("CASE_NO")}`}<span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input className="form-control" placeholder="" {...register("caseNo", {
                required: "This field can not be blank",
                minLength: {
                  value: 7,
                  message: "Invalid Case No."
                },
                maxLength: {
                  value: 12,
                  message: "Invalid Case No."
                }
              })} onBlur={getData} />
              <FormHelperText error={Boolean(errors?.caseNo)}>
                {errors?.caseNo?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  {`${t("APPLICATION_NUMBER")}`} <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input className="form-control" placeholder="" {...register("applicationNo", {
                minLength: {
                  value: 2,
                  message: "Invalid Application Number"
                },
                maxLength: {
                  value: 20,
                  message: "Invalid Application Number"
                }
              })} />
              <FormHelperText error={Boolean(errors?.applicationNo)}>
                {errors?.applicationNo?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("NATURE_PURPOSE")}`} <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("naturePurpose", {
                required: "This field cannot be blank",
                minLength: {
                  value: 2,
                  message: "Invalid Nature (land Use) Purpose."
                }, maxLength: {
                  value: 50,
                  message: "Invalid Nature (land Use) Purpose."
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Nature (land Use) Purpose."
                }
              })} />
              <FormHelperText error={Boolean(errors?.naturePurpose)}>
                {errors?.naturePurpose?.message}
              </FormHelperText>
            </Form.Group>
            {/* </Row>
              <Row className="col-12"> */}
            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("TOTAL_AREA_IN_SQ_METER")}`} <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("totalAreaSq", {
                required: "This field cannot be blank",
                minLength: {
                  value: 2,
                  message: "Invalid Area in sq. meter."
                }, maxLength: {
                  value: 20,
                  message: "Invalid Area in sq. meter."
                },
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: "Invalid Area in sq. meter."
                }
              })} />
              <FormHelperText error={Boolean(errors?.totalAreaSq)}>
                {errors?.totalAreaSq?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("DATE_OF_CLU")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="date" className="form-control" placeholder="" {...register("cluDate", {
                required: "This field cannot be blank"
              })} />
              <FormHelperText error={Boolean(errors?.cluDate)}>
                {errors?.cluDate?.message}
              </FormHelperText>
            </Form.Group>
            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("DATE_OF_EXPIRY_OF_CLU")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="date" className="form-control" placeholder="" {...register("expiryClu", {
                required: "This field cannot be blank"
              })} />
              <FormHelperText error={Boolean(errors?.expiryClu)}>
                {errors?.expiryClu?.message}
              </FormHelperText>
            </Form.Group>
            {/* </Row> */}

            {/* <Row className="col-12"> */}


            {/* </Row>

              <Row className="col-12"> */}
            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("STAGE_OF_CONSTRUCTION")}`} <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("stageConstruction", {
                required: "This field cannot be blank",
                minLength: {
                  value: 2,
                  message: "Invalid Stage of Construction."
                },
                maxLength: {
                  value: 99,
                  message: "Invalid Stage of Construction."
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Stage of Construction."
                }
              })} />
              <FormHelperText error={Boolean(errors?.stageConstruction)}>
                {errors?.stageConstruction?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("NAME_OF_APPLICANT")}`}
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("applicantName", {
                required: "This field cannot be blank",
                minLength: {
                  value: 1,
                  message: "Invalid Application Name."
                },
                maxLength: {
                  value: 50,
                  message: "Invalid Application Name."
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Application Name."
                }
              })} />
              <FormHelperText error={Boolean(errors?.applicantName)}>
                {errors?.applicantName?.message}
              </FormHelperText>
            </Form.Group>
            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("MOBILE")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="tel" className="form-control" placeholder="" {...register("mobile", {
                required: "This field cannot be blank",
                minLength: {
                  value: 10,
                  message: "Invalid Mobile No."
                },
                maxLength: {
                  value: 10,
                  message: "Invalid Mobile No."
                },
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: "Invalid Mobile No."
                }
              })} />
              <FormHelperText error={Boolean(errors?.mobile)}>
                {errors?.mobile?.message}
              </FormHelperText>
            </Form.Group>
            {/* </Row>
              <Row className="col-12"> */}
            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  {`${t("EMAIL_ADDRESS")}`}<span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="email" className="form-control" placeholder="" {...register("emailAddress", {
                required: "This field cannot be blank",
                minLength: {
                  value: 1,
                  message: "Invalid Email Address"
                },
                maxLength: {
                  value: 50,
                  message: "Invalid Email Address"
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid Email Address"
                }
              })} />
              <FormHelperText error={Boolean(errors?.emailAddress)}>
                {errors?.emailAddress?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("ADDRESS")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("address", {
                required: "This field cannot be blank",
                minLength: {
                  value: 1,
                  message: "Invalid Address"
                },
                maxLength: {
                  value: 50,
                  message: "Invalid Address"
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Address"
                }
              })} />
              <FormHelperText error={Boolean(errors?.address)}>
                {errors?.address?.message}
              </FormHelperText>
            </Form.Group>
            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("VILLAGE")}`} <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("village", {
                minLength: {
                  value: 1,
                  message: "Invalid Village"
                },
                maxLength: {
                  value: 50,
                  message: "Invalid Village"
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Village"
                }
              })} />
              <FormHelperText error={Boolean(errors?.village)}>
                {errors?.village?.message}
              </FormHelperText>
            </Form.Group>
            {/* </Row>
              <Row className="col-12"> */}
            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  {`${t("TEHSIL")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("tehsil", {
                minLength: {
                  value: 1,
                  message: "Invalid Tehsil"
                },
                maxLength: {
                  value: 50,
                  message: "Invalid Tehsil"
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Tehsil"
                }
              })} />
              <FormHelperText error={Boolean(errors?.tehsil)}>
                {errors?.tehsil?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  {`${t("PIN_CODE")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("pinCode", {
                minLength: {
                  value: 6,
                  message: "Invalid Pincode"
                },
                maxLength: {
                  value: 6,
                  message: "Invalid Pincode"
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Pincode"
                }
              })} />
              <FormHelperText error={Boolean(errors?.pinCode)}>
                {errors?.pinCode?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-4" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("REASON_FOR_DELAY")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="textarea" className="form-control" placeholder="" {...register("reasonDelay", {
                required: "This field cannot be blank",
                minLength: {
                  value: 2,
                  message: "Invalid Reason for Delay"
                },
                maxLength: {
                  value: 9,
                  message: "Invalid Reason for Delay"
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: "Invalid Reason for Delay"
                }
              })} />
              <FormHelperText error={Boolean(errors?.reasonDelay)}>
                {errors?.reasonDelay?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-6" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {`${t("STATUS_OF_APPROVAL_OF_BUILDING_PLAN")}`} <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("buildingPlanApprovalStatus", {
                required: "This field cannot be blank",
                minLength: {
                  value: 2,
                  message: "Invalid Approval of Building plan."
                },
                maxLength: {
                  value: 99,
                  message: "Invalid Approval of Building plan."
                },
                pattern: {
                  value: /^[a-zA-Z]*$/,
                  message: "Invalid Approval of Building plan."
                }
              })} />
              <FormHelperText error={Boolean(errors?.buildingPlanApprovalStatus)}>
                {errors?.buildingPlanApprovalStatus?.message}
              </FormHelperText>
            </Form.Group>

            

            <Form.Group className="col-6" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("DATE_OF_APPROVAL_OF_ZONING_PLAN")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="date" className="form-control" placeholder="" {...register("zoningPlanApprovalDate", {
                required: "This field cannot be blank"
              })} />
              <FormHelperText error={Boolean(errors?.zoningPlanApprovalDate)}>
                {errors?.zoningPlanApprovalDate?.message}
              </FormHelperText>
            </Form.Group>

            <Form.Group className="col-12" as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                   {`${t("DATE_OF_SANCTION_OF_BUILDING_PLAN")}`}
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="date" className="form-control" placeholder="" {...register("dateOfSanctionBuildingPlan", {
                required: "This field cannot be blank"
              })} />
              <FormHelperText error={Boolean(errors?.dateOfSanctionBuildingPlan)}>
                {errors?.dateOfSanctionBuildingPlan?.message}
              </FormHelperText>
            </Form.Group>

            <div className="col col-12  mt-3">
              <h6>
                 {`${t("WHETHER_APPLIED_FOR_FIRST_TIME")}`}   <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                <label htmlFor="appliedFirstTime">
                  <input
                    type="radio"
                    value="yes"
                    label="Yes"
                    name="appliedFirstTime"
                    id="appliedFirstTime"
                    {...register("appliedFirstTime", {
                      required: "Please Select (Yes/No)"
                    })}
                  />
                  &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                </label>
                <label htmlFor="appliedFirstTime">
                  <input
                    type="radio"
                    value="no"
                    label="No"
                    name="appliedFirstTime"
                    id="appliedFirstTime"
                    {...register("appliedFirstTime", {
                      required: "Please Select (Yes/No)"
                    })}
                    onChange={(e) => handleselects(e)}
                  />
                  &nbsp; {`${t("NO")}`} &nbsp;&nbsp;

                </label>
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.appliedFirstTime && errors?.appliedFirstTime?.message}
                </h3>
              </h6>
            </div>

          </Row>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}> {`${t("SR_NO")}`}</th>
                <th style={{ textAlign: "center" }}> {`${t("FIELD_NAME")}`}</th>
                <th style={{ textAlign: "center" }}> {`${t("UPLOAD_DOCUMENTS")}`}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>
                   {`${t("UPLOAD_BR_III")}`}<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("uploadbrIII", {
                    required: "This Document is required"
                  })} onChange={(e) => uploadFile(e.target.files[0], "uploadbrIII")}></input>
                  <FormHelperText error={Boolean(errors?.uploadbrIII)}>
                    {errors?.uploadbrIII?.message}
                  </FormHelperText>
                </td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>
                   {`${t("UPLOAD_CLU_PERMISSION_LETTER")}`}<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("cluPermissionLetter", {
                    required: "This Document is required"
                  })} onChange={(e) => uploadFile(e.target.files[0], "cluPermissionLetter")}></input>
                  <FormHelperText error={Boolean(errors?.cluPermissionLetter)}>
                    {errors?.cluPermissionLetter?.message}
                  </FormHelperText>
                </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>
                  {" "}
                  {`${t("UPLOAD_UNDER_CONSTRUCTION_BUILDING_PHOTO")}`}{" "}<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("uploadPhotographs", {
                    required: "This Document is required"
                  })} onChange={(e) => uploadFile(e.target.files[0], "uploadPhotographs")}></input>
                  <FormHelperText error={Boolean(errors?.uploadPhotographs)}>
                    {errors?.uploadPhotographs?.message}
                  </FormHelperText>
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>
                  {" "}
                   {`${t("RECEIPT_OF_APPLICATION_IF_ANY_SUBMITTED_FOR_TAKING_CERTIFICATE")}`}<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("receiptApplication", {
                    required: "This Document is required"
                  })} onChange={(e) => uploadFile(e.target.files[0], "receiptApplication")}></input>
                  <FormHelperText error={Boolean(errors?.receiptApplication)}>
                    {errors?.receiptApplication?.message}
                  </FormHelperText>
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>
                  {" "}
                   {`${t("UPLOAD_APPROVED_BUILDING_PLAN")}`} <span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("uploadBuildingPlan", {
                    required: "This Document is required"
                  })} onChange={(e) => uploadFile(e.target.files[0], "uploadBuildingPlan")}></input>
                  <FormHelperText error={Boolean(errors?.uploadBuildingPlan)}>
                    {errors?.uploadBuildingPlan?.message}
                  </FormHelperText>
                </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>
                  {" "}
                   {`${t("INDEMNITY_BOND")}`} <span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("indemnityBond", {
                    required: "This Document is required"
                  })} onChange={(e) => uploadFile(e.target.files[0], "indemnityBond")}></input>
                  <FormHelperText error={Boolean(errors?.indemnityBond)}>
                    {errors?.indemnityBond?.message}
                  </FormHelperText>
                </td>
              </tr>
            </tbody>
          </div>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ExtensionClu;
