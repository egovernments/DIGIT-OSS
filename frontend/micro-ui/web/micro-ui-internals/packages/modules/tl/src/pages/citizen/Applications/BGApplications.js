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
  { label: "Application No.", value: "1" },
  {label: "Licence No.", value: "2"},
  { label: "LOI No.", value: "3"}];

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
  const [bgType,setBgType] = useState([]);
  // const[applicationNo,setApplicationNo] = useState();
  const[licenceNo,setLicenseNo]=useState();
  const[loiAppLicNo,setLoiAppLicNo]=useState("");
  const [showField, setShowField] = useState({ select: false, other: false });
   const [licenceData, setLicenceData] = useState([]);
  const {
   watch, register, control,errors, setValue, 
    getValues,resetField, apiData, comp, getData
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
 
  const handleLoiNumber = async (e) => {
    const token = window?.localStorage?.getItem("token");
 
    try {
      const loiRequest = {
          api_id: "Rainmaker",
          msg_id: "1669293303096|en_IN",
          authToken: token,
          userInfo: userInfo,
          active: true,
          tenantId: "hr",
          permanentCity: null
        };
      const Resp = await axios.post(`/tl-services/bank/guarantee/dropdonelist?type=${loiAppLicNo}`, loiRequest);
      // console.log ("RESp",Resp.data,Resp.data.map(item => ({
      //   ...item,value:item.id
      // })))
      setBgType(Resp.data.map(item => ({
        ...item,value:item.id
      })))
    } catch (error) {
      console.log(error);
    }

   
  };
    function handleonChangeApplication(data){
              //  console.log("ApNo",data)
              setLoiAppLicNo(data.value)
    }

    useEffect(()=>{
            if(loiAppLicNo){
              handleLoiNumber()
            }
    },[loiAppLicNo])

  const [claimPeriod, setClaimPeriod] = useState("");
  const [amountInWords, setamountWords] = useState("");
  const [amountInFig, setamountFig] = useState("");
  const [issuingBank, setIssuingBank] = useState("");
  const [bgNumber, setBgNumber] = useState("");
  const [validity, setValidity] = useState("");
    const handleApplLoiNumber = async (e) => {
    const token = window?.localStorage?.getItem("token");
    // const licenceNumber = apiData?.length ? watch("licenceNo")?.value : watch("licenceNo");
    // const loiNumber = apiData?.length ? watch("licenceNo")?.value : watch("licenceNo");
    // const applicationNumber = apiData?.length ? watch("licenceNo")?.value : watch("licenceNo");
    try {
      const loiRequest = {
         RequestInfo: {
          api_id: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key:"",
          msg_id: "090909",
          authToken: token,
          userInfo: userInfo
        },};
        console.log ("RESp",watch("applicationNumber"))
        // const queryParam = new 
      const Resp = await axios.post(`/tl-services/bank/guarantee/_search?${watch("numberType").value === "1"? "applicationNumber="+watch("applicationNumber")?.label : ""}${watch("numberType").value === "3"? "loiNumber="+watch("applicationNumber")?.label : ""}${watch("numberType").value === "2"? "licenceNumber="+watch("applicationNumber")?.label : ""}`, loiRequest);
      

      setClaimPeriod(Resp?.data?.newBankGuaranteeList?.[0]?.claimPeriod);
      setBgNumber(Resp?.data?.newBankGuaranteeList?.[0]?.bgNumber);
      setIssuingBank(Resp?.data?.newBankGuaranteeList?.[0]?.issuingBank);
      setamountFig(Resp?.data?.newBankGuaranteeList?.[0]?.amountInFig);
      setamountWords(Resp?.data?.newBankGuaranteeList?.[0]?.amountInWords);
      setValidity(Resp?.data?.newBankGuaranteeList?.[0]?.validity);
     
     
    } catch (error) {
      console.log(error);
    }

   
  };
     
  console.log("DATADFFG",selectTypeData , loiAppLicNo , bgType);

    useEffect(()=>{
           setValue("applicationNumber",{})
    },[watch("numberType")])

  return (
    <div>
     
      <form>
         <div className="card1" style={{ width: "100%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-left">{`${t("MY_APPLICATION_BG_REQUEST_FOR_RELEASE")}`}
              {/* Bank Guarantee-Request for Release */}
            </h4>
                  <div className="card" style={{ width: "95%", marginRight:"-58px",paddingRight:"32px",paddingLeft:"16px",paddingTop:"16px",marginTop:"20px",marginBottom:"20px" }}>
                          <div className="row gy-3">
                            <div className="col col-4">
                              <h2 className="FormLable">{`${t("MY_APPLICATION_BG_SELECT")}`}
                                {/* Select */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>
                              
                              <ReactMultiSelect control={control} name="numberType" placeholder="Select" data={selectTypeData} labels="" value={loiAppLicNo} onChange={handleonChangeApplication}/>
                              
                            </div>

                            {/* <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} /> */}

                            <div className="col col-4">
                              <h2 className="FormLable">
                                
                              {`${t("MY_APPLICATION_BG_SELECT")}`} <span style={{ color: "red" }}>*</span>
                              </h2>
                              
                                <ReactMultiSelect control={control} name="applicationNumber" placeholder="Select" data={bgType} labels="" />
                           
                            </div>

                          <div style={{ textAlignLast: "right", marginTop: "-41px" }}>
                            <button
                              type="button"
                              style={{ width: "79px", marginRight: "196px" }}
                              className="btn btn-primary" onClick={() => {
                                  handleApplLoiNumber();
                                }}  
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
                         <h2 style={{ marginLeft: "3px" }} className="text-left">{`${t("MY_APPLICATION_BG_EXPIRY_IN_DAYS")}`}
                          {/* Expiry in days: */}
                          </h2>
        <div className="col col-2">
                        <label>{`${t("MY_APPLICATION_BG_GUARANTEE_NO")}`}
                        {/* Bank Guarantee No */}
                        </label>
                        <input type="text" className="form-control" {...register("bgNumber")} value={bgNumber} disabled/>
                      </div>
                       <div className="col col-3">
                        <label>{`${t("MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE")}`}
                        {/* Bank Guarantee Issue date */}
                        </label>
                        <input type="text" className="form-control" {...register("issuingBank")} value={issuingBank} disabled/>
                      </div>
                       <div className="col col-2">
                        <label>{`${t("BG_SUBMIT_EXPIRY_DATE")}`}</label>
                        <input type="text" className="form-control" {...register("validity")} value={validity} disabled/>
                      </div>
                       <div className="col col-2">
                        <label>{`${t("MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE")}`}
                        {/* Claim expiry date */}
                        </label>
                        <input type="text" className="form-control"  {...register("claimPeriod")} value={claimPeriod} disabled/>
                      </div>
                      <div className="col col-2">
                        <label>{`${t("MY_APPLICATION_BG_GUARANTEE_AMOUNT")}`}</label>
                        <input type="text" className="form-control"  {...register("amountInFig")} value={amountInFig} disabled/>
                      </div>
                       <br></br>
                        <div className="row gy-3">
                        <div className="col col-6">
                           <h2 className="FormLable">
                              {`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}<span style={{ color: "red" }}>*</span>
                              </h2>
                              <input type="text" className="form-control" disabled {...register("amountInWords")} value={amountInWords}></input>
                        </div>
                <div class="col-sm-6 text-right">
                  <button type="submit"  class="btn btn-primary btn-md center-block">
                    <a href="/digit-ui/citizen/obps/release">{`${t("MY_APPLICATION_BG_RELEASE")}`}</a>
                  
                  </button>
                </div>
                <div class="col-sm-6 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-143px", marginRight: "-458px" }}>
                     <a href="/digit-ui/citizen/obps/renew">{`${t("MY_APPLICATION_BG_EXTENSION")}`}</a>
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
