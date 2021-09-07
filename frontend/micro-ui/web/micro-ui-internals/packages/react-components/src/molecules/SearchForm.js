import React from "react"

export const SearchField = ({children, className}) => {
    return <div className={`form-field ${className || ""}`}>
        {children}
    </div>
}

export const SearchForm = ({ children, onSubmit, handleSubmit }) => {
    return <form className="search-form-wrapper" onSubmit={handleSubmit(onSubmit)} >
            {children}
    </form>
}
