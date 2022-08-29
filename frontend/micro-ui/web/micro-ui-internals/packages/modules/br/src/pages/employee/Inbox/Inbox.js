import React, { useState, useCallback ,  useEffect  } from "react";
import { useTranslation } from "react-i18next";
import { format, isValid } from "date-fns";
import { Header ,Loader } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "./DesktopInbox";
import axios from 'axios';
const Inbox = ({ tenants, parentRoute }) => {
  const { t } = useTranslation()
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pageSize, setPageSize] = useState(10);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = useState({
    eventStatus: [],
    range: {
      startDate: null,
      endDate: new Date(""),
      title: ""
    },
    ulb: tenants?.find(tenant => tenant?.code === tenantId)
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const [data, setData] = useState([]);
const {isLoading } = data;
  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios("https://62f0e3e5e2bca93cd23f2ada.mockapi.io/birth");
      setData(result.data);
      console.log("gooo" ,result.data);
    })();
  }, []);

  const getSearchFields = () => {
    return [
      {
        label: t("EVENTS_ULB_LABEL"),
        name: "ulb",
        type: "ulb",
      },
      {
        label: t("Baby's NAME"),
        name: "babyLastName"
      }
    ]
  }

  const links = [
    {
      text: t("Create Birth-Registration"),
      link: "/digit-ui/citizen/br/birth",
    }
  ]


    
  const onSearch = (params) => {
    let updatedParams = { ...params };
    if (!params?.ulb) {
      updatedParams = { ...params, ulb: { code: tenantId } }
    }
    setSearchParams({ ...searchParams, ...updatedParams });
  }

  const handleFilterChange = (data) => {
    setSearchParams({ ...searchParams, ...data })
  }

  const globalSearch = (rows, columnIds) => {
    // return rows;
    return rows?.filter(row =>
     
      (searchParams?.babyLastName ? row.original?.babyLastName?.toUpperCase().startsWith(searchParams?.babyLastName.toUpperCase()) : true) 
     ) }

  const fetchNextPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => ((parseInt(prevPageOffSet) + parseInt(pageSize))));
  }, [pageSize])

  const fetchPrevPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => ((parseInt(prevPageOffSet) - parseInt(pageSize))));
  }, [pageSize])

  const handlePageSizeChange = (e) => {
    setPageSize((prevPageSize) => (e.target.value));
  };


  if (isLoading) {
    return (
      <Loader />
    );
  }
  

  return (
    <div>
      <Header>
        {t("Birth-registration")}
      
      </Header>
      <p>{}</p>
      <DesktopInbox
        t={t}
        data={data}
        links={links}
        parentRoute={parentRoute}
        searchParams={searchParams}
        onSearch={onSearch}
        globalSearch={globalSearch}
        searchFields={getSearchFields()}
        onFilterChange={handleFilterChange}
        pageSizeLimit={pageSize}
        totalRecords={data?.totalCount}
        title={"Birth-registration"}
        iconName={"calender"}
        currentPage={parseInt(pageOffset / pageSize)}
        onNextPage={fetchNextPage}
        onPrevPage={fetchPrevPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default Inbox;