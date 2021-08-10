import React, { useState } from "react"
import _ from 'lodash';
import { getLocaleLabels } from "../../../utils/commons";

export default function FilterTable(props) {
    let initState = props.data;
    const [state, setState] = useState({ filter: initState });

    const renderTableHeader = () => {

        // let header = Object.keys(state.filter)
        return ["Filters Applied", "Filter Values"].map((key, index) => {
            return <th style={{ border: '1px solid' }} key={index}><span style={{ padding: 10 }}>{getLocaleLabels(key.toUpperCase())}</span></th>
        })
    }

    const renderTableData = () => {
        let tr = [];
        _.mapKeys(state.filter, (value, key) => {
            let valueToPrint = (_.get(value, 'title') || _.join(value)).length > 0 ? (_.get(value, 'title') || _.join(value)) : ('All ' + key);
            // const { name, value } = student //destructuring
            tr.push(<tr key={key}>
                <td style={{ border: '1px solid' }}><span style={{ padding: 10 }}>{key}</span></td>
                <td style={{ border: '1px solid' }}><span style={{ padding: 10 }}>{value ? (typeof value === 'object' ? valueToPrint : value) : valueToPrint}</span></td>
            </tr>)
        })
        return tr;
    }

    return (
        <div style={{ minWidth: 400 }}>
            <div style={{textAlign:'center',fontSize:'25px',fontFamily:'Roboto'}}>
                <h4 id='filter'>
                {props.name}
                </h4>
            </div>
            <table style={{ display: "flex" }}>
                <tbody>
                    <tr>{renderTableHeader()}</tr>
                    {renderTableData()}
                </tbody>
            </table>
        </div>
    )
}

// const mapStateToProps = state => ({
//     GFilterData: state.GFilterData
// });

// const mapDispatchToProps = dispatch => {
//     return bindActionCreators({
//     }, dispatch)
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(FilterTable);