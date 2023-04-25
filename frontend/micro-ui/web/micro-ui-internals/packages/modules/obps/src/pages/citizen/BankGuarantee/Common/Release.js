import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import axios from "axios";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
// import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect"

function ReleaseNew(props) {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
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
    getValues,
    watch,
  } = useForm({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchExistingBg, setSearchExistingBg] = useState({});

  const bankRelease = async (data) => {
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};

    try {
      const postDistrict = {
        NewBankGuaranteeRequest: [
          {
            action: "APPLY_FOR_RELEASE",
            comment: "test comment",
            assignee: null,

            // validity: data?.validity,
            ...searchExistingBg,
            ...data,
            status: "APPROVED",
          },
        ],
        RequestInfo: {
          apiId: "Rainmaker",
          action: "_create",
          did: 1,
          key: "",
          msgId: "20170310130900|en_IN",
          ts: 0,
          ver: ".01",
          authToken: token,
          userInfo: userInfo,
        },
      };
      const Resp = await axios.post("/tl-services/bank/guarantee/_update", postDistrict);
      console.log("Release", Resp);
      setSubmissionSearch(UserData);
    } catch (error) {
      console.log(error.message);
    }
  };
  const existingBgFormSubmitHandler = async () => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "_create",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        ts: 0,
        ver: ".01",
        authToken: token,
      },
    };
    try {
      const Resp = await axios.post(`/tl-services/bank/guarantee/_search?bgNumber=${getValues("bgNumber")}`, payload);

      console.log("service", Resp.data.newBankGuaranteeList[0]);
      setSearchExistingBg(Resp.data.newBankGuaranteeList[1]);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    existingBgFormSubmitHandler();
  }, []);
  const [fileStoreId, setFileStoreId] = useState({});
  const getDocumentData = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    // setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      if (fieldName === "uploadBg") {
        setValue("uploadBgFileName", file.name);
      }
      if (fieldName === "fullCertificate") {
        setValue("fullCertificateFileName", file.name);
      }
      if (fieldName === "partialCertificate") {
        setValue("partialCertificateFileName", file.name);
      }
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  return (
    <form onSubmit={handleSubmit(bankRelease)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Release of Bank Guarantee</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">Bank Guarantee No. </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Bank Guarantee Issue date </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Expiry date </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Claim expiry date </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Amount </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
            </div>
            <br></br>
            <div className="row-12">
                  <div className="col col-12">
                  <FormControl>
                <h2 className="FormLable">Amount in words</h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
            </div>
            </div>
            <br></br>
              <div className="row-12">
             <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">Release </h2>
                <select
                    className="Inputcontrol"
                    class="form-control"
                    placeholder=""
                    {...register("typeOfBg")}
                    // disabled={existingBgNumber?.length > 0 ? true : false}
                  >
                    <option value="Complete"> Complete</option>
                    <option value="Partial">Partial</option>
                    <option value="Replace">Replace</option>
                  </select>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Bank Guarantee to be replaced with </h2>
               <select
                    className="Inputcontrol"
                    class="form-control"
                    placeholder=""
                    {...register("typeOfBg")}
                    // disabled={existingBgNumber?.length > 0 ? true : false}
                  >
                    <option value="BG-1"> BG-1</option>
                    <option value="BG-2">BG-2</option>
                    <option value="BG-N">BG-N</option>
                  </select>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Reason for replacement </h2>
               <textarea className="Inputcontrol" class="form-control" placeholder="" {...register("bgNumber")} />
              </FormControl>
            </div>
            </div>
           
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
 <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">Sr. No.</th>
                            <th class="fw-normal">Type</th>
                            <th class="fw-normal">Attachment description</th>
                             <th class="fw-normal"></th>
                              <th class="fw-normal">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                             <td>Application (pdf)</td>
                              <td><input type="text" className="form-control"></input></td>
                               <td><input type="file" className="form-control"></input></td>
                               <td></td>
                          </tr>
                           <tr>
                            <td>2</td>
                             <td>Completion Certificate (pdf)</td>
                              <td><input type="text" className="form-control"></input></td>
                               <td><input type="file" className="form-control"></input></td>
                               <td></td>
                          </tr>
                           <tr>
                            <td>3</td>
                             <td>Any other document (pdf)</td>
                              <td><input type="text" className="form-control"></input></td>
                               <td><input type="file" className="form-control"></input></td>
                               <td></td>
                          </tr>
                        </tbody>
                        </div>
           
            <div class="row-12" className="align-right">
              <div className="col-4">
                <Button variant="contained" class="btn btn-primary btn-md center-block">
                  Cancel
                </Button>
                &nbsp;
                <Button variant="contained" type="submit" class="btn btn-primary btn-md center-block">
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

export default ReleaseNew;
