import React, { createContext } from "react";
import { ScrutinyRemarksProvider } from "./remarks-data-context";



const TLContext = createContext();

const TLContextProvider = ({ children }) => {
    return (
        <TLContext.Provider>
            <ScrutinyRemarksProvider>
            {children}
            </ScrutinyRemarksProvider>
        </TLContext.Provider>
    )
}


export { TLContext, TLContextProvider };