import React, { useState , useEffect  } from 'react';
import AddPost from '../Material/TextEditor';
import axios from "axios";
import { useForm } from "react-hook-form";
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';

const Addmoreinput = (props) =>
{
    const  applicationimp = props.applicationimp;
  const[formValues, setFormValues]= useState([{name:'', email:'', address:''}]);
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
const businessService = applicationimp?.businessService
const Compliance = async (data , index, value) => {
    console.log("REQUEST LOG1 ====> ", data, JSON.stringify(data));
    try {
      setLoading(true);
      const body = {
        RequestInfo: {
          apiId: "Rainmaker",
          ver: ".01",
          ts: null,
          action: "_update",
          did: "1",
          key: "",
          msgId: "20170310130900|en_IN",
          authToken: authToken,
          userInfo: userInfo,
        },
        ComplianceRequest:[{

            tcpApplicationNumber: tcpApplicationNumber,
    
            businessService: businessService,
    
            Compliance:{
    
                compliance:RemarksDeveloper.data,
    
                isPartOfLoi:isChecked,
    
                userName:userInfo?.name || null,
    
                userid:userInfo?.id || null,

                created_On:dateTime.toUTCString(),
    
                designation:designation
    
      }
    
     
    
        }]
      };

      const response = await axios.post("/tl-services/_compliance/_create", body);

      console.log("Submit Response ====> ", response);
      

      setLoading(false);
      setShowToastError({ label: "Surrender of License submitted successfully", error: false, success: true });
    } catch (err) {
      console.log("Submit Error ====> ", err.message);
      setLoading(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }
  };
  useEffect(() => {
    if (props.selectedFieldData) {
    //   setStatus(props.selectedFieldData.isApproved);
      setDeveloperRemarks({ data: props.selectedFieldData?.comment ? props.selectedFieldData?.comment : "" });
    
    } else {
    //   setStatus(null);
      setDeveloperRemarks({ data: "" });
    }
  }, [props.selectedFieldData]);





  const submitForm = (data) => {
   
      Compliance(data);
    
  };


    const [isOpened, setIsOpened] = useState(false);
  
    function toggle() {
      setIsOpened(wasOpened => !wasOpened);
    }
    
    return(
        <React.Fragment>

            
<div className="box">
      <div className="boxTitle" onClick={toggle}>
      <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
      Compliances
                </button>
      </div>
      {isOpened && (
        <div className="boxContent">
       
     


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
                    Proposed Condition Of LOI 

                    {/* {`${t("NWL_APPLICANT_PROPOSED_CONDITION_OF_LOI_TABLE")}`} */}
                    </th>
                    <th>
                    {/* {`${t("NWL_APPLICANT_PROPOSED_DATA_RECORD_TABLE")}`} */}
                    User name ,
                    Role ,
                    Date Time
                    </th>
                    
                    
                    <th>
                    Action
                    {/* {`${t("NWL_APPLICANT_PROPOSED_DATA_ACTION_TABLE")}`} */}
                    </th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            formValues.map( (input, index)=>
                            <tr key={index}>                        
                    <td>{index+1} </td>
                    <td>
                        {/* <input type="text"  className="form-control" name="name" value={formValues.name} onChange={ event=>handleInputChange(index,event)} placeholder="Enter Username"/>  */}
                       <AddPost
                       modal={true}
                       setState={(e) => {
                        setDeveloperRemarks({ data: e });
                        
                      }}
                      state={RemarksDeveloper?.data}
                       ></AddPost>
                         </td>
                    <td>
                    {/* <Checkbox
                      checked={isLOIPart}
                      onChange={(e) => onAction( i, e.target.checked)}
                      
                   defaultChecked /> */}
                 {/* <input type="checkbox" checked={this.state.chkbox} onChange={this.handleChangeChk} /> */}
                 <Checkbox
        type="checkbox"
        id="checkbox-id"
        name="checkbox-name"
        onChange={handleChange}
        checked={isChecked}
        defaultChecked
      />
                         </td>
                    <td>
                        {/* <input type="text" className="form-control" name="address" value={formValues.address} onChange={ event=>handleInputChange(index,event)} placeholder="Enter Address"/> */}
                        </td>
                    <td>  
                    <button className="btn btn-success btn-lg mb-3" onClick={ addFields}>Add More </button>
                        {
                          index!==0 &&(
                            <button className="btn btn-danger mx-2" onClick={ ()=>removeFields(index)}>Remove </button>
                          )  
                          
                        }                                       
                                          
                    </td>
                    </tr> 
                            )
                        }                              
                                          
                    </tbody>
                    </table>
                    <div class="row">
              <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Submit
                </button>
              </div>
              {/* <div class="col-sm-12 text-right">
                <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                  Save as Draft
                </button>
              </div> */}
            </div>
                </div>
            
                {/* </div> */}
                {/* </div>
                </div> */}
</form>
</div>
      )}
    </div>
        </React.Fragment>
    );
}
export default Addmoreinput;