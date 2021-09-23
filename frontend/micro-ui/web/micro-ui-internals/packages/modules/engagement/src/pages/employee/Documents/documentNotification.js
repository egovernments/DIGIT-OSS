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
  Card,
  DownloadImgIcon,
  Loader

} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

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


const DocumentNotification = () => {
  const { t } = useTranslation();
  const { data: ulbArray, isLoading: isLoadingUlbs } = Digit.Hooks.useTenants();
  const [selectedCategory, setSelectedCategory] = useState({})
  const [selectedUlb, setSelectedUlb] = useState({});
  const stateId = Digit.ULBService.getStateId();
  const currrentUlb = Digit.ULBService.getCurrentUlb() || "pb.amritsar";
  const { data: categoryData, isLoading: isLoadingDocCategories } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", ["UlbLevelCategories"], {
    select: (d) => {

      const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => e.ulb === currrentUlb.code);
      return data[0].categoryList.map((name) => ({ name }));
    },
  });


  const tableData = React.useMemo(() => [
    {
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



  console.log({ stateId, currrentUlb, categoryData, ulbArray })

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
            <Link className="link" to={`/digit-ui/employee/engagement/documents/create`}>{t('NEW_DOCUMENT_TEXT')}</Link>
          </div>
        </div>
        <div className="form_section">
          <div className="new_document_card">
            <div className="document_notification_second_grid">
              <div>
                <Label>{t('LABEL_FOR_ULB')}</Label>
                <Dropdown
                  allowMultiselect={true}
                  optionKey={"i18nKey"}
                  option={ulbArray}
                  select={(e) => {
                    setSelectedUlb(e)
                  }}
                  keepNull={true}
                  selected={selectedUlb}
                  t={t}
                />
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
                <Dropdown
                  allowMultiselect={true}
                  optionKey={"name"}
                  option={categoryData}
                  select={(e) => {
                    setSelectedCategory(e)
                  }}
                  keepNull={true}
                  selected={selectedCategory}
                  t={t}
                />
                <ButtonSelector label="Apply" className="back_selector_btn_full" />
              </div>
            </div>
          </div>
        </div>
        <div className="document_notification_table_section">
          <div className="new_document_card_table">

          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentNotification;
