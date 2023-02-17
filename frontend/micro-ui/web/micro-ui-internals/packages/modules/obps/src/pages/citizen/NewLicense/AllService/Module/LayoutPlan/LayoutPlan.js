import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

function LayoutPlanClu() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const { register, handleSubmit } = useForm();
  const layoutPlan = (data) => console.log(data);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };

  return (
    <form onSubmit={handleSubmit(layoutPlan)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</h4>
        <div className="card">
          {" "}
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  License No . <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" placeholder="" className="Inputcontrol" {...register("licenseNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Existing Area <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="text" placeholder="" className="Inputcontrol" {...register("existingArea")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Area of which planning is being changed <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="text" placeholder="" className="Inputcontrol" {...register("areaPlanning")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  Any other feature
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <div className="row-12">
                  <div className="col md={4} xxl lg-3">
                    <input
                      type="radio"
                      value="true"
                      label="Yes"
                      name="anyOtherFeature"
                      id="anyOtherFeature"
                      {...register(" anyOtherFeature")}
                      onChange={(e) => handleselects(e)}
                    />

                    <input
                      type="radio"
                      value="false"
                      label="No"
                      name="c"
                      id="anyOtherFeature"
                      {...register("anyOtherFeature")}
                      onChange={(e) => handleselects(e)}
                    />
                  </div>
                </div>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Amount <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="text" required={true} disabled={true} placeholder="" className="Inputcontrol" {...register("amount")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit">
                  Pay
                </Button>
              </FormControl>
            </div>
          </div>
          <div className=" col-12 m-auto">
            <div className="card">
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Sr.No</th>
                    <th style={{ textAlign: "center" }}>Field Name</th>
                    <th style={{ textAlign: "center" }}>Upload Documents</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>
                      Reasons for revision in the layout plan <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" placeholder="" className="form-control" {...register("reasonRevision")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>
                      {" "}
                      Copy of earlier approved layout plan <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" placeholder="" className="form-control" {...register("earlierApprovedlayoutPlan")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      Any Other <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" placeholder="" className="form-control" {...register("anyOther")}></input>
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>

            <div class="col-sm-12 text-right">
              <Button variant="contained" class="btn btn-primary btn-md center-block" aria-label="right-end">
                Save as Draft{" "}
              </Button>
              &nbsp;
              <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LayoutPlanClu;
