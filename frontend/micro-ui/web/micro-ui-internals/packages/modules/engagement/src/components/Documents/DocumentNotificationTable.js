import { Table } from '@egovernments/digit-ui-react-components'
import React from 'react'

const DocumentNotificationTable = ({t,columns, data}) => {
  
    return (
        <div className="employee_document_inbox_table_main">
            <Table
            t={t}
            columns={columns}
            data={data}
            />
        </div>
    )
}

export default DocumentNotificationTable