import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

function Beneficial() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

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
  } = useForm({});

  const beneficialNew = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(beneficialNew)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>CHANGE IN BENEFICIAL INTEREST</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable"> Licence No </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("licenseno")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Select Service</h2>

                <select className="Inputcontrol" class="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">(a)Change of Developer</option>
                  <option value="2">(b) Joint Development and/or Marketing rights</option>
                  <option value="3">(c)Change in Share Holding Pattern</option>
                </select>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Amount</h2>

                <OutlinedInput type="text" className="Inputcontrol" disabled {...register("amount")} />
              </FormControl>
              <div className="col md={4} xxl lg-4">
                <div>
                  {showhide === "2" && (
                    <div>
                      <h2 className="FormLable"> Area in Acres</h2>

                      <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("areaInAcres")} />
                    </div>
                  )}
                </div>
              </div>
              <br />
              <div className="row-12">
                <div>
                  {showhide === "1" && (
                    // <div className="card">
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
                            No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for
                            the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                            change/assignmen
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("objectionCertificate")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">2</th>
                          <td> A consent letter from the ‘new entity for the proposed change </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("consentLetter")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">3</th>
                          <td> Justification for such request. </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("justification")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">4</th>
                          <td>
                            {" "}
                            The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                            been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("thirdPartyRights")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">5</th>
                          <td>
                            {" "}
                            Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                            ‘shareholder(s)’ as per prescribed policy parameters for grant of license.
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("fiancialCapacity")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">6</th>
                          <td> An undertaking to pay the balance administrative charges before final approval.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("administrativeCharges")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">7</th>
                          <td> Status of RERA registration of project of non registered,then affidavit to this effect.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("reraRegistration")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">8</th>
                          <td> Board resolution of authorised signatory of “existing developer </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolution")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">9</th>
                          <td>
                            {" "}
                            Board resolution of authorised signatory of “new entity ”<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionNewEntity")}></input>
                          </td>
                        </tr>
                      </tbody>
                    </div>
                    // </div>
                  )}
                </div>
                <div>
                  {showhide === "2" && (
                    // <div className="card">
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
                            No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for
                            the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                            change/assignment
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("noObjectionCertificate")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">2</th>
                          <td> A consent letter from the ‘new entity for the proposed change. </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("consentLetterProposedChanges")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">3</th>
                          <td> Justification for such request.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("justificationRequest")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">4</th>
                          <td>
                            {" "}
                            The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                            been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("thirdPartyclaimed")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">5</th>
                          <td> Details of the applied area where joint development and /or marketing rights are to be assigned</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("jointDevelopment")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">6</th>
                          <td> An undertaking to pay the balance administrative charges before final approval.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("balanceAministrative")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">7</th>
                          <td> Board resolution of authorised signatory of “existing developer”.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionDeveloper")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">8</th>
                          <td> Board resolution of authorised signatory of “new entity ”</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionEntity")}></input>
                          </td>
                        </tr>
                      </tbody>
                    </div>
                    // </div>
                  )}
                </div>
                <div>
                  {showhide === "3" && (
                    // <div className="card">

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
                            No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for
                            the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                            change/assignment
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("proposedAssigment")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">2</th>
                          <td> Justification for such request </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("justificationRequest")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">3</th>
                          <td>
                            {" "}
                            The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                            been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("creationThirdParty")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">4</th>
                          <td>
                            {" "}
                            Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                            ‘shareholder(s)’ as per prescribed policy parameters for grant of license
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("technicalAndFinancial")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">5</th>
                          <td> An undertaking to pay the balance administrative charges before final approval </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("administrativeChargesApproval")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">6</th>
                          <td> Proposed Shareholding Pattern of the developer company.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("shareholdingPattern")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">7</th>
                          <td> Status of RERA registration of project of non registered,then affidavit to this effect.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("statusOfRera")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">8</th>
                          <td> Board resolution of authorised signatory of “existing developer” </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionAuthorized")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">9</th>
                          <td>
                            {" "}
                            Board resolution of authorised signatory of “new entity ”<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionSignatory")}></input>
                          </td>
                        </tr>
                      </tbody>
                    </div>

                    // </div>
                  )}
                </div>
              </div>
              <div class="col-sm-12 text-right">
                <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit" aria-label="right-end">
                  Pay
                </Button>{" "}
                &nbsp;
                <Button variant="contained" class="btn btn-primary btn-md center-block" type="save" aria-label="right-end">
                  Save as Draft
                </Button>{" "}
                &nbsp;
                <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit" aria-label="right-end">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Beneficial;
