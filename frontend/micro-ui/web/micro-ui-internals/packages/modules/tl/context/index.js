import React, { createContext } from "react";
import { ScrutinyRemarksProvider } from "./remarks-data-context";
import { ComplicesRemarksProvider } from "./Complices-remarks-context";



const TLContext = createContext();

const TLContextProvider = ({ children }) => {
    return (
        <TLContext.Provider>
            <ComplicesRemarksProvider>
            <ScrutinyRemarksProvider>
            {children}
            </ScrutinyRemarksProvider>
            </ComplicesRemarksProvider>
        </TLContext.Provider>
    )
}


export { TLContext, TLContextProvider };