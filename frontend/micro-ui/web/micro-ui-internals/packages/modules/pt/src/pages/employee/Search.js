import { Header } from "@egovernments/digit-ui-react-components";
import React, { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const PTSearchFields = {
  searchId: {
    propertyIds: {
      type: "text",
      label: "PT_PROPERTY_UNIQUE_ID",
      placeHolder: "PT_PROPERTY_UNIQUE_ID_PLACEHOLDER",
      validation: {
        pattern: {
          value: /^[a-zA-Z0-9-]*$/i,
          message: "ERR_INVALID_PROPERTY_ID",
        },
      },
    },
    mobileNumber: {
      type: "number",
      label: "PT_HOME_SEARCH_RESULTS_OWN_MOB_LABEL",
      placeHolder: "PT_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER",
      validation: {
        minLength: {
          value: 10,
          message: "CORE_COMMON_MOBILE_ERROR",
        },
        maxLength: {
          value: 10,
          message: "CORE_COMMON_MOBILE_ERROR",
        },
        pattern: {
          value: /[789][0-9]{9}/,
          message: "CORE_COMMON_MOBILE_ERROR",
        },
      },
    },
    oldPropertyId: {
      type: "text",
      label: "PT_EXISTING_PROPERTY_ID",
      placeholder: "PT_EXISTING_PROPERTY_ID_PLACEHOLDER",
      validation: {
        pattern: {
          value: /^[a-zA-Z0-9-]*$/i,
          message: "ERR_INVALID_PROPERTY_ID",
        },
      },
    },
    // acknowledgementIds: {
    //   type: "text",
    //   label: "PT_PROPERTY_APPLICATION_NO",
    //   placeholder: "PT_PROPERTY_APPLICATION_NO_PLACEHOLDER",
    //   validation: {
    //     pattern: {
    //       value: /^[a-zA-Z0-9-]*$/i,
    //       message: "ERR_INVALID_PROPERTY_ID",
    //     },
    //   },
    // }
  },
  searchDetail: {
    doorNo: {
      type: "text",
      label: "PT_SEARCHPROPERTY_TABEL_DOOR_NO",
      placeHolder: "PT_SEARCH_DOOR_NO_PLACEHOLDER",
      validation: {
        pattern: {
          value: /^[^\$\"'<>?~`!@$%^={}\[\]*:;“”‘’]{1,50}$/i,
          message: "CORE_COMMON_MOBILE_ERROR",
        },
      },
    },
    name: {
      type: "text",
      label: "PT_SEARCHPROPERTY_TABEL_OWNERNAME",
      placeHolder: "PT_SEARCH_OWNER_NAME_PLACEHOLDER",
      validation: {
        minLength: {
          value: 3,
          message: "PT_MIN_3CHAR",
        },
        // pattern: {
        //   value: '/^[^{0-9}^$"<>?\\\\~!@#$%^()+={}[]*,/_:;“”‘’]{3,50}$/i',
        //   message: "CORE_COMMON_MOBILE_ERROR",
        // },
      },
    },
    locality: {
      type: "text",
      label: "PT_SEARCH_LOCALITY",
      placeHolder: "PT_SEARCH_LOCALITY_PLACEHOLDER",
      validation: {
        required: "PTLOCALITYMANDATORY",
      },
    },
  },
};

const Search = ({ path }) => {
  const { variant } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [payload, setPayload] = useState({});
  const [searchBy, setSearchBy] = useState("searchId");

  const SearchComponent = memo(Digit.ComponentRegistryService.getComponent("PropertySearchForm"));
  const SearchResultComponent = memo(Digit.ComponentRegistryService.getComponent("PropertySearchResults"));

  const onSubmit = useCallback((_data) => {
    setPayload(
      Object.keys(_data)
        .filter((k) => _data[k])
        .reduce((acc, key) => ({ ...acc, [key]: typeof _data[key] === "object" ? _data[key].code : _data[key] }), {})
    );
  });
  return (
    <React.Fragment>
      <Header>{t("SEARCH_PROPERTY")}</Header>
      <SearchComponent t={t} searchBy={searchBy} setSearchBy={setSearchBy} PTSearchFields={PTSearchFields} tenantId={tenantId} onSubmit={onSubmit} />
      {Object.keys(payload).length > 0 && <SearchResultComponent t={t} tenantId={tenantId} payload={payload} />}
    </React.Fragment>
  );
};

export default Search;
