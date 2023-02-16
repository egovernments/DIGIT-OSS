import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

const ZoningPlan = () => {
  const { register, handleSubmit } = useForm();
  const handleRegistration = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(handleRegistration)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of demarcation cum zoning plan in CLU</h4>
        <div className="card">
          <br></br>
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
                  Case Number . <span style={{ color: "red" }}>*</span>
                </h2>{" "}
                <OutlinedInput type="number" className="Inputcontrol" {...register("caseNumber")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Layout Plan <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="text" className="Inputcontrol" {...register("layoutPlan")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  Any other Document <span style={{ color: "red" }}>*</span>
                </h2>
                <input type="file" className="form-control" {...register("anyOtherDocument")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Amount <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" name="Amount" className="Inputcontrol" {...register("amount")} />
              </FormControl>
            </div>
          </div>
          <div class="col-sm-12 text-right">
            <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit" aria-label="right-end">
              Pay{" "}
            </Button>
            &nbsp;
            <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default ZoningPlan;
