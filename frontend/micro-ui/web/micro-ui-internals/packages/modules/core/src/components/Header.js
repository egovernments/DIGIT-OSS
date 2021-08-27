import React from "react";

const Header = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  
  if (isLoading) return null;

  return (
    <div className="bannerHeader">
      <img className="bannerLogo" src={stateInfo?.logoUrl} />
      <p>{stateInfo?.name}</p>
    </div>
  );
}

export default Header;