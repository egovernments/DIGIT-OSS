import {logoutV1} from "./logout";
import useEventDetails from "./useEventDetails";

const UserService={
    logoutV1,
}

const works = {
    
}

const contracts = {
    
}
const events={
    useEventDetails
}

const Hooks ={
    attendance:{
        update:()=>{}
    },
    works,
    contracts,
    events
}


export const CustomisedHooks ={
   Hooks,
   UserService
}
