import React, { Fragment } from "react"
import { ArrowRightInbox } from "./svgindex"
import { Link } from "react-router-dom"

const EmployeeModuleCard = ({Icon, moduleName, kpis = [], links = [] }) => {
    return <div className="employeeCard card-home">
            <div className="complaint-links-container">
                <div className="header">
                    <span className="text">{moduleName}</span>
                    <span className="logo">
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
                                <Link to={link}>{label}</Link>
                            </div>
                        </div>)}
                    </div>
                    <div className="links-wrapper">
                        {links.map(({count, label, link}) => <span className="link">
                            <Link to={link}>{label}</Link>
                            {count ? 
                            <>
                                <span className="inbox-total">{count || "-"}</span> 
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