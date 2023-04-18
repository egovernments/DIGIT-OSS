import React, { useState } from 'react';
// import AddPost from '../Material/TextEditor';
import Collapse from "react-bootstrap/Collapse";  
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function AdditionalDocument()
{
  const[formValues, setFormValues]= useState([{name:'', email:'', address:''}]);
  const[msg, setMsg]= useState('');
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

    return(
        <React.Fragment>
            <div
        className="collapse-header"
        onClick={() => setOpen(!open)}
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
        <span style={{ color: "#817f7f" }} className="">
          AdditionalDocument
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text">
        {/* <div className="container">
            <div className="row"> */}
                {/* <div className="col-md-12">                        */}
                    <div className="col-md-12">
                    <h5 className='mt-3 mb-3' style={{textAlign: "center"}}><b>Compliances</b></h5>                       
                           
                    <table className="table table-bordered">
                    <thead>                        
                    <tr>                       
                    <th>Sr. No</th>
                    <th>Compliances</th>
                    <th>
                    User name ,
                    Role ,
                    timestamp
                    </th>
                    
                    <th>Part of LOI</th>
                    <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            formValues.map( (input, index)=>
                            <tr key={index}>                        
                    <td>{index+1} </td>
                    <td>
                        {/* <input type="text"  className="form-control" name="name" value={formValues.name} onChange={ event=>handleInputChange(index,event)} placeholder="Enter Username"/>  */}
                       {/* <AddPost></AddPost> */}
                         </td>
                    <td>
                        {/* <input type="text" className="form-control" name="email"   value={formValues.email} onChange={ event=>handleInputChange(index,event)} placeholder="Enter email"/> */}
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
                    <button className="btn btn-success btn-lg" onClick={ handleSubmit}>Submit </button>
                </div>
            
                {/* </div> */}
                {/* </div>
                </div> */}
                 </div>
      </Collapse>

        </React.Fragment>
    );
}
export default AdditionalDocument;