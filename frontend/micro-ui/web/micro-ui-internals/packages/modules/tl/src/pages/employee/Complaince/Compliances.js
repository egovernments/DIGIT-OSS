import React, { useState , useEffect, useContext  } from 'react';
// import AddPost from '../Material/TextEditor';
import axios from "axios";
import { useForm } from "react-hook-form";
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import { Button, Form } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import { ComplicesRemarksContext } from '../../../../context/Complices-remarks-context';

import Modalcompliances from './Modalcompliances';


const Addmoreinput = ({applicationimp}) =>
{
    const {compliceGetRemarkssValues,remarksData}=useContext(ComplicesRemarksContext)
//   const[formValues, setFormValues]= useState([{name:'', email:'', address:''}]);
  const [checked, setChecked] = useState(true);
  const {t} = useTranslation();
  const[msg, setMsg]= useState('');
  const [loader, setLoading] = useState(false);
  const dateTime = new Date();
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");

  const handleInputChange=(index, event)=>{
    let data= [...formValues];
    data[index][event.target.name]= event.target.value;
    setFormValues(data);
  }
const addFields=()=>{
    let addField= {name:'', email:'', address:''};
    setFormValues([...formValues, addField])
}

const removeFields=(index)=>{
 let data= [...formValues];
 data.splice(index,1);
 setFormValues(data);
}
const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
    resetField,
  } = useForm({ reValidateMode: "onChange", mode: "onChange" });
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = event => {
    setIsChecked(event.target.checked);

    // 👇️ this is the checkbox itself
    console.log("falsenon" , event.target);

    // 👇️ this is the checked value of the field
    console.log("truecheck" ,event.target.checked);
  };


  const tcpApplicationNumber = applicationimp?.tcpApplicationNumber
  const ApplicationNumber = applicationimp?.applicationNumber


  const submitForm = (data) => {
   
      Compliance(data);
    
  };


    const [isOpened, setIsOpened] = useState(false);
  
    function toggle() {
      setIsOpened(wasOpened => !wasOpened);
    }
    const [smShow, setSmShow] = useState(false);
    const handlemodaldData = (data) => {
    
        setSmShow(false);
        // console.log("here",openedModal,data);
        
      };
      useEffect(() => {
       
        if(tcpApplicationNumber){
          
            compliceGetRemarkssValues(tcpApplicationNumber);
        }
      }, [tcpApplicationNumber])
      useEffect(() =>{
        // console.log("remarksDataComplice",remarksData);
      }, [remarksData])


      
      const handleshow19 = async (e) => {
        const payload = {
    
            "RequestInfo": {

                "apiId": "Rainmaker",
      
                "ver": ".01",
      
                "ts": null,
      
                "action": "_update",
      
                "did": "1",
      
                "key": "",
      
                "msgId": "20170310130900|en_IN",
      
                "authToken": authToken
      
              }
        }
        const Resp = await axios.post(`/tl-services/loi/report/_create?applicationNumber=${ApplicationNumber}`, payload, { responseType: "arraybuffer" })
    
        console.log("loggerNew...", Resp.data, userInfo)
    
        const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
    
        console.log("logger123456...", pdfBlob, pdfUrl);
    
      };

  const handleChanges = (e) => {
    this.setState({ isRadioSelected: true });
  };

//   const handleChangetrue = async (e) => {
//     const payload = {

//         "RequestInfo": {

//             "apiId": "Rainmaker",
  
//             "ver": ".01",
  
//             "ts": null,
  
//             "action": "_update",
  
//             "did": "1",
  
//             "key": "",
  
//             "msgId": "20170310130900|en_IN",
  
//             "authToken": authToken
  
//           }
//     }
//     const Resp = await axios.post(`/tl-services/loi/report/_create?applicationNumber=${ApplicationNumber}`, payload, { responseType: "arraybuffer" })

//     console.log("loggerNew...", Resp.data, userInfo)

//     const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
//     const pdfUrl = URL.createObjectURL(pdfBlob);
//     window.open(pdfUrl);

//     console.log("logger123456...", pdfBlob, pdfUrl);

//   };

// const handleChanges = (e) => {
// this.setState({ isRadioSelected: true });
// };


    return(
        <React.Fragment>

            
<div className="box">
<div className="row">
<div className="col col-6">
    <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChanges} name="Submit" onClick={handleshow19}>Views PDF With Compliances</Button>
          </div>

<div className="col col-3">
    <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}
      
      onClick={() => {
        
          setSmShow(true),
          console.log("modal open")
         
      }}
    >
        Add Compliances
    </button>
    </div>
    <Modalcompliances
     displaymodal={smShow}
    onClose={() => setSmShow(false)}
    applicationdata={applicationimp}
    passmodalData={handlemodaldData}
    >
 </Modalcompliances>





    </div>

   
   
    
            <form onSubmit={handleSubmit(submitForm)}>
                 <div className="col-md-12">
                    <h5 className='mt-3 mb-3' style={{textAlign: "center"}}><b>
                    {`${t("NWL_APPLICANT_COMPLIANCES_SCRUTINY")}`}
                        </b></h5>                       
                        {/* Compliances  */}
                    <table className="table table-bordered">
                    <thead>                        
                    <tr>                       
                    <th>
                        {/* {`${t("NWL_APPLICANT_SR_NUMBER_SCRUTINY")}`} */}
                    Sr. No
                    </th>
                    <th>
                    {/* {`${t("NWL_APPLICANT_COMPLIANCES_SCRUTINY_TABLE")}`} */}
                     Compliances
                        </th>
                    
                    <th>
                    {/* {`${t("NWL_APPLICANT_PROPOSED_DATA_RECORD_TABLE")}`} */}
                    User name ,
                    Role ,
                    Date Time
                    </th>
                    <th>
                    Proposed Condition Of LOI

                    {/* {`${t("NWL_APPLICANT_PROPOSED_CONDITION_OF_LOI_TABLE")}`} */}
                    </th>
                    
                    
                    {/* <th>
                    Action
                    {`${t("NWL_APPLICANT_PROPOSED_DATA_ACTION_TABLE")}`}
                    </th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {/* {DetailsofAppliedLand?.dgpsDetails?.map((item, index) => ( */}
                        {
                    remarksData?.ComplianceRequest?.map((input, index) =>
                            <tr key={index}>                        
                    <td>{index+1} </td>
                    <td>
                        {/* {} */}
                        <i>{<div dangerouslySetInnerHTML={{__html: input?.Compliance?.compliance}}/>}</i>
                         </td>
                    
                    <td>
                  
                    {input?.Compliance?.designation}<br/>
                    {input?.Compliance?.created_On}<br/>
                    {input?.Compliance?.userName}<br/>
                    
                           </td>
                           <td>
                    {/* {input?.Compliance?.isPartOfLoi} */}
                    <Checkbox
        type="checkbox"
        id="checkbox-id"
        name="checkbox-name"
        onChange={handleChange}
        checked={isChecked}
        value={input?.Compliance?.isPartOfLoi}
        
      />
                         </td>
                    {/* <td>  
                    <button className="btn btn-success btn-lg mb-3" onClick={ addFields}>Add More </button>
                        {
                          index!==0 &&(
                            <button className="btn btn-danger mx-2" onClick={ ()=>removeFields(index)}>Remove </button>
                          )  
                          
                        }                                       
                                          
                    </td> */}
                    </tr> 
                            )
                        }                              
                                          
                    </tbody>
                    </table>
                    {/* <div class="row">
              <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Submit
                </button>
              </div>
             
            </div> */}
                </div>
            
               
</form>


</div>

        </React.Fragment>
    );
}
export default Addmoreinput;