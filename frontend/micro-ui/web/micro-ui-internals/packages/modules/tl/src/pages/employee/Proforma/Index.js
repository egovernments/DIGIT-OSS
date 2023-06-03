import React, { useState, useEffect, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import AddPost from "../Material/TextEditor";



const Component = ({ dataMDMS , register , setValue , dataProfrmaFileds}) => {
 
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
 setValue("khasraNumberCollaborationAgreementRemarks", dataProfrmaFileds?.data?.khasraNumberCollaborationAgreementRemarks)
 setValue("khasraNumberCollaborationAgreement", dataProfrmaFileds?.data?.khasraNumberCollaborationAgreement)
//  setValue("landOwnersRemarks", "here are grammar debates that never die;")
 setValue("scruitnyFeesRemarks", dataProfrmaFileds?.data?.scruitnyFeesRemarks)
 setValue("jamabandhi", dataProfrmaFileds?.data?.jamabandhi)
 setValue("jamabandhiRemarks", dataProfrmaFileds?.data?.jamabandhiRemarks)
 setValue("accumulatedReservesAndSurplusesRemarks", dataProfrmaFileds?.data?.accumulatedReservesAndSurplusesRemarks)
 setValue("accumulatedReservesAndSurpluses", dataProfrmaFileds?.data?.accumulatedReservesAndSurpluses)
 setValue("applicationAtAdditionalArea", dataProfrmaFileds?.data?.applicationAtAdditionalArea)
 setValue("applicationAtAdditionalAreaRemarks", dataProfrmaFileds?.data?.applicationAtAdditionalAreaRemarks)
 setValue("applicationAtAdditionalAreaScruitnyFeesRemarks", dataProfrmaFileds?.data?.applicationAtAdditionalAreaScruitnyFeesRemarks)
 setValue("applicationAtAdditionalAreaScruitnyFees", dataProfrmaFileds?.data?.applicationAtAdditionalAreaScruitnyFees)
 setValue("applicationAtAdditionalAreaStatusEDCSIDC", dataProfrmaFileds?.data?.applicationAtAdditionalAreaStatusEDCSIDC)
 setValue("applicationAtAdditionalAreaStatusEDCSIDCRemarks", dataProfrmaFileds?.data?.applicationAtAdditionalAreaStatusEDCSIDCRemarks)
 setValue("applicationUnderMigrationRemarks", dataProfrmaFileds?.data?.applicationUnderMigrationRemarks)
 setValue("applicationUnderMigration", dataProfrmaFileds?.data?.applicationUnderMigration)
 setValue("applicationUnderMigrationScruitnyFees", dataProfrmaFileds?.data?.applicationUnderMigrationScruitnyFees)
 setValue("applicationUnderMigrationScruitnyFeesRemarks", dataProfrmaFileds?.data?.applicationUnderMigrationScruitnyFeesRemarks)
//  setValue("khasraNumberForGPA/SPA", dataProfrmaFileds?.data?.khasraNumberForGPA/SPA)
//  setValue("khasraNumberForGPA/SPARemarks", dataProfrmaFileds?.data?.khasraNumberForGPA/SPARemarks)
 setValue("landOwnersRemarks", dataProfrmaFileds?.data?.landOwnersRemarks)
 setValue("landOwners", dataProfrmaFileds?.data?.landOwners)
 setValue("originalMutations", dataProfrmaFileds?.data?.originalMutations)
 setValue("originalMutationsRemarks", dataProfrmaFileds?.data?.originalMutationsRemarks)
 setValue("saleDeeds", dataProfrmaFileds?.data?.saleDeeds)
 setValue("saleDeedsRemarks", dataProfrmaFileds?.data?.saleDeedsRemarks)
 setValue("shajraPlanRemarks", dataProfrmaFileds?.data?.shajraPlanRemarks)
 setValue("shajraPlan", dataProfrmaFileds?.data?.shajraPlan)

  }
}, [dataProfrmaFileds?.data]);

const getDynamicFileds = (type , data) => {
    
    
    switch (type) {
        case "radio":
          return (
            <React.Fragment>
             <div className="textareaProforma" style={{
              display: "flex",
              // width: "1250px",
              // marginTop: "15px",
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
            <div className="textareaProforma" >
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