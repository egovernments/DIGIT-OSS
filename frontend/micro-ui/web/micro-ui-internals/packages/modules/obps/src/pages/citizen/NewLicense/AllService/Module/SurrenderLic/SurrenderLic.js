import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

function SurrenderLic() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const SurrenderLic = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(SurrenderLic)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
          Surrender of License
        </h4>
        <div className="card">
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  Licence No . <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" placeholder="" className="Inputcontrol" {...register("licenseNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Select Type (Complete or Partial) <span style={{ color: "red" }}>*</span>
                </h2>

                <select className="Inputcontrol" class="form-control" {...register("selectType")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">(a)Complete</option>
                  <option value="2">(b) Partial</option>
                </select>
              </FormControl>
            </div>
            <div>
              {showhide === "2" && (
                <div className="row-12">
                  <div className="col col-4 ">
                    <h2 className="FormLable">
                      Area in Acres <span style={{ color: "red" }}>*</span>
                    </h2>
                    <input type="number" placeholder="" className="form-control" {...register("araeInAcres")} />
                  </div>
                </div>
              )}
            </div>
            <div className="row-12">
              <div className="col col-12 ">
                <h6>
                  Area falling under 24m road /service road or sector dividing road (Yes/no) <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  <label htmlFor="areaFalling">
                    <input
                      type="radio"
                      value="true"
                      label="Yes"
                      name="areaFalling"
                      id="areaFalling"
                      {...register(" areaFalling")}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="areaFalling">
                    <input
                      type="radio"
                      value="false"
                      label="No"
                      name="areaFalling"
                      id="areaFalling"
                      {...register(" areaFalling")}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; No &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.areaFalling && errors?.areaFalling?.message}
                  </h3>
                </h6>
              </div>
            </div>
            <div className="row-12">
              <div className="col col-12 ">
                <h6>
                  RERA registration of project <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  <label htmlFor="areaFalling">
                    <input
                      type="radio"
                      label="Yes"
                      name="reraRegistration"
                      id="reraRegistration"
                      value="true"
                      {...register("reraRegistration")}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="areaFalling">
                    <input
                      type="radio"
                      label="No"
                      name="reraRegistration"
                      id="reraRegistration"
                      value="false"
                      {...register("reraRegistration")}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; No &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.reraRegistration && errors?.reraRegistration?.message}
                  </h3>
                </h6>
              </div>
            </div>

            <div className="row-12">
              <div>
                {showhide === "1" && (
                  //  <div className="card">
                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Sr.No
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
                        <th className="fw-normal">1</th>
                        <td>
                          Declaration of Third-Party Rights
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          {/* <input type="file" placeholder="" className="form-control" {...register("oning/LayoutPlan ")}></input> */}
                          <input type="file" placeholder="" className="form-control" {...register("thirdPartyRights")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">2</th>
                        <td>
                          {" "}
                          Declaration IDW Works Approved Scanned Copy of Zoning/Layout Plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("oningLayoutPlan ")}></input>
                          {/* <input type="file" placeholder="" className="form-control" {...register("oning/LayoutPlan ")}></input> */}
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">3</th>
                        <td>
                          {" "}
                          License Copy <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("licenseCopy ")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">4</th>
                        <td>
                          {" "}
                          EDC availed or not e.g. surrounding roads are constructed or not <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("edcaVailed ")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">5</th>
                        <td>
                          {" "}
                          Area falling under 24m road /service road or sector dividing road and green belt If yes{" "}
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <fieldset>
                            <div className="row-12">
                              <div className="col col-12 ">
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="Yes"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                    value="4"
                                    onChange={(e) => handleselects(e)}
                                  />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="No"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                    value="9"
                                    onChange={(e) => handleselects(e)}
                                  />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.reraRegistration && errors?.reraRegistration?.message}
                                </h3>
                              </div>
                            </div>
                          </fieldset>
                        </td>
                      </tr>
                    </tbody>

                    {selects === "4" && (
                      // <table class="table">
                      <tbody>
                        <tr>
                          <th className="fw-normal">6</th>
                          <td>
                            {" "}
                            Gift Deed
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" placeholder="" className="form-control" {...register("giftDeed")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal">7</th>
                          <td>
                            {" "}
                            Mutation
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" placeholder="" className="form-control" {...register("mutation")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal">8</th>
                          <td>
                            {" "}
                            Jamabandhi <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" placeholder="" className="form-control" {...register("jamabandhi")}></input>
                          </td>
                        </tr>
                      </tbody>
                      // </table>
                    )}
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
                        <th style={{ textAlign: "center" }}>Sr.No</th>
                        <th style={{ textAlign: "center" }}>Field Name</th>
                        <th style={{ textAlign: "center" }}>Upload Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="fw-normal">1</th>
                        <td>
                          Declaration of Third-Party Rights
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("partyRights")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">2</th>
                        <td>
                          {" "}
                          Declaration IDW Works <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("declarationIDWWorks")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">3</th>
                        <td>
                          {" "}
                          Revised Layout Plan (same format as uploaded at the time of license application)
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("revisedLayoutPlan")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">4</th>
                        <td>
                          {" "}
                          EDC availed or not e.g. surrounding roads are constructed or not <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("availedEdc")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">5</th>
                        <td>
                          {" "}
                          Area falling under 24m road /service road or sector dividing road <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("areaFallingUnder")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">6</th>
                        <td>
                          {" "}
                          Area falling under 24m road /service road or sector dividing road and green belt If yes{" "}
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <fieldset>
                            <div className="row-12">
                              <div className="col col-12 ">
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="Yes"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                    value="3"
                                    onChange={(e) => handleselects(e)}
                                  />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="No"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                    value="10"
                                    onChange={(e) => handleselects(e)}
                                  />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </td>
                      </tr>
                    </tbody>

                    {selects === "3" && (
                      <tbody>
                        <tr>
                          <th className="fw-normal">7</th>
                          <td>
                            {" "}
                            Gift Deed
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" placeholder="" className="form-control" {...register("deedGift")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal">8</th>
                          <td>
                            {" "}
                            Mutation.
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" placeholder="" className="form-control" {...register("mutaDoc")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal">9</th>
                          <td>
                            {" "}
                            Jamabandhi <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" placeholder="" className="form-control" {...register("jamabandhiDoc")}></input>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </div>
                  //   </div>
                  // </div>
                )}
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
    </form>
  );
}

export default SurrenderLic;
