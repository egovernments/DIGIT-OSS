import React, { useState, useEffect, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import AddPost from "../Material/TextEditor";



const Component = ({ dataMDMS , register , setValue , dataProfrmaFileds, watch, errors}) => {
 
  console.log("datatemplates", dataMDMS?.["common-masters"]?.PerformaNewLicence?.[0]?.templates);
  
  // console.log("datatemplates", );

//   const { register, handleSubmit , watch } = useForm();
const [dataset , setDataset] = useState([]);


// setDataset(dataProfrmaFileds?.data?.PerformaScruitny?.[0]?.additionalDetails?.data);
console.log("dataset1234", dataProfrmaFileds , dataProfrmaFileds?.data?.jamabandhi);
useEffect(() => {
  console.log("jamabandhi",  dataProfrmaFileds?.data);
  if (dataProfrmaFileds?.data) {
//  setValue("landOwnersRemarks", dataProfrmaFileds?.data?.landOwnersRemarks)
 setValue("data1Remarks", dataProfrmaFileds?.data?.data1Remarks)
 setValue("data1", dataProfrmaFileds?.data?.data1)
//  setValue("landOwnersRemarks", "here are grammar debates that never die;")
 setValue("data2Remarks", dataProfrmaFileds?.data?.data2Remarks)
 setValue("data2", dataProfrmaFileds?.data?.data2)
 setValue("data3", dataProfrmaFileds?.data?.data3)
 setValue("data3Remarks", dataProfrmaFileds?.data?.data3Remarks)
 setValue("data4Remarks", dataProfrmaFileds?.data?.data4Remarks)
 setValue("data4", dataProfrmaFileds?.data?.data4)
 setValue("data5", dataProfrmaFileds?.data?.data5)
 setValue("data5Remarks", dataProfrmaFileds?.data?.data5Remarks)
 setValue("data6Remarks", dataProfrmaFileds?.data?.data6Remarks)
 setValue("data6", dataProfrmaFileds?.data?.data6)
 setValue("data7", dataProfrmaFileds?.data?.data7)
 setValue("data7Remarks", dataProfrmaFileds?.data?.data7Remarks)
 setValue("data8Remarks", dataProfrmaFileds?.data?.data8Remarks)
 setValue("data8", dataProfrmaFileds?.data?.data8)
 setValue("data9", dataProfrmaFileds?.data?.data9)
 setValue("data9Remarks", dataProfrmaFileds?.data?.data9Remarks)
//  setValue("khasraNumberForGPA/SPA", dataProfrmaFileds?.data?.khasraNumberForGPA/SPA)
//  setValue("khasraNumberForGPA/SPARemarks", dataProfrmaFileds?.data?.khasraNumberForGPA/SPARemarks)
 setValue("data10Remarks", dataProfrmaFileds?.data?.data10Remarks)
 setValue("data10", dataProfrmaFileds?.data?.data10)
 setValue("data11", dataProfrmaFileds?.data?.data11)
 setValue("data11Remarks", dataProfrmaFileds?.data?.data11Remarks)
 setValue("data12", dataProfrmaFileds?.data?.data12)
 setValue("data12Remarks", dataProfrmaFileds?.data?.data12Remarks)
 setValue("data13Remarks", dataProfrmaFileds?.data?.data13Remarks)
 setValue("data13", dataProfrmaFileds?.data?.data13)
 setValue("data14Remarks", dataProfrmaFileds?.data?.data14Remarks)
 setValue("data14", dataProfrmaFileds?.data?.data14)
 setValue("data15Remarks", dataProfrmaFileds?.data?.data15Remarks)
 setValue("data15", dataProfrmaFileds?.data?.data15)
 setValue("data16Remarks", dataProfrmaFileds?.data?.data16Remarks)
 setValue("data16", dataProfrmaFileds?.data?.data16)
 setValue("data17Remarks", dataProfrmaFileds?.data?.data17Remarks)
 setValue("data17", dataProfrmaFileds?.data?.data17)
 setValue("data18Remarks", dataProfrmaFileds?.data?.data18Remarks)
 setValue("data18", dataProfrmaFileds?.data?.data18)
 setValue("data19Remarks", dataProfrmaFileds?.data?.data19Remarks)
 setValue("data19", dataProfrmaFileds?.data?.data19)
 setValue("data20Remarks", dataProfrmaFileds?.data?.data20Remarks)
 setValue("data20", dataProfrmaFileds?.data?.data20)
 setValue("data21Remarks", dataProfrmaFileds?.data?.data21Remarks)
 setValue("data21", dataProfrmaFileds?.data?.data21)
 setValue("data22Remarks", dataProfrmaFileds?.data?.data22Remarks)
 setValue("data22", dataProfrmaFileds?.data?.data22)
 setValue("data23Remarks", dataProfrmaFileds?.data?.data23Remarks)
 setValue("data23", dataProfrmaFileds?.data?.data23)
 setValue("data24Remarks", dataProfrmaFileds?.data?.data24Remarks)
 setValue("data24", dataProfrmaFileds?.data?.data24)
 setValue("data25Remarks", dataProfrmaFileds?.data?.data25Remarks)
 setValue("data25", dataProfrmaFileds?.data?.data25)
 setValue("data26Remarks", dataProfrmaFileds?.data?.data26Remarks)
 setValue("data26", dataProfrmaFileds?.data?.data26)

  }
}, [dataProfrmaFileds?.data]);

const getDynamicFileds = (type , data, validation ) => {
    
    
    switch (type) {
        case "radio":
          return (
            <React.Fragment>
             <div className="textareaProforma" style={{
              display: "flex",
              marginTop: "20px",
              marginBottom: "10px"
              // width: "1250px",
              // marginTop: "15px",
             }}>
              <p >{data?.label}: </p>
              {(data?.label && !data?.name?.includes("Remarks")) && <input type="hidden" value={data.label} {...register(data?.name+"Label")} />}
              {data?.options?.map((it, inx) => {
                return (
                  <div key={inx} 
                  style={{
                    margin: "0px 5px",
                    display: "flex",
                    alignItems:"baseline"
                  }}>
                    <input
                      type="radio"
                      className="d-flex"
                      id={it?.value}
                      style={{
                        margin: "0px 5px"
                      }}
                      value={it?.value}
                      {...register(data?.name,validation)}
                    />
                    <label for={it?.value} >{it?.label}</label>
                    <br />
                   
                  </div>
                );
              })}
            </div>

            <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.[data?.name] && errors?.[data?.name]?.message}
                  </h3>

              {
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item, {
                  required: {
                    message: "This field is required",
                    value: watch(data?.name) === 'yes' ? true : false
                  }
                }))
              }
            </React.Fragment>  );
       
          case "textarea":
          return (
            <React.Fragment>
            <div className="textareaProforma" >
              {/* <label> Remark</label> */}
              <textarea
                type="textarea"
                name={data?.name}
                className="registrationpage"
                placeholder={data?.placeholder}
                {...register(data?.name,validation)}
              />
              {/* <AddPost></AddPost> */}
              {/* <Form.Control as="textarea" rows={1} type="text" className="form-control" placeholder="" {...register("landOwner")}/> */}
              <br></br>
            </div>

            <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.[data?.name] && errors?.[data?.name]?.message}
                  </h3>

              {
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item,{
                  required: {
                    message: "This field is required",
                    value: item?.type === 'radio'
                  }
                }))
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
    dataMDMS?.["common-masters"]?.PerformaNewLicence?.[0]?.templates?.map((item, index) => getDynamicFileds(item?.type , item, {
      required: {
        message: "This field is required",
        value: true
      }
    })
    
    )

  )

}
else {
    return null ;
}


};



export default Component;