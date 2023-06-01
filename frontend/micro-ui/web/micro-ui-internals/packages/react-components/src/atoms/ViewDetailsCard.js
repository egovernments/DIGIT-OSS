import React from 'react'
import Card from './Card'
import {StatusTable,Row} from './StatusTable'
import CardSubHeader from './CardSectionHeader'

const ViewDetailsCard = ({cardState,t,createScreen,...props}) => {
  return (
    <Card className={createScreen?"":"employeeCard-override"} >
        <StatusTable style={{maxWidth: "950px", minWidth: "280px"}}>
          {
            cardState.map((item, index) => {
              return (
                <div style={{marginBottom: `${index !== cardState?.length - 1 ? "24px" : ""}`}}>
                  {
                    item?.title ? <CardSubHeader key={index} style={{ marginBottom: "16px", fontSize: "24px" }}>{t(item?.title)}</CardSubHeader> : ''
                  }
                  {
                    item?.values?.map((item, index) => {
                      return (<Row className="border-none" label={`${t(item?.title)}`} text={item?.value} textStyle={{ whiteSpace: "pre" }} />)
                    })
                  }
                </div>
              )
            })
          }
        </StatusTable>
    </Card>
  )
}

export default ViewDetailsCard