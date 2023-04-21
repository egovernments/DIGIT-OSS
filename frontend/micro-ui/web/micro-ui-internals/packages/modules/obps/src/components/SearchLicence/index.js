import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
// import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import ReactMultiSelect from "../../../../../react-components/src/atoms/ReactMultiSelect";

const SearchLicenceComp = ({ watch, register, control, setLoader, errors, setValue, resetField }) => {
  const [showField, setShowField] = useState({ select: false, other: false });
  const [licenceData, setLicenceData] = useState([]);

  const getLicenceDetails = async () => {
    setLoader(true);
    const data = {
      Flag: 1,
      SearchParam: watch("licenceNo"),
    };
    try {
      const Resp = await axios.post("/api/cis/GetLicenceDetails", data);
      const filteredData = Resp?.data
        .filter((item) => item.Text.includes(" of "))
        .map((item) => {
          return { label: item.Text.split(" |")[0], value: item };
        });
      console.log("lllll====", filteredData);
      setShowField({ select: true, other: false });
      const setLicData = filteredData?.map(function (data) {
        return { value: data?.value?.Text, label: data?.label };
      });
      setLicenceData(setLicData);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  const setTextValues = (val) => {
    setShowField({ select: true, other: true });
    setValue("district", val.value?.split("|")?.[3]);
    setValue("colonyType", val.value?.split("|")?.[4]);
    setValue("colonizerName", val.value?.split("|")?.[5]);
    setValue("developmentPlan", val.value?.split("|")?.[6]);
    setValue("sectorNo", val.value?.split("|")?.[7]);
    setValue("areaAcres", val.value?.split("|")?.[9]);
  };

  return (
    <div>
      <div className="row gy-3">
        <div className="col col-3">
          <h2>
            Licence No.<span style={{ color: "red" }}>*</span>
          </h2>
          <div style={{ display: "flex", placeItems: "center" }}>
            <input
              type="text"
              className="form-control"
              placeholder="LC_XXXXX"
              {...register("licenceNo")}
              onChange={() => {
                console.log("here");
                setShowField({ select: false, other: false });
                resetField("selectLicence");
              }}
            />
            <div
              style={{
                background: "#024f9d",
                color: "white",
                borderRadius: "5px",
                padding: " 5px 15px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
              onClick={getLicenceDetails}
            >
              Go
            </div>
          </div>
          <h3 className="error-message" style={{ color: "red" }}>
            {errors?.licenceNo && errors?.licenceNo?.message}
          </h3>
        </div>

        {showField?.select && (
          <div className="col col-3 ">
            <h2>
              Select Licence<span style={{ color: "red" }}>*</span>
            </h2>
            <ReactMultiSelect
              control={control}
              name="selectLicence"
              placeholder="Select Licence"
              data={licenceData}
              onChange={(e) => setTextValues(e)}
              labels=""
            />
          </div>
        )}
      </div>

      {showField.other && (
        <div className="row gy-3 mt-3">
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Valid Upto <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="date" className="form-control" placeholder="" {...register("validUpto")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.validUpto && errors?.validUpto?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Renewal required upto <span style={{ color: "red" }}>*</span>
              </h2>
              <input
                type="date"
                {...register("renewalRequiredUpto")}
                className="form-control"
                onChange={(e) => {
                  const dateA = new Date(e?.target?.value);
                  const dateB = new Date(watch("validUpto"));

                  const monthDiff = dateA.getMonth() - dateB.getMonth();
                  const yearDiff = dateA.getYear() - dateB.getYear();

                  const diff = monthDiff + yearDiff * 12;
                  setValue("renewalRequiredUpto", diff);
                  console.log("value", e?.target?.value, diff);
                }}
              />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.renewalRequiredUpto && errors?.renewalRequiredUpto?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>Period of renewal(In Months)</h2>
              <input type="text" {...register("renewalRequiredUpto")} className="form-control" disabled />
            </FormControl>
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Name of Colonizer <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("colonizerName")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonizerName && errors?.colonizerName?.message}
            </h3>
          </div>
        </div>
      )}

      {showField.other && (
        <div className="row gy-3 mt-3">
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Type of Colony
                <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("colonyType")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonyType && errors?.colonyType?.message}
            </h3>
          </div>

          <div className="col col-3 ">
            <FormControl>
              <h2>
                Area in Acres
                <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("areaAcres")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.areaAcres && errors?.areaAcres?.message}
            </h3>
          </div>

          <div className="col col-3 ">
            <FormControl>
              <h2>
                Sector No. <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("sectorNo")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.sectorNo && errors?.sectorNo?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>Revenue estate</h2>

              <input type="text" className="form-control" placeholder="" {...register("revenueEstate")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.revenueEstate && errors?.revenueEstate?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            Development Plan
            <input type="text" className="form-control" placeholder="" {...register("developmentPlan")} />
            {/* auto pull land schedule table from new licence here */}
          </div>
        </div>
      )}

      <div className="row gy-3 mt-3">
        <div className="col col-3 ">
          <FormControl>
            <h2>Tehsil</h2>
            <input type="text" className="form-control" placeholder="" {...register("tehsil")} />
          </FormControl>
        </div>
        <div className="col col-3 ">
          <FormControl>
            <h2>District</h2>
            <input type="text" className="form-control" placeholder="" {...register("district")} />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default SearchLicenceComp;
