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
  import DocumentNotificationTable from "../../../components/Documents/DocumentNotificationTable";
  
  const DocumentNotification = () => {
    const { t } = useTranslation();
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
        Header: 'Document Name',
        accessor: 'document_name'
      },
      {
        Header: 'Document Category',
        accessor: 'document_category'
      },
      {
        Header: 'Attachment / Link',
        accessor: 'attachment_link'
      },
      {
        Header: 'Posted By',
        accessor: 'posted_by'
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
  
    return (
      <div>
        <BreadCrumb crumbs={crumbs} />
        <Header>Documents</Header>
        <div className="document_notification_first_grid">
          <div className="new_document_section">
            <div className="new_document_card">
              <div className="new_document_section_flex">
                <DocumentIcon />
                <CardSectionHeader>Documents</CardSectionHeader>
              </div>
              <LinkButton label={<p className="new_document_para_color">New Document</p>} />
            </div>
          </div>
          <div className="form_section">
            <div className="new_document_card">  
              <div className="document_notification_second_grid">
                <div>
                  <Label>ULB</Label>
                  <Dropdown option={cityDataNew} optionKey="city" />
                </div>
                <div>
                  <Label>Document Name</Label>
                  <TextInput type="text" />
                </div>
                <div>
                  <Label>Posted by</Label>
                  <TextInput type="text" />
                </div>
              </div>
              <div className="document_notification_clear_search_btn">
                <div className="document_notification_clear_search_btn_align">
                  <LinkButton label={<p className="new_document_clear_search_alignment">Clear Search</p>} />
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
                    <CardCaption>Filters</CardCaption>
                  </div>
                  <RefreshIcon />
                </div>
              <div className="filter_section_document_categories">
                  <CardLabel>Document Category</CardLabel>
                  <Dropdown option={FilterData} optionKey="data" />
                  <ButtonSelector label="Apply" className="back_selector_btn_full" />
              </div>
              </div>
            </div>
          </div>
          <div className="document_notification_table_section">
            <div className="new_document_card_table">
              <DocumentNotificationTable
                t={t}
                columns={columns}
                data={tableData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DocumentNotification;