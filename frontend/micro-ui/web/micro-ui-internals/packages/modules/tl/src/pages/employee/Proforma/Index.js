import React from "react";


const Component = ({ data , dataMDMS }) => {
  console.log("data", dataMDMS , data);
  console.log("datatemplates", dataMDMS?.["common-masters"]?.PerformaNewLicence?.[0]?.templates);

//   const { register, handleSubmit , watch } = useForm();


const getDynamicFileds = (type , data) => {
    

    switch (type) {
        case "radio":
          return (
            <React.Fragment>
             <div style={{ marginTop: "10px" , marginRight: "10px", display:"flex" , width :"500px"}}>
              <p style={{ marginLeft: "15px" }}>{data?.label}: </p>
              {data?.options?.map((it, inx) => {
                return (
                  <div key={inx}  style={{ marginRight: "10px" , marginLeft: "15px" , display:"flex" }} >
                    <input
                      type="radio"
                      className="d-flex"
                      id={it?.value}
                      name={data?.name}
                      value={it?.value}
                    //   {...register(data?.name)}
                    />
                    <label for={it?.value} style={{ marginRight: "0px" , marginLeft: "10px"  }}>{it?.label}</label>
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
            <div style={{ marginTop: "10px" , marginRight: "10px", display:"flex" , width :"500px"}}>
              <label>
                {/* {data?.label}: */}
                Remark</label>
              <textarea
                type="textarea"
                name={data?.name}
                placeholder={data?.placeholder}
                // {...register(data?.name)}
              />
            </div>
              {
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
              }
           </React.Fragment>
          );
        case "text":
          return (
            <React.Fragment>
            <div>
              <label>{data?.label}: </label>
              <input
                type="text"
                name={data?.name}
                placeholder={data?.placeholder}
              />
            </div>
              {
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
              }
            </React.Fragment> );
        case "select":
          return (
            <React.Fragment>
            <div style={{ marginTop: "10px" }}>
              <label for={data?.name}>{data?.label}: </label>
              <select name={data?.name}>
                {data?.options?.map((itm, ind) => {
                  return (
                    <option key={ind} value={itm?.value}>
                      {itm?.label}
                    </option>
                  );
                })}
              </select>
            </div>
                {
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
              }
            </React.Fragment> );
        case "checkbox":
          return (
            <React.Fragment>
            <div style={{ marginTop: "10px" }}>
              <input
                type="checkbox"
                id={data?.name}
                name={data?.name}
                value={data?.value}
              />
              <label for={data?.name}>{data?.label}: </label>
              </div>
              {
                  
                data?.labels?.map((item , index) => getDynamicFileds(item?.type , item))
              }
       </React.Fragment>   );
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