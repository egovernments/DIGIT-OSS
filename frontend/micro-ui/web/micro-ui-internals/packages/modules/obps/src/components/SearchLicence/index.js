import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

// import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import ReactMultiSelect from "../../../../../react-components/src/atoms/ReactMultiSelect";

const SearchLicenceComp = ({ watch, register, control, setLoader, errors, setValue, resetField, apiData, comp, getData }) => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [showField, setShowField] = useState({ select: false, other: false });
  const [licenceData, setLicenceData] = useState([]);

  const getLicenceInternalApi = async () => {
    const token = window?.localStorage?.getItem("token");
    const licenceNumber = apiData?.length ? watch("licenceNo")?.value : watch("licenceNo");
    const loiNumber = apiData?.length ? watch("licenceNo")?.value : watch("licenceNo");
    const applicationNumber = apiData?.length ? watch("licenceNo")?.value : watch("licenceNo");
    // const  applicationNumber = watch("numberType")?.value == "LICENCENUMBER"
    setLoader(true);
    const data = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: token,
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post(
        `/tl-services/_additionalDocuments/_search?licenceNumber=${licenceNumber}&loiNumber=${loiNumber}&applicationNumber=${applicationNumber}`,
        data
      );
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  const getLicenceDetails = async () => {
    setLoader(true);
    const data = {
      Flag: watch("numberType")?.value == "LICENCENUMBER" ? 3 : 1,
      SearchParam: apiData?.length ? watch("licenceNo")?.value : watch("licenceNo"),
    };
    try {
      const Resp = await axios.post("/api/cis/GetLicenceDetails", data);
      const filteredData = Resp?.data
        .filter((item) => item.Text.includes(" of "))
        .map((item) => {
          return { label: item.Text.split(" |")[0], value: item };
        });
      setShowField({ select: true, other: false });
      const setLicData = filteredData?.map(function (data) {
        return { value: data?.value?.Text, label: data?.label };
      });

      setLicenceData(setLicData);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  const setTextValues = (val) => {
    console.log("val", val);
    // if (val) {
    const grantDate = val?.value?.split("|")?.[10];
    const validDate = val?.value?.split("|")?.[11];
    setShowField({ select: true, other: true });
    setValue("district", val?.value?.split("|")?.[3]);
    setValue("colonyType", val?.value?.split("|")?.[4]);
    setValue("colonizerName", val?.value?.split("|")?.[5]);
    setValue("developmentPlan", val?.value?.split("|")?.[6]);
    setValue("sectorNo", val?.value?.split("|")?.[7]);
    setValue("areaAcres", val?.value?.split("|")?.[9]);
    setValue("licenceGrantDate", moment(grantDate).format("YYYY-MM-DD"));
    setValue("validUpto", moment(validDate).format("YYYY-MM-DD"));
    // }
  };

  useEffect(() => {
    if (getData) {
      setValue("revenueEstate", getData?.newAdditionalDetails?.revenueEstate);
      setValue("tehsil", getData?.newAdditionalDetails?.tehsil);
      const data = licenceData?.filter((item) => item?.label === getData?.newAdditionalDetails?.selectLicence);
      setValue("selectLicence", { label: data?.[0]?.label, value: data?.[0]?.value });
      // watch()
      setTextValues({ label: data?.[0]?.label, value: data?.[0]?.value });
    }
  }, [getData, licenceData]);

  useEffect(() => {
    if (watch("licenceNo")) getLicenceDetails();
  }, [watch("licenceNo")]);

  return (
    <div>
      <div className="row gy-3">
        <div className="col col-4">
          <h2>
            {`${t("LC_LICENCE_NO")}`}
            {/* Licence No. */}
            <span style={{ color: "red" }}>*</span>
          </h2>
          <div style={{ display: "flex", placeItems: "center" }}>
            {apiData?.length ? (
              <ReactMultiSelect control={control} name="licenceNo" placeholder="Select number" data={apiData} labels="" />
            ) : (
              <input
                type="text"
                className="form-control"
                placeholder="lc-XXXXX"
                {...register("licenceNo")}
                onChange={() => {
                  setShowField({ select: false, other: false });
                  resetField("selectLicence");
                }}
              />
            )}
            <div
              style={{
                background: "#024f9d",
                color: "white",
                borderRadius: "5px",
                padding: " 5px 15px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                getLicenceDetails();
                getLicenceInternalApi();
              }}
            >
              {`${t("LC_GO")}`}
              {/* Go */}
            </div>
          </div>
          <h3 className="error-message" style={{ color: "red" }}>
            {errors?.licenceNo && errors?.licenceNo?.message}
          </h3>
        </div>

        {showField?.select && (
          <div className="col col-3 ">
            <h2>
              {`${t("LC_SELECT_LICENCE")}`}
              {/* Select Licence */}
              <span style={{ color: "red" }}>*</span>
            </h2>
            <ReactMultiSelect
              control={control}
              name="selectLicence"
              placeholder="Select Licence"
              data={licenceData}
              onChange={(e) => setTextValues(e)}
              labels=""
            />
          </div>
        )}
      </div>

      {showField.other && (
        <div className="row gy-3 mt-3">
          <div className="col col-3 ">
            <FormControl>
              <h2>
                {`${t("LC_LICENCE_GRANT_DATE")}`}
                {/* Licence Grant Date  */}
                <span style={{ color: "red" }}>*</span>
              </h2>
              <input type="date" className="form-control" placeholder="" {...register("licenceGrantDate")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.licenceGrantDate && errors?.licenceGrantDate?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>
                {`${t("LC_VALID_UPTO")}`}
                {/* Valid Upto  */}
                <span style={{ color: "red" }}>*</span>
              </h2>
              <input type="date" className="form-control" placeholder="" {...register("validUpto")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.validUpto && errors?.validUpto?.message}
            </h3>
          </div>
          {comp == "renewal" && (
            <div className="col col-3 ">
              <FormControl>
                <h2>
                  {`${t("LC_RENEWAL_REQUIRED_UPTO ")}`}
                  {/* Renewal required upto  */}
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <input
                  type="date"
                  {...register("renewalRequiredUpto")}
                  className="form-control"
                  onChange={(e) => {
                    const dateA = new Date(e?.target?.value);
                    const dateB = new Date(watch("validUpto"));

                    const monthDiff = dateA.getMonth() - dateB.getMonth();
                    const yearDiff = dateA.getYear() - dateB.getYear();

                    const diff = monthDiff + yearDiff * 12;
                    setValue("periodOfRenewal", diff);
                  }}
                />
              </FormControl>
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.renewalRequiredUpto && errors?.renewalRequiredUpto?.message}
              </h3>
            </div>
          )}
          {comp == "renewal" && (
            <div className="col col-3 ">
              <FormControl>
                <h2>
                  {`${t("LC_PERIOD_OF_RENEWAL_IN_MONTHS")}`}
                  {/* Period of renewal(In Months) */}
                </h2>
                <input type="text" {...register("periodOfRenewal")} className="form-control" disabled />
              </FormControl>
            </div>
          )}
          <div className="col col-3 ">
            <FormControl>
              <h2>
                {`${t("LC_NAME_OF_COLONIZER")}`}
                {/* Name of Colonizer  */}
                <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("colonizerName")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonizerName && errors?.colonizerName?.message}
            </h3>
          </div>
        </div>
      )}

      {showField.other && (
        <div className="row gy-3 mt-3">
          <div className="col col-3 ">
            <FormControl>
              <h2>
                {`${t("LC_TYPE_OF_COLONY")}`}
                {/* Type of Colony */}
                <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("colonyType")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonyType && errors?.colonyType?.message}
            </h3>
          </div>

          <div className="col col-3 ">
            <FormControl>
              <h2>
                {`${t("LC_AREA_IN_ACRES")}`}
                {/* Area in Acres */}
                <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("areaAcres")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.areaAcres && errors?.areaAcres?.message}
            </h3>
          </div>

          <div className="col col-3 ">
            <FormControl>
              <h2>
                {`${t("LC_SECTOR_NO")}`}
                {/* Sector No.  */}
                <span style={{ color: "red" }}>*</span>
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("sectorNo")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.sectorNo && errors?.sectorNo?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>
                {`${t("LC_REVENUE_ESTATE")}`}
                {/* Revenue estate */}
              </h2>

              <input type="text" className="form-control" placeholder="" {...register("revenueEstate")} />
            </FormControl>
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.revenueEstate && errors?.revenueEstate?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            {`${t("LC_DEVELOPMENT_PLAN")}`}
            {/* Development Plan */}
            <input type="text" className="form-control" placeholder="" {...register("developmentPlan")} />
            {/* auto pull land schedule table from new licence here */}
          </div>
        </div>
      )}

      <div className="row gy-3 mt-3">
        <div className="col col-3 ">
          <FormControl>
            <h2>
              {`${t("LC_TEHSIL")}`}
              {/* Tehsil */}
            </h2>
            <input type="text" className="form-control" placeholder="" {...register("tehsil")} />
          </FormControl>
        </div>
        <div className="col col-3 ">
          <FormControl>
            <h2>
              {`${t("LC_DISTRICT")}`}
              {/* District */}
            </h2>
            <input type="text" className="form-control" placeholder="" {...register("district")} />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default SearchLicenceComp;
