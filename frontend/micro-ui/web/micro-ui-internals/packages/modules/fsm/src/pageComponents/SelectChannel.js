import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectChannel = ({ t, config, onSelect, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  const { data: channelMenu } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "EmployeeApplicationChannel");
  const [channel, setChannel] = useState(formData?.channel);

  function selectChannel(value) {
    setChannel(value);
    onSelect(config.key, value);
  }

  return channelMenu ? (
    <Dropdown
      option={channelMenu}
      optionKey="i18nKey"
      id="channel"
      selected={channel}
      select={selectChannel}
      t={t}
      disable={editScreen}
      autoFocus={!editScreen}
    />
  ) : (
    <Loader />
  );
};

export default SelectChannel;
