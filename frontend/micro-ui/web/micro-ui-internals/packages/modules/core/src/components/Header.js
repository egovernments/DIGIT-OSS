import React from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components"

const Header = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const { t } = useTranslation()

  if (isLoading) return <Loader/>;

  return (
    <div className="bannerHeader">
      <img className="bannerLogo" src={stateInfo?.logoUrl} />
      <p>{t(`TENANT_TENANTS_${stateInfo?.code.toUpperCase()}`)}</p>
    </div>
  );
}

export default Header;