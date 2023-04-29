import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import { useTranslation } from "react-i18next";

function CompletionLic() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

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

  const completionLic = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(completionLic)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Completion Certificate In Licence Colony</h4>
        <div className="card">
          <div className="col-12 p-3">
            <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} />
          </div>
          <div className="row-12">

            <div className="col cols-4">
              <FormControl>
                <h2>
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

            <div className="col cols-4">
              <FormControl>
                <h2>
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

            <div className="col cols-4">
              <FormControl>
                <h2>
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

            <div className="col cols-4">
              <FormControl>
                <h2>
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








            {/* </div> */}

            {/* <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2
                  className="FormLable"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="The license is valid at the time of completion certificate"
                >
                  Completion Certificate
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("completionCertificate")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2
                  className="FormLable"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=" EDC and IDC be fully paid and bank guarantees on account of
                    IDW are valid."
                >
                  EDC and IDC be fully paid{" "}
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("edcFullypaid")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable"> Status of complaint if any. </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("statusOfComplaint")} />
              </FormControl>
            </div> */}
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2
                  className="FormLable"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Status of total community sites/approval of zoning/building
                    plans and occupation certificate granted."
                >
                  {" "}
                  Occupation Certificate{" "}
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("occupationCertificate")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2
                  className="FormLable"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=" Status of NPNL plots. (detail of NPNL plots and rates
                    approval for NPNL)"
                >
                  Status of NPNL plots.
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("statusNpnlPlot")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2
                  className="FormLable"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Status of handing over EWS plots to housing board/allottees"
                >
                  {" "}
                  Housing board/allottees{" "}
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("housingBoard")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2
                  className="FormLable"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=" Status regarding handing over of park/internal road/public
                    utility to the concerned authority"
                >
                  {" "}
                  Concerned Authority{" "}
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("concernedAuthority")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2
                  className="FormLable"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=" Handing over community sites to the Government agency and
                    constructed by the Government."
                >
                  Handing over community sites{" "}
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("handleCommunitySites")} />
              </FormControl>
            </div>
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
              <tr>
                <th class="fw-normal">1</th>
                <td>
                  <h2> The service plan/estimate copy of approved </h2>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("servicePlanApproved")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">2</th>
                <td>
                  {" "}
                  <h2>The electrical Service plan is approved and verification of service is laid as per the approval.</h2>{" "}
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("electricalServicePlan")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">3</th>
                <td>
                  {" "}
                  <h2>Transfer of licensed land to the Government agency falling under 18/24 mtr. Road/green belt/sector road.</h2>{" "}
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("transferLicensedLand")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">4</th>
                <td>
                  {" "}
                  <h2>Occupation certificate In case of (Group Housing, Commercial, IT Colony)</h2>{" "}
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("occupationCertificateCommercial")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">5</th>
                <td>
                  {" "}
                  <h2>Updated compliance with Rules 24, 26(2), 27 & 28.</h2>{" "}
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("updatedCompliance")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">6</th>
                <td>
                  {" "}
                  <h2>Submit a report regarding infrastructure augmentation charges.</h2>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("reportInfrastructure")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">7</th>
                <td>
                  {" "}
                  <h2>Third-party audit on 15% profitability and CA certificate regarding 15% profit.</h2>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("thirdPartyAudit")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">8</th>
                <td>
                  {" "}
                  <h2>
                    Status of development work along with site photographs and CD/DVD regarding completion of public health services, and internal
                    roads{" "}
                  </h2>{" "}
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("statusDevelopment")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">9</th>
                <td>
                  {" "}
                  <h2>Report regarding functional of internal services and connection of external services of HUDA/MC. </h2>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("functionalServices")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">10</th>
                <td>
                  {" "}
                  <h2>Affidavit of no unauthorized construction/addition/ alteration after the issuance of completion certificate.</h2>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("affidavitUnauthorized")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">11</th>
                <td>
                  {" "}
                  <h2>NOC from MOEF required.</h2>{" "}
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("nocRequired")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">12</th>
                <td>
                  {" "}
                  <h2>NOC from fire safety and certificate from structural stability.</h2>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("fireSafetyCertificate")}></input>
                </td>
              </tr>
              <tr>
                <th class="fw-normal">13</th>
                <td>
                  {" "}
                  <h2>
                    Access permission from NHAI if the site abuts with NH/Scheduled Road and status regarding construction within green belt along
                    NH/Scheduled road.
                  </h2>{" "}
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("accessPermission")}></input>
                </td>
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
    </form>
  );
}

export default CompletionLic;
