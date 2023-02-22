import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

function TransferLicense() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const transferLic = (data) => console.log(data);

  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };

  return (
    <form onSubmit={handleSubmit(transferLic)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
          Transfer of License
        </h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  Licence No . <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" {...register("licenseNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Select Type (Complete or Partial) <span style={{ color: "red" }}>*</span>
                </h2>
                <select className="Inputcontrol" class="form-control" {...register("selectType")} onChange={(e) => handleshowhide(e)}>
                  <option value=" 6">----Select value-----</option>
                  <option value="1">Complete</option>
                  <option value="2">Partial</option>
                </select>
              </FormControl>
              <div>
                {showhide === "5" ||
                  (showhide === "2" && (
                    <div className="row-12">
                      <div className="col col-4 ">
                        <h2 className="FormLable">
                          Area in Acres <span style={{ color: "red" }}>*</span>
                        </h2>
                        <input type="number" placeholder="" className="form-control" {...register("araeInAcres")} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <fieldset>
            <div className="row-12">
              <div className="col col-12 ">
                <h6>
                  Do you want to apply for Change of Developer <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  <label htmlFor="formHorizontalRadios">
                    <input
                      {...register("formHorizontalRadios")}
                      type="radio"
                      label="Yes"
                      name="formHorizontalRadios"
                      id="formHorizontalRadios1"
                      value="4"
                      onChange={(e) => handleshowhide(e)}
                    />
                    &nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="formHorizontalRadios">
                    <input
                      {...register("formHorizontalRadios")}
                      type="radio"
                      label="No"
                      name="formHorizontalRadios"
                      id="formHorizontalRadios2"
                      value="5"
                      onChange={(e) => handleshowhide(e)}
                    />
                    &nbsp; No &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.formHorizontalRadios && errors?.formHorizontalRadios?.message}
                  </h3>
                </h6>
              </div>
              {/* <h2 className="FormLable">
                Do you want to apply for Change of Developer
                <span style={{ color: "red" }}>*</span>
              </h2>
              <div className="row-12">
                <div className="col-md-1">
                  <input
                    type="radio"
                    label="Yes"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios1"
                    value="4"
                    {...register("formHorizontalRadios")}
                    onChange={(e) => handleshowhide(e)}
                  />
                </div>
                <div className="col-md-1">
                  <input
                    type="radio"
                    label="No"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                    {...register("formHorizontalRadios")}
                    value="5"
                    onChange={(e) => handleshowhide(e)}
                  />
                </div>
              </div> */}
            </div>
          </fieldset>
          <div className="row-12">
            <div>
              {showhide === "1" ||
                (showhide === "4" && (
                  <div className="card">
                    <div class="bordere">
                      <div class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">Sr.No</th>
                              <th scope="col">Field Name</th>
                              <th scope="col">Upload Documents</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th class="fw-normal">1</th>
                              <td>
                                Undertaking regarding the creation of 3rd party right on the licensed area
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("undertakingThirdParty")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">2</th>
                              <td>
                                {" "}
                                The colonizer seeking transfer of whole license/part license shall submit self-certification along with a certificate
                                of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time of submission
                                of application for transfer of license <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("colonizerSeeking")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">3</th>
                              <td>
                                {" "}
                                A consent letter from the ‘new entity for the proposed change along with justification
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("consentLetter")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">4</th>
                              <td>
                                {" "}
                                Board resolution of authorized signatory <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("boardResolution")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">5</th>
                              <td>
                                No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated
                                for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the
                                proposed change/assignment.
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("objectionCertificate")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">6</th>
                              <td>
                                Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                                ‘shareholder(s)’ as per prescribed policy parameters for grant of a license l<span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("technicalFinancialCapacity")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">7</th>
                              <td>
                                An undertaking to pay the balance administrative charges before final approval <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("undertakingBalance")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">8</th>
                              <td>
                                Justification for request
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("justificationRequest")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">9</th>
                              <td>
                                An undertaking to the effect that in case the administrative charges for such cases are fixed in act and rules at a
                                rate higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded by TCP
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("administrativeCharges")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">10</th>
                              <td>
                                The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to
                                have been created in the colony, an affidavit to the said effect be also submitted by the existing developer
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("statusRegarding")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">11</th>
                              <td>
                                {" "}
                                Status regarding registration of project in RERA
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("registrationStatus")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">12</th>
                              <td>
                                {" "}
                                Any Other Document <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("otherDocument")}></input>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div>
              {showhide === "1" ||
                (showhide === "5" && (
                  <div className="card">
                    <div class="bordere">
                      <div class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">Sr.No</th>
                              <th scope="col">Field Name</th>
                              <th scope="col">Upload Documents</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th class="fw-normal">1</th>
                              <td>
                                Undertaking regarding the creation of 3rd party right on the licensed area
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("creationThirdParty")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">2</th>
                              <td>
                                {" "}
                                The colonizer seeking transfer of whole license/part license shall submit self-certification along with a certificate
                                of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time of submission
                                of application for transfer of license <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("colonizerSeekingTransfer")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">3</th>
                              <td>
                                A consent letter from the ‘new entity for the proposed change along with justification
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("consentLetterNewEntity")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">4</th>
                              <td>
                                Board resolution of authorized signatory
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("boardResolutionSignatory")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">5</th>
                              <td>
                                Status regarding registration of project in RERA
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("statusRegistration")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">6</th>
                              <td>
                                Any Other Document
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("documentOther")}></input>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div>
              {showhide === "2" ||
                (showhide === "4" && (
                  <div className="card">
                    <div class="bordere">
                      <div class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">Sr.No</th>
                              <th scope="col">Field Name</th>
                              <th scope="col">Upload Documents</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th class="fw-normal">1</th>
                              <td>
                                Undertaking regarding the creation of 3rd party right on the licensed area
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("thirdPartyLicensedArea")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">2</th>
                              <td>
                                A consent letter from the ‘new entity for the proposed change along with justification
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("newEntityChange")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">3</th>
                              <td>
                                {" "}
                                Board resolution of authorized signatory<span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("authorizedSignatory")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">4</th>
                              <td>
                                No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated
                                for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the
                                proposed change/assignment.
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("noObjection")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">5</th>
                              <td>
                                Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                                ‘shareholder(s)’ as per prescribed policy parameters for grant of a license
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("documentsTechnicalFianncial")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">6</th>
                              <td>
                                An undertaking to pay the balance administrative charges before final approval
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("undertakingPay")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">7</th>
                              <td>
                                A consent letter from the ‘new entity for the proposed change along with justification
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("justificationChange")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">8</th>
                              <td>
                                Justification for request
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("requestJustification")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">9</th>
                              <td>
                                An undertaking to the effect that in case the administrative charges for such cases are fixed in act and rules at a
                                rate higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded by TCP
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("administrativeChargesCases")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">10</th>
                              <td>
                                {" "}
                                Status regarding registration of project in RERA
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("registrationRera")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">11</th>
                              <td>
                                {" "}
                                Any Other Document <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("document")}></input>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div>
              {showhide === "2" ||
                (showhide === "5" && (
                  <div className="card">
                    <div class="bordere">
                      <div class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">Sr.No</th>
                              <th scope="col">Field Name</th>
                              <th scope="col">Upload Documents</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th class="fw-normal">1</th>
                              <td>
                                Undertaking regarding the creation of 3rd party right on the licensed area
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("craetionLicensedArea")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">2</th>
                              <td>
                                A consent letter from the ‘new entity for the proposed change along with justification
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("justificationEntity")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">3</th>
                              <td>
                                Board resolution of authorized signatory
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("resolutionBoardSignatory")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">4</th>
                              <td>
                                Status regarding registration of project in RERA
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("registrationProjectRera")}></input>
                              </td>
                            </tr>
                            <tr>
                              <th class="fw-normal">5</th>
                              <td>
                                Any Other Document
                                <span style={{ color: "red" }}>*</span>
                              </td>
                              <td>
                                <input type="file" placeholder="" className="form-control" {...register("anyOtherDoc")}></input>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
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

export default TransferLicense;
