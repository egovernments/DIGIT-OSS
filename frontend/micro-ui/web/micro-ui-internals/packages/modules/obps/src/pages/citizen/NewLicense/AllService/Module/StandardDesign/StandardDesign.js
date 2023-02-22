import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

function Standard() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const { register, handleSubmit } = useForm();
  const standardDesign = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(standardDesign)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of Standard Design</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  License No . <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" {...register("licenseNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Plan <span style={{ color: "red" }}>*</span>
                </h2>

                <input type="file" placeholder="" className="form-control" {...register("plan")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Any other Document <span style={{ color: "red" }}>*</span>
                </h2>

                <input type="file" placeholder="" className="form-control" {...register("otherDocument")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  {" "}
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

export default Standard;
