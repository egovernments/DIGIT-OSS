import React from "react";
import ArrearTable from "../../ui-atoms-local/ArrearTable";
import './index.css';

const ArrearsMolecule = (props) => {

    let head = {};
    props.fees ? Object.keys(props.fees).map((key, ind) => {
        let value = [];
        Object.keys(props.fees[key]).map(key1 => {
            head[key1] = props.fees[key] && props.fees[key][key1] && props.fees[key][key1].order || 0;
        })
    }
    ) : "NA"
    let keys = [];

    keys = Object.keys(head);
    keys.sort((x, y) => head[x] - head[y]);
    return (<ArrearTable headers={[...keys]} values={props.fees} arrears={props.arrears}></ArrearTable>)
}
export default ArrearsMolecule;
