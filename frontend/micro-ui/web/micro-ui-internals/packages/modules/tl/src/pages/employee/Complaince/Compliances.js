import React, { useState } from 'react';
import AddPost from '../Material/TextEditor';

function Addmoreinput()
{
  const[formValues, setFormValues]= useState([{name:'', email:'', address:''}]);
  const[msg, setMsg]= useState('');

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
                    
                    <th>Proposed Condition Of LOI</th>
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
                       <AddPost></AddPost>
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

        </React.Fragment>
    );
}
export default Addmoreinput;