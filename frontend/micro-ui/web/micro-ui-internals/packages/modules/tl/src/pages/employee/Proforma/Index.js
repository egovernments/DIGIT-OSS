import React from "react";
import { Button, Form } from "react-bootstrap";
import AddPost from "../Material/TextEditor";



const Component = ({ dataMDMS , register }) => {
 
  console.log("datatemplates", dataMDMS?.["common-masters"]?.PerformaNewLicence?.[0]?.templates);
  // console.log("datatemplates", );

//   const { register, handleSubmit , watch } = useForm();



const getDynamicFileds = (type , data) => {
    

    switch (type) {
        case "radio":
          return (
            <React.Fragment>
             <div style={{
              display: "flex",
              width: "1250px",
              marginTop: "15px",
             }}>
              <p >{data?.label}: </p>
              {(data?.label && !data?.name?.includes("Remarks")) && <input type="hidden" value={data.label} {...register(data?.name+"Label")} />}
              {data?.options?.map((it, inx) => {
                return (
                  <div key={inx}>
                    <input
                      type="radio"
                      className="d-flex"
                      id={it?.value}
                      
                      value={it?.value}
                      {...register(data?.name)}
                    />
                    <label for={it?.value} >{it?.label}</label>
                    <br />
                   
                  </div>
                );
              })}
            </div>
              {
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
              }
            </React.Fragment>  );
       
          case "textarea":
          return (
            <React.Fragment>
            <div className="row" style={{
              display: "flex",
              width: "1150px",
              marginTop: "15px",
             }}>
              {/* <label> Remark</label> */}
              <textarea
                type="textarea"
                name={data?.name}
                className="registrationpage"
                placeholder={data?.placeholder}
                {...register(data?.name)}
              />
              {/* <AddPost></AddPost> */}
              {/* <Form.Control as="textarea" rows={1} type="text" className="form-control" placeholder="" {...register("landOwner")}/> */}
              <br></br>
            </div>
              {
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
              }
           </React.Fragment>
          );
      //   case "text":
      //     return (
      //       <React.Fragment>
      //       <div>
      //         <label>{data?.label}: </label>
      //         <input
      //           type="text"
      //           name={data?.name}
      //           placeholder={data?.placeholder}
      //         />
      //       </div>
      //         {
      //           data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
      //         }
      //       </React.Fragment> );
      //   case "select":
      //     return (
      //       <React.Fragment>
      //       <div style={{ marginTop: "10px" }}>
      //         <label for={data?.name}>{data?.label}: </label>
      //         <select name={data?.name}>
      //           {data?.options?.map((itm, ind) => {
      //             return (
      //               <option key={ind} value={itm?.value}>
      //                 {itm?.label}
      //               </option>
      //             );
      //           })}
      //         </select>
      //       </div>
      //           {
      //           data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
      //         }
      //       </React.Fragment> );
      //   case "checkbox":
      //     return (
      //       <React.Fragment>
      //       <div style={{ marginTop: "10px" }}>
      //         <input
      //           type="checkbox"
      //           id={data?.name}
      //           name={data?.name}
      //           value={data?.value}
      //         />
      //         <label for={data?.name}>{data?.label}: </label>
      //         </div>
      //         {
                  
      //           data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
      //         }
      //  </React.Fragment>   );
            default :
            return null ;
    ;  }
}

  
if( dataMDMS?.["common-masters"]?.PerformaNewLicence?.[0]?.templates?.length){
    
return ( 
    dataMDMS?.["common-masters"]?.PerformaNewLicence?.[0]?.templates?.map((item, index) => getDynamicFileds(item?.type , item)
    
    )

  )

}
else {
    return null ;
}

};



export default Component;