import React, { useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Header,
  Loader,
  ShareIcon,
  DownloadIcon,
  FilterIcon,
  RemoveableTag,
  MultiLink,
  EmailIcon,
  WhatsappIcon,
} from "@egovernments/digit-ui-react-components";
import { startOfYear, endOfYear, format, addMonths, endOfToday } from "date-fns";
import Filters from "../components/Filters";
import Layout from "../components/Layout";
import FilterContext from "../components/FilterContext";
import { useParams } from "react-router-dom";

const key = 'DSS_FILTERS';

const getInitialRange = () => {
  const data = Digit.SessionStorage.get(key);
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : addMonths(startOfYear(new Date()), 3);
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : endOfToday();
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const duration = Digit.Utils.dss.getDuration(startDate, endDate);
  const denomination = data?.denomination || "Unit";
  const tenantId = data?.filters?.tenantId || []
  return { startDate, endDate, title, duration, denomination, tenantId };
};

const DashBoard = ({ stateCode }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate, title, duration, denomination, tenantId } = getInitialRange();
    return {
      denomination,
      range: { startDate, endDate, title, duration},
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: duration,
        title: title,
      },
      filters: {
        tenantId,
      }
    }
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { moduleCode } = useParams();

  const language = Digit.StoreData.getCurrentLanguage();

  const { isLoading: localizationLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const { data: screenConfig } = Digit.Hooks.dss.useMDMS(stateCode, "dss-dashboard", "DssDashboard");
  const { data: response, isLoading } = Digit.Hooks.dss.useDashboardConfig(moduleCode);
  const { data: ulbTenants, isLoading: isUlbLoading } = Digit.Hooks.useModuleTenants("FSM");
  const { isLoading: isMdmsLoading, data: mdmsData } = Digit.Hooks.useCommonMDMS(stateCode, "FSM", "FSTPPlantInfo");
  const [showOptions, setShowOptions] = useState(false);

  const handleFilters = (data) => {
    Digit.SessionStorage.set(key, data);
    setFilters(data);
  }
  const fullPageRef = useRef();
  const provided = useMemo(
    () => ({
      value: filters,
      setValue: handleFilters,
      ulbTenants,
      fstpMdmsData: mdmsData
    }),
    [filters, isUlbLoading, isMdmsLoading]
  );
  const handlePrint = () => Digit.Download.PDF(fullPageRef, t(dashboardConfig?.[0]?.name));

  const removeULB = (id) => {
    handleFilters({ ...filters, filters: { ...filters?.filters, tenantId: [...filters?.filters?.tenantId].filter((tenant, index) => index !== id) } });
  };

  const handleClear = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, tenantId: [] } });
  };

  const dashboardConfig = response?.responseData;

  const shareOptions = navigator.share
    ? [
        {
          label: t("ES_DSS_SHARE_PDF"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
            }, 500)
          },
        },
        {
          label: t("ES_DSS_SHARE_IMAGE"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
            }, 500)
          },
        },
      ]
    : [
        {
          icon: <EmailIcon />,
          label: t("ES_DSS_SHARE_PDF"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
            }, 500)
          },
        },
        {
          icon: <WhatsappIcon />,
          label: t("ES_DSS_SHARE_PDF"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
            }, 500)
          },
        },
        {
          icon: <EmailIcon />,
          label: t("ES_DSS_SHARE_IMAGE"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
            }, 500)
          },
        },
        {
          icon: <WhatsappIcon />,
          label: t("ES_DSS_SHARE_IMAGE"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
            }, 500)
          },
        },
      ];

  if (isLoading || isUlbLoading || localizationLoading || isMdmsLoading) {
    return <Loader />;
  }

  return (
    <FilterContext.Provider value={provided}>
      <div ref={fullPageRef}>
        <div className="options">
          <Header styles={{ marginBottom: "0px" }}>{t(dashboardConfig?.[0]?.name)}</Header>
          <div>
            <div className="mrlg">
              <MultiLink
                className="multilink-block-wrapper"
                label={t(`ES_DSS_SHARE`)}
                icon={<ShareIcon className="mrsm" />}
                showOptions={(e) => setShowOptions(e)}
                onHeadClick={(e) => setShowOptions(e !== undefined ? e : !showOptions)}
                displayOptions={showOptions}
                options={shareOptions}
              />
            </div>
            <div className="mrsm" onClick={handlePrint}>
              <DownloadIcon className="mrsm" />
              {t(`ES_DSS_DOWNLOAD`)}
            </div>
          </div>
        </div>
        <Filters t={t} ulbTenants={ulbTenants} isOpen={isFilterModalOpen} closeFilters={() => setIsFilterModalOpen(false)} />
        {filters?.filters?.tenantId.length > 0 && (
          <div className="tag-container">
            {filters?.filters?.tenantId?.map((filter, id) => (
              <RemoveableTag key={id} text={`${t(`DSS_HEADER_ULB`)}: ${t(filter)}`} onClick={() => removeULB(id)} />
            ))}
            <p className="clearText cursorPointer" onClick={handleClear}>
              {t(`DSS_FILTER_CLEAR`)}
            </p>
          </div>
        )}
        <div className="options-m">
          <div>
            <FilterIcon onClick={() => setIsFilterModalOpen(!isFilterModalOpen)} style />
          </div>
          <div>
            <MultiLink
              className="multilink-block-wrapper"
              label={t(`ES_DSS_SHARE`)}
              icon={<ShareIcon className="mrsm" />}
              showOptions={(e) => setShowOptions(e)}
              onHeadClick={(e) => setShowOptions(e !== undefined ? e : !showOptions)}
              displayOptions={showOptions}
              options={shareOptions}
            />
          </div>
          <div>
            <DownloadIcon />
            {t(`ES_DSS_DOWNLOAD`)}
          </div>
        </div>
        {dashboardConfig?.[0]?.visualizations.map((row, key) => {
          return <Layout rowData={row} key={key} />;
        })}
      </div>
    </FilterContext.Provider>
  );
};

export default DashBoard;
