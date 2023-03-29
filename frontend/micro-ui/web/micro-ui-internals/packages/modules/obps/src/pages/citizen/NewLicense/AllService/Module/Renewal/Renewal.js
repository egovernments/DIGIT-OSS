import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Button } from "@material-ui/core";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";

const RenewalFor = [
  { label: "Year", value: "year" },
  { label: "Month", value: "month" },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function renewalClu() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({});

  const renewal = (data) => console.log(data);
  const [modal, setmodal] = useState(false);
  return (
    <form onSubmit={handleSubmit(renewal)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Renewal</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2>
                  License No.<span style={{ color: "red" }}>*</span>
                </h2>

                <input type="number" className="form-control" placeholder="" {...register("licenseNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2>
                  {" "}
                  Valid Upto <span style={{ color: "red" }}>*</span>
                </h2>

                <input type="date" className="form-control" placeholder="" {...register("validUpto")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2>
                  Renewal For <span style={{ color: "red" }}>*</span>
                </h2>

                <ReactMultiSelect control={control} name="selectService" placeholder="Renewal For" data={RenewalFor} labels="Far" />

                {/* <select className="Inputcontrol" class="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">Year</option>
                  <option value="2">Month</option>
                </select> */}
              </FormControl>{" "}
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2>
                  {" "}
                  Name of Colonizer <span style={{ color: "red" }}>*</span>
                </h2>

                <input type="text" className="form-control" placeholder="" {...register("colonizerName")} />
              </FormControl>
              {/* <Col className="col-1">
              <div>
                {showhide === "1" && (
                  <div className="col-md-12 form-group">
                    <Form.Label>
                      <h2>Year</h2>
                    </Form.Label>
                    <select className="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                      <option value="1">1 Year</option>
                      <option value="2">2 Year</option>
                      <option value="1">3 Year</option>
                      <option value="2">4 Year</option>
                      <option value="1">5 Year</option>
                    </select>
                  </div>
                )}
              </div>
            </Col> */}
              {/* <Col className="col-1">
              <Form.Group as={Col} controlId="formGridArea">
                <div>
                  {showhide === "2" && (
                    <div className="col-md-12 form-group">
                      <Form.Label>
                        <h2>Months</h2>
                      </Form.Label>
                      <input type="number" className="form-control" placeholder="" {...register("areaInAcres")} />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col> */}
            </div>
            <br></br>
            <div className="row-12">
              <div className="col md={4} xxl lg-4">
                <FormControl>
                  <h2>
                    {" "}
                    Type of Colony
                    <span style={{ color: "red" }}>*</span>
                  </h2>

                  <input type="text" className="form-control" placeholder="" {...register("colonyType")} />
                </FormControl>{" "}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2>
                    {" "}
                    Area in Acres
                    <span style={{ color: "red" }}>*</span>
                  </h2>

                  <input type="text" className="form-control" placeholder="" {...register("areaAcres")} />
                </FormControl>{" "}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2>
                    {" "}
                    Sector No. <span style={{ color: "red" }}>*</span>
                  </h2>

                  <input type="text" className="form-control" placeholder="" {...register("sectorNo")} />
                </FormControl>{" "}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2>
                    {" "}
                    Village
                    <span style={{ color: "red" }}>*</span>{" "}
                  </h2>

                  <input type="text" className="form-control" placeholder="" {...register("village")} />
                </FormControl>
              </div>
              <br></br>
              <div className="row-12">
                <div className="col md={4} xxl lg-4">
                  <FormControl>
                    <h2>
                      {" "}
                      Tehsil
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <input type="text" className="form-control" placeholder="" {...register("tehsil")} />
                  </FormControl>{" "}
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <FormControl>
                    <h2>
                      {" "}
                      District <span style={{ color: "red" }}>*</span>{" "}
                    </h2>

                    <input type="text" className="form-control" placeholder="" {...register("district")} />
                  </FormControl>{" "}
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <FormControl>
                    <h2>
                      {" "}
                      Whether renewal applied within the stipulated period.
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                    <label htmlFor=" Whether renewal applied within the stipulated period.">
                      {" "}
                      &nbsp;&nbsp;
                      <input {...register("renewalApplied")} type="radio" value="1" id="yes" /> &nbsp; Yes
                    </label>{" "}
                    <label htmlFor="Whether renewal applied within the stipulated period.">
                      &nbsp;&nbsp;
                      <input {...register("renewalApplied")} type="radio" value="2" id="no" /> &nbsp; No
                    </label>
                    {watch("renewalApplied") === "2" && (
                      <div className="col md={4} xxl lg-12">
                        <h2></h2>
                        <input type="text" className="form-control" placeholder="" {...register("renewalAppliedText")} />
                      </div>
                    )}
                  </FormControl>{" "}
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <FormControl>
                    <h2>
                      {" "}
                      Renewal Amount <span style={{ color: "red" }}>*</span>{" "}
                    </h2>

                    <input type="text" className="form-control" disabled placeholder="" {...register("renewalAmount")} />
                  </FormControl>
                </div>
                <br></br>
                <div className="row-12">
                  <h2>
                    {" "}
                    Reason for not completing the project within the initial validity period of the license.
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                  <textarea className="form-control" placeholder="" {...register("completingProject")} rows="3" />
                </div>
                <br></br>
                <div className="row-12">
                  <h2>
                    {" "}
                    Reason for not completing the project within the initial validity period of the license.
                    <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                    <label htmlFor=" Whether the renewal applied is the first time ? (Yes/No)">
                      {" "}
                      &nbsp;&nbsp;
                      <input {...register("renewalAppliedFirstTime")} type="radio" value="1" id="yes" /> &nbsp; Yes
                    </label>{" "}
                    <label htmlFor="Whether the renewal applied is the first time ? (Yes/No)">
                      &nbsp;&nbsp;
                      <input {...register("renewalAppliedFirstTime")} type="radio" value="2" id="no" /> &nbsp; No
                    </label>
                  </h2>
                </div>
                {watch("renewalAppliedFirstTime") === "2" && (
                  <div className="card">
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Sr.No
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Condition
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Complaince Done
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Add more/Remove
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row" style={{ textAlign: "center" }}>
                            1
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("condition")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <label htmlFor=" complianceDone">
                              {" "}
                              &nbsp;&nbsp;
                              <input {...register("complianceDone")} type="radio" value="1" id="yes" /> &nbsp; Yes
                            </label>{" "}
                            <label htmlFor="complianceDone">
                              &nbsp;&nbsp;
                              <input {...register("complianceDone")} type="radio" value="2" id="no" /> &nbsp; No
                            </label>
                            {watch("complianceDone") === "2" && (
                              <div>
                                {/* <label>
                            <h2>Compilance</h2>
                          </label> */}
                                <input type="text" className="form-control" placeholder="" />
                                <ArrowCircleUpIcon color="primary" />
                              </div>
                            )}
                          </td>
                          <td className="text-center">
                            <AddBoxSharpIcon color="success" />
                            <IndeterminateCheckBoxSharpIcon color="error" />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                )}
                <br></br>
                <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2>
                      {" "}
                      Whether the colonizer has obtained approval/NOC from the competent authority in pursuance of MOEF notified dated 14.09.2006
                      before stating the development works.
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                    <label htmlFor=" colonizer">
                      {" "}
                      &nbsp;&nbsp;
                      <input {...register("colonizer")} type="radio" value="1" id="yes" /> &nbsp; Yes
                    </label>{" "}
                    <label htmlFor="colonizer">
                      &nbsp;&nbsp;
                      <input {...register("colonizer")} type="radio" value="2" id="no" /> &nbsp; No
                    </label>
                    {watch("colonizer") === "1" && (
                      <div className="col md={4} xxl lg-4">
                        <FormControl>
                          <h2></h2>

                          <input type="text" className="form-control" placeholder="" />
                        </FormControl>
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <h2>
                      {" "}
                      Whether the colonizer has conveyed the ultimate power load requiremet of the project to the power utility within two months from
                      the date of grant of license.
                      <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                    <label htmlFor=" colonizerUltimatePower">
                      {" "}
                      &nbsp;&nbsp;
                      <input {...register("colonizerUltimatePower")} type="radio" value="1" id="yes" /> &nbsp; Yes
                    </label>{" "}
                    <label htmlFor="colonizerUltimatePower">
                      &nbsp;&nbsp;
                      <input {...register("colonizerUltimatePower")} type="radio" value="2" id="no" /> &nbsp; No
                    </label>
                    {watch("colonizerUltimatePower") === "1" && (
                      <div className="col md={4} xxl lg-4">
                        <FormControl>
                          <h2></h2>

                          <input type="text" className="form-control" placeholder="" />
                        </FormControl>
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <h2>
                      {" "}
                      Whether colonizer has transferred portion of sector/master plans roads forming part of the licensed area free of cost to the
                      Govt. of not in compilance of condition of license.
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                    <label htmlFor=" transferredPortion">
                      {" "}
                      &nbsp;&nbsp;
                      <input {...register("transferredPortion")} type="radio" value="1" id="yes" /> &nbsp; Yes
                    </label>{" "}
                    <label htmlFor="transferredPortion">
                      &nbsp;&nbsp;
                      <input {...register("transferredPortion")} type="radio" value="2" id="no" /> &nbsp; No
                    </label>
                    {watch("transferredPortion") === "1" && (
                      <div className="row-12">
                        <div className="col md={4} xxl lg-4">
                          <FormControl>
                            <h2>Area</h2>

                            <input type="text" className="form-control" placeholder="" {...register("area")} />
                          </FormControl>
                          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                          <FormControl>
                            <h2>Khasra No</h2>

                            <input type="text" className="form-control" placeholder="" {...register("khasraNo")} />
                          </FormControl>
                          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                          <FormControl>
                            <h2>Remarks</h2>

                            <input type="text" className="form-control" placeholder="" {...register("remark")} />
                          </FormControl>
                          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                          <FormControl>
                            <h2>Upload copy of mutation</h2>

                            <input type="file" className="form-control" placeholder="" {...register("uploadmutation")} />
                          </FormControl>
                        </div>
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <h2>
                      {" "}
                      Compilance with special conditions, if imposed in the license and agrrements.
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                    <label htmlFor=" compilanceLicense">
                      {" "}
                      &nbsp;&nbsp;
                      <input {...register("compilanceLicense")} type="radio" value="1" id="yes" /> &nbsp; Yes
                    </label>{" "}
                    <label htmlFor="compilanceLicense">
                      &nbsp;&nbsp;
                      <input {...register("compilanceLicense")} type="radio" value="2" id="no" /> &nbsp; No
                    </label>
                    {watch("compilanceLicense") === "1" && (
                      <div className="col md={4} xxl lg-4">
                        <FormControl>
                          <h2></h2>
                          <input type="text" className="form-control" placeholder="" {...register("compilanceLicenseText")} />
                        </FormControl>
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <h2>
                      {" "}
                      Complaints/court cases pending if any.
                      <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                    <label htmlFor=" courtCases">
                      {" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input {...register("courtCases")} type="radio" value="1" id="yes" /> &nbsp; Yes
                    </label>{" "}
                    <label htmlFor="courtCases">
                      &nbsp;&nbsp;
                      <input {...register("courtCases")} type="radio" value="2" id="no" /> &nbsp; No
                    </label>
                    {watch("courtCases") === "1" && (
                      <div className="col md={4} xxl lg-4">
                        <FormControl>
                          <h2></h2>

                          <input type="text" className="form-control" placeholder="" />
                        </FormControl>
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <h2 style={{ marginleft: "20px" }}>
                      {" "}
                      EDC
                      <span style={{ color: "red" }}>*</span>
                      <label htmlFor=" edc">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("edc")} type="radio" value="1" id="yes" /> &nbsp; Fully Paid
                      </label>{" "}
                      <label htmlFor="edc">
                        &nbsp;&nbsp;
                        <input {...register("edc")} type="radio" value="2" id="no" /> &nbsp; Outstanding
                      </label>
                    </h2>
                    {watch("edc") === "2" && (
                      <div className="card">
                        <div className="table table-bordered table-responsive">
                          <thead>
                            <tr>
                              <th colSpan="6" className="fw-normal" style={{ textAlign: "center" }}>
                                Outstanding Dues
                              </th>
                            </tr>
                            <tr>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Head
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Principal
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Interest
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Penal interest
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Total
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Remark
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Remaining EDC
                              </th>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("principal")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("interest")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("penalInterest")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("total")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("edcRemark")} />
                              </td>
                            </tr>
                            <tr>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Under OTS
                              </th>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("principal")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("interest")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("penalInterest")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("total")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("otsRemark")} />
                              </td>
                            </tr>
                          </tbody>
                        </div>
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <h2>
                      {" "}
                      SIDC
                      <span style={{ color: "red" }}>*</span>{" "}
                      <label htmlFor=" sidc">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("sidc")} type="radio" value="1" id="yes" /> &nbsp; Fully Paid
                      </label>{" "}
                      <label htmlFor="sidc">
                        &nbsp;&nbsp;
                        <input {...register("sidc")} type="radio" value="2" id="no" /> &nbsp; Outstanding
                      </label>
                    </h2>
                    {watch("sidc") === "2" && (
                      <div className="card">
                        <div className="table table-bordered table-responsive">
                          <thead>
                            <tr>
                              <th colSpan="6" className="fw-normal" style={{ textAlign: "center" }}>
                                Outstanding Dues
                              </th>
                            </tr>
                            <tr>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Head
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Principal
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Interest
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Penal interest
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Total
                              </th>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Remark
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="fw-normal" style={{ textAlign: "center" }}>
                                Remaining SIDC
                              </th>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("principal")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("interest")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("penalInterest")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("total")} />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input type="text" className="form-control" placeholder="" {...register("sidcRemark")} />
                              </td>
                            </tr>
                          </tbody>
                        </div>
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <h2>
                      {" "}
                      Enhance EDC
                      <span style={{ color: "red" }}>*</span>{" "}
                      <label htmlFor=" enhanceEdc">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("enhanceEdc")} type="radio" value="1" id="yes" /> &nbsp; Fully Paid
                      </label>{" "}
                      <label htmlFor="enhanceEdc">
                        &nbsp;&nbsp;
                        <input {...register("enhanceEdc")} type="radio" value="2" id="no" /> &nbsp; Outstanding
                      </label>
                    </h2>
                    {watch("enhanceEdc") === "2" && (
                      <div className="row-12">
                        <div className="col md={4} xxl lg-4">
                          <FormControl>
                            <h2>
                              {" "}
                              Amount
                              <span style={{ color: "red" }}>*</span>
                            </h2>

                            <input type="text" className="form-control" placeholder="" {...register("amount")} />
                          </FormControl>
                          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                          <FormControl>
                            <h2>
                              {" "}
                              <span style={{ color: "red" }}>*</span>
                            </h2>

                            <select className="Inputcontrol" class="form-control" {...register("selectService")}>
                              <option value=" ">----Select value-----</option>
                              <option value="1">NA</option>
                              <option value="2">Under Stay</option>
                            </select>
                          </FormControl>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <br></br>
                <div>
                  <h2 style={{ marginleft: "20px" }}>
                    {" "}
                    Bank Guarantee
                    <span style={{ color: "red" }}>*</span>
                  </h2>

                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          BG.No.
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Amount
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Validity
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Bank
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Component
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("bgNo")} />
                        </th>
                        <td style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("amount")} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("validity")} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("bank")} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <select className="form-control" {...register("component")}>
                            <option value=" ">----Select value-----</option>
                            <option value="1">EDC</option>
                            <option value="2">IDW </option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("bgNo")} />
                        </th>
                        <td style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("amount")} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("validity")} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("bank")} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" {...register("componet")} />
                        </td>
                      </tr>
                    </tbody>
                  </div>
                </div>
                <br></br>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <h2>
                  {" "}
                  CA certificate regarding non collection of stamp duty and registration charges.
                  <span style={{ color: "red" }}>*</span>
                  <input type="file" className="form-control" placeholder="" {...register("cacertification")} />
                </h2>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <h2>
                  {" "}
                  Copies of advertisement for the sale of flat (Sec 24) along with register containing authenticated copies of Agreement entered
                  between colonizer.
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <label htmlFor=" advertisementCopy">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input {...register("advertisementCopy")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="advertisementCopy">
                  &nbsp;&nbsp;
                  <input {...register("advertisementCopy")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                {watch("advertisementCopy") === "1" && (
                  <div className="row-12">
                    <div className="col md={4} xxl lg-4">
                      <FormControl>
                        <h2>Remark</h2>

                        <input type="text" className="form-control" placeholder="" {...register("advertisementRemark")} />
                      </FormControl>
                    </div>
                  </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <h2>
                  {" "}
                  Annual Financial statements duly audited/certifie and signed by Chartened Accountant indicating the amount realized from each space
                  holders, the expenditure incured internal and on external development works separately of the colony /building etc. with detail
                  thereof whether with the amount due from each space holders indicating their postal addresses.
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <label htmlFor=" annualFinancial">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input {...register("annualFinancial")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="annualFinancial">
                  &nbsp;&nbsp;
                  <input {...register("annualFinancial")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                {watch("annualFinancial") === "1" && (
                  <div className="row-12">
                    <div className="col md={4} xxl lg-4">
                      <FormControl>
                        <h2>Remark</h2>

                        <input type="text" className="form-control" placeholder="" {...register("annualRemark")} />
                      </FormControl>
                    </div>
                  </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <h2>
                  {" "}
                  Detail of account number of schedule bank in which 30% of the amount released by him from the space holder deposited to meet out the
                  cost of internet developmant work of the colony.
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <label htmlFor=" detailAccountNumber">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input {...register("detailAccountNumber")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="detailAccountNumber">
                  &nbsp;&nbsp;
                  <input {...register("detailAccountNumber")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                {watch("detailAccountNumber") === "1" && (
                  <div className="row-12">
                    <div className="col md={4} xxl lg-4">
                      <FormControl>
                        <h2>Remark</h2>

                        <input type="text" className="form-control" placeholder="" {...register("detailRemark")} />
                      </FormControl>
                    </div>
                  </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <h2>
                  {" "}
                  Copies of form AC account indicating the amount released from each space holders and the amount deposited during the preceeding
                  month in the schedule Bank.
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <label htmlFor=" copiesOfCaAccount">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input {...register("copiesOfCaAccount")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="copiesOfCaAccount">
                  &nbsp;&nbsp;
                  <input {...register("copiesOfCaAccount")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                {watch("copiesOfCaAccount") === "1" && (
                  <div className="row-12">
                    <div className="col md={4} xxl lg-4">
                      <FormControl>
                        <h2>Remark</h2>

                        <input type="text" className="form-control" placeholder="" {...register("copiesRemark")} />
                      </FormControl>
                    </div>
                  </div>
                )}
                <br></br>
                <br></br>
                <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2 style={{ marginleft: "20px" }}>
                      {" "}
                      (1) Status of OC
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Sr.No.
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Date of grant of OC
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Tower
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Target date for filling DOD
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Whether DOD filled or not
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>1</h2>
                            </label>
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input type="date" className="form-control" placeholder="" {...register("date")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" readOnly placeholder="" {...register("tower")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" readOnly placeholder="" {...register("targetDate")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <label htmlFor=" dodFilled">
                              {" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <input {...register("dodFilled")} type="radio" value="1" id="yes" /> &nbsp; Yes
                            </label>{" "}
                            <label htmlFor="dodFilled">
                              &nbsp;&nbsp;
                              <input {...register("dodFilled")} type="radio" value="2" id="no" /> &nbsp; No
                            </label>
                            {watch("dodFilled") === "1" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-12">
                                  <select className="form-control" {...register("dodFiledDrop")}>
                                    <option value=" ">----Select value-----</option>
                                    <option value="1">Within Time </option>
                                    <option value="2">Delayed</option>
                                    <option value="3">NA</option>
                                  </select>
                                </div>
                              </div>
                            )}
                            {watch("dodFiledDrop") === "2" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-12">
                                  <h2>
                                    {" "}
                                    Composition
                                    <span style={{ color: "red" }}>*</span>
                                  </h2>

                                  <input type="text" placeholder="" className="form-control" readOnly {...register("composition")} />
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2 style={{ marginleft: "20px" }}>
                      {" "}
                      (2) Status of Part Completion
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Sr.No.
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Date of approval of Layout Plan
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Area in Acre
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }} colspan="2">
                            Part completion (entered granted area )
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Percent of total area
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>1</h2>
                            </label>
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input type="date" className="form-control" placeholder="" {...register("statusDate")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("areaInAcre")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("partCompletion")} />
                          </td>
                          <td>
                            <label>
                              <h2>Upload part Completion certificate</h2>
                              <ArrowCircleUpIcon style={{ textAlign: "center" }} color="primary" />
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("percentArea")} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2 style={{ marginleft: "20px" }}>
                      {" "}
                      (3) Status of Community Sites
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Sr.No.
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Type
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Area
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Building Plan
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            OC granized
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>1</h2>
                            </label>
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input type="date" className="form-control" placeholder="" {...register("type")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("area")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <label htmlFor=" buildingPlan">
                              {" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <input {...register("buildingPlan")} type="radio" value="1" id="yes" /> &nbsp; Yes
                            </label>{" "}
                            <label htmlFor="buildingPlan">
                              &nbsp;&nbsp;
                              <input {...register("buildingPlan")} type="radio" value="2" id="no" /> &nbsp; No
                            </label>
                            {watch("buildingPlan") === "1" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-12">
                                  <h2>Date</h2>

                                  <input type="date" className="form-control" placeholder="" {...register("date")} />
                                </div>
                              </div>
                            )}
                            {watch("buildingPlan") === "2" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-12">
                                  <h2>Remark</h2>

                                  <input type="text" className="form-control" placeholder="" {...register("buildingRemark")} />
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            <label htmlFor=" ocGranized">
                              {" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <input {...register("ocGranized")} type="radio" value="1" id="yes" /> &nbsp; Yes
                            </label>{" "}
                            <label htmlFor="ocGranized">
                              &nbsp;&nbsp;
                              <input {...register("ocGranized")} type="radio" value="2" id="no" onClick={handleClickOpen} /> &nbsp; No
                            </label>
                            {watch("ocGranized") === "1" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-6">
                                  <FormControl>
                                    <h2>Remark</h2>

                                    <input type="date" className="form-control" placeholder="" {...register("ocRemark")} />
                                  </FormControl>
                                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                                  <FormControl>
                                    <h2>Till Date</h2>

                                    <input type="date" className="form-control" placeholder="" {...register("tillDate")} />
                                  </FormControl>
                                </div>
                              </div>
                            )}
                            {watch("ocGranized") === "2" && (
                              <div>
                                <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                                  {/* <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                      Modal title
                    </BootstrapDialogTitle> */}
                                  <DialogContent dividers>
                                    <Typography gutterBottom>
                                      <label>
                                        <h2>Valid upto</h2>
                                      </label>
                                      <input type="date" placeholder="" className="form-control" {...register("validUpto")} />
                                      <div>
                                        <h2>If out of date then redirect to extension of Cs.</h2>
                                      </div>
                                    </Typography>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button autoFocus onClick={handleClose}>
                                      Close
                                    </Button>
                                  </DialogActions>
                                </BootstrapDialog>
                              </div>
                              // <Col className="col-12">
                              //   <Modal
                              //     size="lg"
                              //     isOpen={modal}
                              //     toggle={() => setmodal(!modal)}
                              //     style={{ width: "500px", height: "200px" }}
                              //     aria-labelledby="contained-modal-title-vcenter"
                              //     centered
                              //   >
                              //     <ModalHeader toggle={() => setmodal(!modal)}></ModalHeader>
                              //     <ModalBody style={{ fontSize: 20 }}>
                              //       <label>
                              //         <h2>Valid upto</h2>
                              //       </label>
                              //       <input type="date" placeholder="" className="form-control" />
                              //       <div>
                              //         <h2>If out of date then redirect to extension of Cs.</h2>
                              //       </div>
                              //     </ModalBody>
                              //     <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
                              //   </Modal>
                              // </Col>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <br></br>
                <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2> Total number of EWS Plots/flats approved in the Layout Plan/Building Plan. </h2>
                    <br></br>
                    <FormControl>
                      <h2>No. of Plots/flats.</h2>
                      <input type="text" className="form-control" placeholder="" {...register("noOfFlats")} />
                    </FormControl>
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <FormControl>
                      <h2> Status of allotment and possession of Plot/Flats of EWS category. </h2>
                      <label htmlFor=" allotmentStatus">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("allotmentStatus")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="allotmentStatus">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("allotmentStatus")} type="radio" value="2" id="no" /> &nbsp; No
                      </label>
                    </FormControl>
                  </div>
                </div>
                {watch("allotmentStatus") === "1" && (
                  <div className="col md={4} xxl lg-12">
                    <FormControl>
                      <h2>Plot/Flats for which possession given. </h2>

                      <select className="form-control" {...register("flatPossession")}>
                        <option value=" ">Select value</option>
                        <option value="1">Within time</option>
                        <option value="2">Delayed</option>
                        <option value="2">NA</option>
                      </select>
                    </FormControl>
                  </div>
                )}
                <br></br>
                {watch("flatPossession") === "2" && (
                  <div className="col md={4} xxl lg-12">
                    <h2>
                      Whether composition fee paid.
                      <label htmlFor=" compositionPaid">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("compositionPaid")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="compositionPaid">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("compositionPaid")} type="radio" value="2" id="no" /> &nbsp; No
                      </label>
                    </h2>
                  </div>
                )}
                {watch("compositionPaid") === "1" && (
                  <div className="col md={4} xxl lg-4">
                    <h2>Amount</h2>

                    <input type="text" placeholder="" className="form-control" {...register("compositionAmount")} />
                  </div>
                )}
                <br></br>
                <br></br>
                <div className="row-12">
                  <div className="col md={4} xxl lg-12">
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Sr.No.
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Field Name
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Upload Documents
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>1.</h2>
                            </label>
                          </th>
                          <td>
                            <label>
                              <h2>Upload the income tax clearance certifiate issued by the income tax officer.</h2>
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="file" className="form-control" placeholder="" {...register("uploadIncomeTax")} />
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>2.</h2>
                            </label>
                          </th>
                          <td>
                            <label>
                              <h2>
                                Upload an explanatory note indicating the details of development works:which have been completed or are in progress or
                                are yet to be undertaken.
                              </h2>
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="file" className="form-control" placeholder="" {...register("uploadExplanatoryNote")} />
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>3.</h2>
                            </label>
                          </th>
                          <td>
                            <label>
                              <h2>Status of dvelopment works duly signed by authorized signatory.</h2>
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="file" className="form-control" placeholder="" {...register("uploadStatusDevelopment")} />
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>4.</h2>
                            </label>
                          </th>
                          <td>
                            <label>
                              <h2>Old License for verification.</h2>
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="file" className="form-control" placeholder="" {...register("uploadOldLicence")} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <FormControl>
                      <h2>
                        {" "}
                        Amount <span style={{ color: "red" }}>*</span>
                      </h2>

                      <input type="text" className="form-control" placeholder="" readOnly {...register("oldAmount")} />
                    </FormControl>
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <FormControl>
                      <button type="submit" id="btnSearch" class="btn btn-success btn-md center-block" style={{ marginTop: "25px" }}>
                        Pay
                      </button>
                    </FormControl>
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
          </div>
        </div>
      </div>
    </form>
  );
}

export default renewalClu;
