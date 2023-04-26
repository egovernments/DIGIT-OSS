import { Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Spinner from "../../../components/Loader";
import axios from "axios";
import ReactMultiSelect from "../../../../../../react-components/src/atoms/ReactMultiSelect"
import { useForm, useFieldArray } from "react-hook-form";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchLicenceComp from "../../../../../obps/src/components/SearchLicence";
const selectTypeData = [
  { label: "Application No.", value: "Appplication No." },
  {label: "Licence No.", value: "Licence No."},
  { label: "LOI No.", value: "LOI No."}];

  const selectData = [
  { label: "A-No.", value: "A-No." },
  {label: "Lc-No.", value: "Lc-No."},
  { label: "LOI-No.", value: "LOI-No."}];

const BGApplications = ({ view }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const {
    watch,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    
  });
   const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const userInfo = Digit.UserService.getUser()?.info || {};
  const getApplications = async () => {
    setLoader(true);
    const token = window?.localStorage?.getItem("token");
    const data = {
      RequestInfo: {
        apiId: "Rainmaker",
        authToken: token,
        msgId: "1672136660039|en_IN",
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/v1/_search", data);
      setLoader(false);
      setData(Resp?.data);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <div>
     
      <form>
         <div className="card1" style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-left">
              Bank Guarantee-Request for Release
            </h4>
                  <div className="card" style={{ width: "95%", marginRight:"-58px",paddingRight:"32px",paddingLeft:"16px",paddingTop:"16px",marginTop:"20px",marginBottom:"20px" }}>
                          <div className="row gy-3">
                            <div className="col col-4">
                              <h2 className="FormLable">
                                Select<span style={{ color: "red" }}>*</span>
                              </h2>
                              <ReactMultiSelect control={control} name="numberType" placeholder="Select" data={selectTypeData} labels="" />
                            </div>

                            {/* <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} /> */}

                            <div className="col col-4">
                              <h2 className="FormLable">
                              Select <span style={{ color: "red" }}>*</span>
                              </h2>
                              <ReactMultiSelect control={control} name="allservices" placeholder="Select" data={selectData} labels="" />
                            </div>

                          <div style={{ textAlignLast: "right", marginTop: "-41px" }}>
                            <button
                              type="button"
                              style={{ width: "79px", marginRight: "196px" }}
                              className="btn btn-primary"
                            >
                              Search
                            </button>
                          </div>
                          </div>
<br></br>
 <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - Basic Info's
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
           <div className="card">
                          <div className="row gy-3">
                            <div className="col col-12">
                                
                             <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} />
                            </div>
                          </div>
                          </div>
                          </div>
                          </Collapse>
                             <br></br>
                   <div
        className="collapse-header"
        onClick={() => setOpen3(!open3)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - BG Detail
        </span>
        {open3 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      
         <div
        className="collapse-header"
        onClick={() => setOpen4(!open4)}
        aria-controls="example-collapse-text"
        aria-expanded={open4}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - 
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
       <Collapse in={open4}>
       <div className="card-body">
          <div className="table-bd">
                                      < div className="row" style={{ placeItems: "center" }}> 
                         <h2 style={{ marginLeft: "3px" }} className="text-left">
                          Expiry in days:
                          </h2>
        <div className="col col-2">
                        <label>Bank Guarantee No</label>
                        <input type="text" className="form-control"  />
                      </div>
                       <div className="col col-3">
                        <label>Bank Guarantee Issue date</label>
                        <input type="date" className="form-control"  />
                      </div>
                       <div className="col col-2">
                        <label>Expiry date</label>
                        <input type="date" className="form-control"  />
                      </div>
                       <div className="col col-2">
                        <label>Claim expiry date</label>
                        <input type="date" className="form-control"  />
                      </div>
                      <div className="col col-2">
                        <label>Amount</label>
                        <input type="text" className="form-control"  />
                      </div>
                       <br></br>
                        <div className="row gy-3">
                        <div className="col col-6">
                           <h2 className="FormLable">
                               Amount in words<span style={{ color: "red" }}>*</span>
                              </h2>
                              <input type="text" className="form-control" disabled></input>
                        </div>
                <div class="col-sm-6 text-right">
                  <button type="submit"  class="btn btn-primary btn-md center-block">
                    <a href="/digit-ui/citizen/obps/release">Release</a>
                  
                  </button>
                </div>
                <div class="col-sm-6 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-143px", marginRight: "-458px" }}>
                     <a href="/digit-ui/citizen/obps/renew">Extension</a>
                  </button>
                </div>
                        </div>
                       
   </div>
   </div>
       </div>
       </Collapse>
        </div>
        </div>
        </form>
       
    </div>
    
  );
};
export default BGApplications;
