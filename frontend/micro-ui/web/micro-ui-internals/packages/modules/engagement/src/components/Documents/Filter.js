import React, { useState } from "react";
import { CloseSvg, Loader, SubmitBar, Dropdown, RefreshIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";


const Filter = ({ type = "desktop", onClose, onSearch, onFilterChange, searchParams }) => {
    const { t } = useTranslation();
    const [localSearchParams, setLocalSearchParams] = useState(() => ({ ...searchParams }));
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = tenantId?.split('.')[0];
    const currrentUlb = Digit.ULBService.getCurrentUlb();
    const { data: categoryData, isLoading } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", ["UlbLevelCategories"], {
        select: (d) => {
            const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => e.ulb === currrentUlb.code);
            return data[0].categoryList.map((category) => ({ category }));
        },
    });

    const clearAll = () => {
        setLocalSearchParams({ category: null, name: null, postedBy: null, })
        onFilterChange({ category: null, name: null, postedBy: null, });
        onClose?.();
    };

    const applyLocalFilters = () => {
        onFilterChange(localSearchParams);
        onClose?.();
    };
    const handleChange = (data) => {
        setLocalSearchParams({ ...localSearchParams, ...data });
    };


    if (isLoading) {
        return (
            <Loader />
        );
    }
    return (
        <div className="filter">
            <div className="filter-card">
                <div className="heading">
                    <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
                    <div className="clearAll" onClick={clearAll}>
                        {t("ES_COMMON_CLEAR_ALL")}
                    </div>
                    {type === "desktop" && (
                        <span className="clear-search" onClick={clearAll}>
                            <RefreshIcon />
                        </span>
                    )}
                    {type === "mobile" && (
                        <span onClick={onClose}>
                            <CloseSvg />
                        </span>
                    )}
                </div>
                <div className="filter-label">{`${t('DOCUMENTS_CATEGORY_CARD_LABEL')}`}</div>
                <Dropdown
                    option={categoryData}
                    optionKey={"category"}
                    selected={localSearchParams}
                    select={value => {
                        handleChange(value)
                    }
                    }
                    t={t}
                />
                <div>
                    <SubmitBar style={{ width: '100%' }} onSubmit={() => applyLocalFilters()} label={t("ES_COMMON_APPLY")} />
                </div>
            </div>
        </div>
    )
}

export default Filter;