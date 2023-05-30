import React, { useEffect, useRef, useState } from 'react';
// import AddPost from '../Material/TextEditor';
import Collapse from "react-bootstrap/Collapse";  
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getDocShareholding } from '../ScrutinyDevelopment/docview.helper';
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { convertEpochToDateDMY } from '../../../../utils';

function LandSchedule (prop)
{

 const additionalDocref=useRef()
  const additionalDocResponData = prop.additionalDocRespon;
  const[formValues, setFormValues]= useState([{name:'', email:'', address:''}]);
  const[msg, setMsg]= useState('');
  const dateTime = new Date();
  const[newDocAdd, setNewDocAdd]= useState('');
  const [open, setOpen] = useState(false);

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

const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(formValues);
    // axios.post("", formValues);
    setMsg("Data Saved Successfully");

}
useEffect(() => {
if(additionalDocResponData?.AdditionalDocumentReport?.length){
   additionalDocref.current.classList.add("blinkComponentScrutiny")
}
},[additionalDocResponData])

const handleDOc = () =>{
  additionalDocref.current.classList.remove("blinkComponentScrutiny")
}

console.log("additionalDocResponData" , additionalDocResponData);


    return(
        <React.Fragment>
          
            <div
        className="collapse-header"
        ref={additionalDocref}
        onClick={() => {handleDOc();setOpen(!open)}}
        aria-controls="example-collapse-text"
        aria-expanded={open}
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
        {/* <span style={{ color: "#817f7f" }} className="">
          AdditionalDocument
        </span> */}
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
              - Additional Document
            </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text">
        {/* <div className="container">
            <div className="row"> */}
                {/* <div className="col-md-12">                        */}
                    <div className="col-md-12">
                    <h5 className='mt-3 mb-3' style={{textAlign: "center"}}><b>AdditionalDocument</b></h5>                       
                    <table className="table table-bordered">
                    <thead>                        
                    <tr>                       
                    <th>Sr. No</th>
                    <th>Application Section</th>
                    <th>Document Description</th>
                    <th>
                     Download Document
                    </th>
                    
                    {/* <th>Part of LOI</th> */}
                    <th>Date</th>
                    </tr>
                    </thead>
                    
                    {additionalDocResponData?.AdditionalDocumentReport?.map((item) => (
                     <tbody>
                        { item?.landSchedule?.map( (input, index)=>(
                            <tr key={index}>                        
                    <td>{index + 1}</td>
                    <td>
                    
                       {input?.applicationSection}
                         </td>
                    <td>
                    
                       {input?.documentName}
                         </td>
                    <td>
                  
                        {/* {input?.document} */}
                        <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(input?.document)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(input?.document)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                        </td>
                    <td>
        
                        {/* {input?.Date} */}
                      {convertEpochToDateDMY(input.Date)} 
                        </td>

                    </tr> 
                         ) )
                        }   
                      </tbody> 
)) }                          
                                          
                                          
                    </table>
                
                </div>
            
       
                 </div>
      </Collapse>

        </React.Fragment>
    );
}
export default LandSchedule;