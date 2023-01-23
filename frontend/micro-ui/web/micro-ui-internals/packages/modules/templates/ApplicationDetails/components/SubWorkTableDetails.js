import { EditIcon } from '@egovernments/digit-ui-react-components';
import React from 'react'
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';

const SubWorkTableDetails = ({data}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const getStyles = (index) => {
        let obj = {}
        switch (index) {
            case 1:
                obj = { "width": "1vw" }
                break;
            case 2:
                obj = { "width": "60vw" }
                break;
            case 3:
                obj = { "width": "20vw" }
                break;
            case 4:
                obj = { "width": "10vw" }
                break;
            default:
                obj = { "width": "1vw" }
                break;
        }
        return obj
    }
    const renderHeader = (headers) => {
        return headers?.map((key, index) => {
            return <th key={index} style={getStyles(key)} > {t(key)} </th>
        })
    }

    const renderBody = (rows) => {
        return rows?.map((row, index) => {
            return <tr style={{ "height": "50%" }}>
                <td style={getStyles(1)}>{row[0]}</td>
                <td style={getStyles(2)} > { row[1] === t("WORKS_TOTAL_AMT") ? <div style={{"float":"right", "fontWeight":"bold"}}>{row[1]}</div> : <div className='field'>{row[1]}</div> }</td>
                {row[1] === t("WORKS_TOTAL_AMT") 
                    ?  <td style={{ "width": "15vw" }}><div style={{"float":"right", "fontWeight":"bold"}}>{row[2]}</div></td>
                    :  <td style={{ "width": "15vw" }}><div style={{"float":"right"}}>{row[2]}</div></td>}
                {row[3] && <td style={getStyles(3)}>
                    <div style={{display:"flex",flexDirection:"row",cursor:"pointer",color:"#F47738"}} onClick={() => history.push(
                        {
                            pathname: `/digit-ui/employee/contracts/create-contract?estimateNumber=${data?.state?.estimateNumber}&task=${data?.state?.estimateDetails[index]?.name}&subEstimate=${data?.state?.estimateDetails[index]?.estimateDetailNumber}`,
                            state:{index, data}
                        }
                        )}>
                        <EditIcon/> {row[3]}
                    </div>
                </td>}
                {/* <td style={getStyles(4)} >{showDelete() && <span onClick={() => removeRow(row)}><DeleteIcon fill={"#B1B4B6"} style={{ "margin": "auto" }} /></span>}</td> */}
            </tr>
        })
    }

  return (
      <table className='table reports-table sub-work-table'>
          <thead>
              <tr>{renderHeader(data?.headers)}</tr>
          </thead>
          <tbody>
              {renderBody(data?.tableRows)}
              {/* <tr>
                  <td style={getStyles(1)}></td>
                  <td style={{ ...getStyles(2), "textAlign": "center" }} onClick={addRow}><span><AddIcon fill={"#F47738"} styles={{ "margin": "auto", "display": "inline", "marginTop": "-2px" }} /><label style={{ "marginLeft": "10px" }}>{t("WORKS_ADD_ITEM")}</label></span></td>
                  <td style={getStyles(3)}></td>
                  <td style={getStyles(4)}></td>
              </tr> */}
          </tbody>
      </table>
  )
}

export default SubWorkTableDetails