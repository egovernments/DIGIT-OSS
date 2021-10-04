import React, { Fragment } from "react"
import { ArrowRightInbox } from "./svgindex"
import { Link } from "react-router-dom"


const EmployeeModuleCard = ({Icon, moduleName, kpis = [], links = [], isCitizen = false }) => {
    return <div className="employeeCard card-home customEmployeeCard" style={isCitizen ? {margin: "0px 16px 24px 16px", padding: "0px"} : {}}>
            <div className="complaint-links-container">
                <div className="header">
                    <span className="text removeHeight">{moduleName}</span>
                    <span className="logo removeBorderRadiusLogo">
                        {Icon}
                    </span>
                </div>
                <div className="body" style={{ margin: "0px", padding: "0px" }}>
                    <div className="flex-fit">
                        {kpis.map(({count, label, link}) => <div className="card-count">
                            <div> 
                                <span>{count || "-"}</span>
                            </div>
                            <div>
                                <Link to={link} className="employeeTotalLink">{label}</Link>
                            </div>
                        </div>)}
                    </div>
                    <div className="links-wrapper">
                        {links.map(({count, label, link}) => <span className="link">
                            <Link to={link}>{label}</Link>
                            {(count || isCitizen) ? 
                            <>
                                <span className={isCitizen ? "" : "inbox-total"}>{isCitizen ? "" : count || "-"}</span> 
                                    <Link to={link}>
                                        <ArrowRightInbox />
                                    </Link>
                            </> : null }
                        </span>)}
                    </div>
                </div>
            </div>
        </div>
}

export default EmployeeModuleCard