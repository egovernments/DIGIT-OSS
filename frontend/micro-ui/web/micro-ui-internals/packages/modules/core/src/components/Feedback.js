import React from "react";
import { useHistory } from "react-router-dom";

const FeedBack=()=>{
    const history=useHistory();
    const { data: feedback } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "common-masters", "Feedback");
    const allowedUrl=feedback?.["common-masters"]?.Feedback[0]?.allowedUrls;
    const currentUrl=window.location.href;
    console.table("Feedback",allowedUrl,currentUrl);
    return(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            {allowedUrl?.map((item)=>(
            currentUrl.includes(item)
            ?   
            <div style={{ color: '#F47738', marginLeft: '10px',cursor:"pointer"}} onClick={() => history.push("/digit-ui/citizen/cf-home")}>Having an issue/Feedback for us?</div>
            :null
            ))
            }
        </div>
    )
}
export default FeedBack;