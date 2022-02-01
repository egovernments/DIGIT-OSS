import React, { Fragment } from "react"
import { ArrowRightInbox } from "./svgindex"
import { Link } from "react-router-dom"


const EmployeeModuleCard = ({Icon, moduleName, kpis = [], links = [], isCitizen = false, className, styles }) => {
    return <div className={className ? className : "employeeCard card-home customEmployeeCard" } style={styles ? styles : {}}>
            <div className="complaint-links-container">
                <div className="header" style={isCitizen ? {padding: "0px"}: {}}>
                    <span className="text removeHeight">{moduleName}</span>
                    <span className="logo removeBorderRadiusLogo">
                        {Icon}
                    </span>
                </div>
                <div className="body" style={{ margin: "0px", padding: "0px" }}>
                    <div className="flex-fit" style={isCitizen ? {paddingLeft: "17px"}: {}}>
                        {kpis.map(({count, label, link}, index) => <div className="card-count" key={index}>
                            <div> 
                                <span>{count || "-"}</span>
                            </div>
                            <div>
                                {link ? <Link to={link} className="employeeTotalLink">{label}</Link> : null}
                            </div>
                        </div>)}
                    </div>
                    <div className="links-wrapper" style={{width: "80%"}}>
                        {links.map(({count, label, link}, index) => <span className="link" key={index}>
                            {link ? <Link to={link}>{label}</Link> : null }
                            {count  ? 
                            <>
                                <span className={"inbox-total"}>{count || "-"}</span> 
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