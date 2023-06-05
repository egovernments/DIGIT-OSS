import {logoutV1} from "./logout";

const UserService={
    logoutV1,
}

const works = {
    
}

const contracts = {
    
}

const Hooks ={
    attendance:{
        update:()=>{}
    },
    works,
    contracts
}


export const CustomisedHooks ={
   Hooks,
   UserService
}
