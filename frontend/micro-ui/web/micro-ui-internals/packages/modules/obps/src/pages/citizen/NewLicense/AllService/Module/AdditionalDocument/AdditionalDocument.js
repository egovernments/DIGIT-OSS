import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getDocShareholding } from "../../../docView/docView.help";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CusToaster from "../../../../../../components/Toaster";
import Spinner from "../../../../../../components/Loader";
import { useHistory } from "react-router-dom";
import SearchLicenceComp from "../../../../../../components/SearchLicence";

const selectTypeData = [{ label: "test", value: "test" }];

const AdditionalDocument = () => {
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const additionalDoc = (data) => {
    console.log("data", data);
  };

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(additionalDoc)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
            Additional Documents
          </h4>
          <div className="card">
            <div className="row gy-3">
              <div className="col col-5">
                <h2 className="FormLable">
                  Select Application No, LOI No, Licence No <span style={{ color: "red" }}>*</span>
                </h2>
                <ReactMultiSelect control={control} name="numberType" placeholder="Select Type" data={selectTypeData} labels="" />
              </div>

              <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} />

              <div className="col col-4">
                <h2 className="FormLable">
                  List all services <span style={{ color: "red" }}>*</span>
                </h2>
                <ReactMultiSelect control={control} name="allservices" placeholder="Select Service" data={selectTypeData} labels="" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "right", marginTop: "20px" }}>
              <button
                style={{
                  background: "#024f9d",
                  color: "white",
                  borderRadius: "5px",
                  padding: " 5px 15px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  width: "200px",
                }}
                type="submit"
                id="btnSearch"
                class=""
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AdditionalDocument;
