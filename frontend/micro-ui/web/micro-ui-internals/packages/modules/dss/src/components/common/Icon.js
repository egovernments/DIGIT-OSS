import React from "react";
import { ReactComponent as PropertyTaxIcon } from '../../images/property-tax.svg'
import { ReactComponent as DashBoardIcon } from '../../images/dashboards.svg'
import { ReactComponent as ComplaintsIcon } from '../../images/complaints.svg'
import { ReactComponent as TradeIcon } from '../../images/trade-license.svg'
import { ReactComponent as WaterSewerage } from '../../images/water_sewerage.svg'
import { ReactComponent as FSM } from '../../images/fsm.svg'
import { ReactComponent as FireNoc } from '../../images/firenocdashboard.svg'
import { ReactComponent as Mcollect } from '../../images/mcollect.svg'
import { ReactComponent as OBPS } from '../../images/obps.svg'
import { ReactComponent as Tradelic } from '../../images/tradeLic_nurt.svg'
import { ReactComponent as BuildingPermission } from '../../images/building_permission.svg'
import { ReactComponent as BirthDeath } from '../../images/birth_death.svg'
import { ReactComponent as Finance } from '../../images/finance.svg'

//import SVG from 'react-inlinesvg';

export function Icon(type, iconColor) 
{
    switch (type.toLowerCase()) {
        case 'overview':
        case 'dss_overview':
            return <DashBoardIcon></DashBoardIcon>
        case 'fsm':
        case 'dss_fsm':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><FSM></FSM></div>
        case 'obps dashboard':
        case 'obps dashboard':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><OBPS></OBPS></div>
        case 'online building plan approval system':
        case 'dss_obps_overview':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><BuildingPermission></BuildingPermission></div>
        case 'nurt_overview':
            return <DashBoardIcon></DashBoardIcon>
        case 'nurt_project_staus':
            return <DashBoardIcon></DashBoardIcon>
        case 'nurt_property_tax':
        case 'dss_property_tax':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><PropertyTaxIcon></PropertyTaxIcon></div>
        case 'nurt_trade_licence':
        case 'dss_trade_licence':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><Tradelic></Tradelic></div>
        case 'nurt_complains':
        case 'dss_complains':
        case 'public grievances & redressal':
        case 'dss_pgr_overview':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><ComplaintsIcon></ComplaintsIcon></div>
        case 'nurt_water_sewerage':
        case 'dss_water_sewerage':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><WaterSewerage></WaterSewerage></div>
        case 'dss_building_permission':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><BuildingPermission></BuildingPermission></div>
        case 'nurt_firenoc':
        case 'fire noc dashboard':
        case 'fire noc':
        case 'dss_firenoc_overview':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><FireNoc></FireNoc></div>
        case 'nurt_mcollect':
        case 'dss_mcollect':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><Mcollect></Mcollect></div>
        case 'dss_finance':
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><Finance></Finance></div>
        case 'nurt_live_active_ulbs':
            return <DashBoardIcon></DashBoardIcon>
        case 'dss_birth_death':
        case 'nss_birth_death':
        case "nurt_birth":
        case "nurt_death":
        case "nurt_bnd":
            return <div style={{background: iconColor, width: "60 px" , height: "52px"}}><BirthDeath/></div>
        default:
            return <div></div>

    }
};

export default Icon;