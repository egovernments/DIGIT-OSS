import {
    BreadCrumb,
    Header,
    DocumentIcon,
    CardSectionHeader,
    LinkButton,
    Label,
    TextInput,
    Dropdown,
    ButtonSelector,
    FilterIcon,
    CardCaption,
    RefreshIcon,
    CardLabel,
    
  } from "@egovernments/digit-ui-react-components";
  import React from "react";
  import { useTranslation } from "react-i18next";
  import {Link} from 'react-router-dom';
  import DocumentNotificationTable from "../../../components/Documents/DocumentNotificationTable";
  

  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const getDocumentCell = (value) => <span><a href={value} target="_blank">View</a></span>
  const DocumentNotification = () => {
    const { t } = useTranslation();
    const isLoading = false
    const cityDataNew = [
      {
        city: "Lucknow",
      },
      {
        city: "Kanpur",
      },
      {
        city: "Aligarh",
      },
    ];
  
    const FilterData = [
      {
        data: 'All',
      },
      {
        data: 'Yesterday',
      },
      {
        data: 'Today',
      },
      {
        data: 'tomorrow'
      }
  
    ]
  
    const crumbs = [
      {
        path: "/digit-ui/employee",
        content: "employee",
        show: true,
      },
      {
        path: "/digit-ui/employee/engagement",
        content: "engagement",
        show: true,
      },
      {
        path: "/digit-ui/employee/engagement",
        content: "Document_Notification",
        show: true,
      },
    ];
  
    const columns = React.useMemo(() => [
      {
        Header: t('CE_TABLE_DOCUMENT_NAME'),
        accessor: (row) => GetCell(row.document_name)
        
      },
      {
        Header: 'Document Category',
        accessor: (row) => GetCell(row.document_category ) 
      },
      {
        Header: 'Attachment / Link',
        accessor: (row) => getDocumentCell(row.attachment_link)
      },
      {
        Header: 'Posted By',
        accessor: (row) => GetCell(row.posted_by)
      },
  
    ], [])
  
    const tableData = React.useMemo(() => [{
      document_name: "74th Constitutional ",
      document_category: "Acts",
      attachment_link: "www.google.com/download",  
      posted_by: "Satwinder Singh"
    },
    {
  
      document_name: "State Municipality Act",
      document_category: "Acts",
      attachment_link: "www.yahoo.in/downlaod",
      posted_by: "Satwinder Singh"
    },
    {
  
      document_name: "Citizen Charter 2018-19",
      document_category: "Acts",
      attachment_link: "www.iplt20.com",
      posted_by: "Satwimder Singh"
    },
    {
  
      document_name: "Property Tax Revised",
      document_category: "Acts",
      attachment_link: "www.clt20.com",
      posted_by: "Satwinder Singh"
    },
    ], [])

    let result;
    if (isLoading) {
      result = <Loader />;
    } else if (tableData?.length === 0) {
      result = (
        <Card style={{ marginTop: 20, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {t("CE_DOCUMENTS_NOT_FOUND")}<br/>
          <Link to={`/digit-ui/employee/engagement/documents/create`}>{t('NEW_DOCUMENT_TEXT')}</Link>
        </Card>
      );
    } else if (tableData?.length > 0) {
      result = (
        <DocumentNotificationTable
          t={t}
          data={data?.table}
          columns={inboxColumns(data)}
          getCellProps={(cellInfo) => {
            return {
              style: {
                minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px",
              },
            };
          }}
        //  onPageSizeChange={props.onPageSizeChange}
       //   currentPage={props.currentPage}
       //   onNextPage={props.onNextPage}
//onPrevPage={props.onPrevPage}
     //     pageSizeLimit={props.pageSizeLimit}
     //     onSort={props.onSort}
     //     disableSort={props.disableSort}
     //     onPageSizeChange={props.onPageSizeChange}
      //    sortParams={props.sortParams}
      //    totalRecords={props.totalRecords}
        />
      );
    }
  
  
    return (
      <div>
        <BreadCrumb crumbs={crumbs} />
        <Header>{t('DOCUMENTS_DOCUMENT_HEADER')}</Header>
        <div className="document_notification_first_grid">
          <div className="new_document_section">
            <div className="new_document_card">
              <div className="new_document_section_flex">
                <DocumentIcon />
                <CardSectionHeader>{t('DOCUMENTS_DOCUMENT_CARD_SECTION_HEADER')}</CardSectionHeader>
              </div>
              <Link to={`/digit-ui/employee/engagement/documents/create`}>{t('NEW_DOCUMENT_TEXT')}</Link>
            </div>
          </div>
          <div className="form_section">
            <div className="new_document_card">  
              <div className="document_notification_second_grid">
                <div>
                  <Label>{t('LABEL_FOR_ULB')}</Label>
                  <Dropdown option={cityDataNew} optionKey="city" />
                </div>
                <div>
                  <Label>{t('LABEL_FOR_DOCUMENT_NAME')}</Label>
                  <TextInput type="text" />
                </div>
                <div>
                  <Label>{t('LABEL_FOR_POSTED_BY')}</Label>
                  <TextInput type="text" />
                </div>
              </div>
              <div className="document_notification_clear_search_btn">
                <div className="document_notification_clear_search_btn_align">
                  <LinkButton label={<p className="new_document_clear_search_alignment">{t('CLEAR_SEARCH_LINK')}</p>} />
                  <ButtonSelector label="Search" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="document_notification_first_grid filter_table_section_margin">
          <div className="document_notification_filter_section">
            <div className="filter_card_employee">
              <div className="filter_section_main">
                <div className="document_notification_filter_header">
                  <div className="document_notification_filter_icon">
                    <FilterIcon />
                    <CardCaption>{t('FILTERS_FILTER_CARD_CAPTION')}</CardCaption>
                  </div>
                  <RefreshIcon />
                </div>
              <div className="filter_section_document_categories">
                  <CardLabel>{t('DOCUMENTS_CATEGORY_CARD_LABEL')}</CardLabel>
                  <Dropdown option={FilterData} optionKey="data" />
                  <ButtonSelector label="Apply" className="back_selector_btn_full" />
              </div>
              </div>
            </div>
          </div>
          <div className="document_notification_table_section">
            <div className="new_document_card_table">
             {result}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DocumentNotification;