import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getDocShareholding } from "../../../docView/docView.help";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";

const selectTypeData = [
  { label: "Complete", value: "complete" },
  { label: "Partial", value: "partial" },
];

const TransferLicense = () => {
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const transferLic = async (data) => {
    console.log("data", data);
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};
    try {
      const postDistrict = {
        Transfer: {
          ...data,
        },

        RequestInfo: {
          apiId: "Rainmaker",
          ver: ".01",
          ts: null,
          action: "_update",
          did: "1",
          key: "",
          msgId: "20170310130900|en_IN",
          authToken: token,
        },
      };
      const Resp = await axios.post("/tl-services/TransferOfLicenseRequest/_create", postDistrict);
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {}
  };

  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ key: "error" });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      // if (fieldName === "uploadBg") {
      //   setValue("uploadBgFileName", file.name);
      // }
      // if (fieldName === "tcpSubmissionReceived") {
      //   setValue("tcpSubmissionReceivedFileName", file.name);
      // }
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToast({ key: "success" });
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  useEffect(() => {
    console.log("watch", watch("selectType")?.value);
  }, [watch("selectType")?.value]);

  return (
    <form onSubmit={handleSubmit(transferLic)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
          Transfer of Licence
        </h4>
        <div className="card">
          <div className="row gy-3">
            <div className="col col-3">
              <h2 className="FormLable">
                Licence No. <span style={{ color: "red" }}>*</span>
              </h2>
              <input type="text" className="Inputcontrol" {...register("licenseNo")} />
            </div>
            <div className="col col-3">
              <h2 className="FormLable">
                Select Type (Complete or Partial) <span style={{ color: "red" }}>*</span>
              </h2>
              <ReactMultiSelect control={control} name="selectType" placeholder="Select Type" data={selectTypeData} labels="" />
            </div>
            {watch("selectType")?.value == "partial" && (
              <div className="col col-3">
                <div className="">
                  <h2 className="FormLable">
                    Area in Acres <span style={{ color: "red" }}>*</span>
                  </h2>
                  <input type="number" placeholder="" className="form-control" {...register("areaInAcres")} />
                </div>
              </div>
            )}
            <div className="col col-5">
              <h2>
                Have you transferred licence from licencee land owner in favor of collaborator without prior approval of competent authority
                <span style={{ color: "red" }}>*</span>
              </h2>
              <label htmlFor="licenceTransferredFromLandOwnyes">
                &nbsp;&nbsp;
                <input {...register("licenceTransferredFromLandOwn")} type="radio" value="yes" id="licenceTransferredFromLandOwnyes" /> &nbsp; Yes
              </label>
              <label htmlFor="licenceTransferredFromLandOwnno">
                &nbsp;&nbsp;
                <input {...register("licenceTransferredFromLandOwn")} type="radio" value="no" id="licenceTransferredFromLandOwnno" /> &nbsp; No
              </label>
            </div>
            <div className="col col-5">
              <h2>
                Have you transferred title of land requiring amendment in land schedule without prior approval of competent authority
                <span style={{ color: "red" }}>*</span>
              </h2>
              <label htmlFor="transferredTitleOfLandyes">
                &nbsp;&nbsp;
                <input {...register("transferredTitleOfLand")} type="radio" value="yes" id="transferredTitleOfLandyes" /> &nbsp; Yes
              </label>
              <label htmlFor="transferredTitleOfLandno">
                &nbsp;&nbsp;
                <input {...register("transferredTitleOfLand")} type="radio" value="no" id="transferredTitleOfLandno" /> &nbsp; No
              </label>
            </div>

            <div className="col col-5">
              <h2>
                Do you want to apply for Change of Developer
                <span style={{ color: "red" }}>*</span>
              </h2>
              <label htmlFor="changeOfDeveloperyes">
                &nbsp;&nbsp;
                <input {...register("changeOfDeveloper")} type="radio" value="yes" id="changeOfDeveloperyes" /> &nbsp; Yes
              </label>
              <label htmlFor="changeOfDeveloperno">
                &nbsp;&nbsp;
                <input {...register("changeOfDeveloper")} type="radio" value="no" id="changeOfDeveloperno" /> &nbsp; No
              </label>
            </div>

            <div className="col col-3">
              <h2 className="FormLable">
                Amount <span style={{ color: "red" }}>*</span>
              </h2>
              <input type="text" className="Inputcontrol" {...register("amount")} disabled />
            </div>
          </div>

          <div className="row-12">
            <div>
              <div className="card">
                <div class="bordere">
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Sr.No</th>
                          <th scope="col">Field Name</th>
                          <th scope="col">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* for a,b */}
                        {(watch("selectType")?.value == "partial" || watch("selectType")?.value == "complete") && (
                          <tr>
                            <th class="fw-normal">1</th>
                            <td>
                              Affidavit regarding the creation of 3rd party right on the licensed area
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "undertakingThirdParty")}
                                />

                                {watch("undertakingThirdParty") && (
                                  <a onClick={() => getDocShareholding(watch("undertakingThirdParty"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("undertakingThirdParty")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for a,b */}
                        {(watch("selectType")?.value == "partial" || watch("selectType")?.value == "complete") && (
                          <tr>
                            <th class="fw-normal">2</th>
                            <td>
                              The colonizer seeking transfer of whole license/part license shall submit self-certification along with a certificate of
                              the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time of submission of
                              application for transfer of license <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "colonizerSeeking")}
                                />

                                {watch("colonizerSeeking") && (
                                  <a onClick={() => getDocShareholding(watch("colonizerSeeking"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("colonizerSeeking")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for c */}
                        {watch("changeOfDeveloper") == "yes" && (
                          <tr>
                            <th class="fw-normal">3</th>
                            <td>
                              A consent letter from the ‘new entity for the proposed change along with a justification
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetter")}
                                />

                                {watch("consentLetter") && (
                                  <a onClick={() => getDocShareholding(watch("consentLetter"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("consentLetter")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for a,b,c */}
                        {(watch("selectType")?.value == "partial" ||
                          watch("selectType")?.value == "complete" ||
                          watch("changeOfDeveloper") == "yes") && (
                          <tr>
                            <th class="fw-normal">4</th>
                            <td>
                              {" "}
                              Board resolution of authorized signatory <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolution")}
                                />

                                {watch("boardResolution") && (
                                  <a onClick={() => getDocShareholding(watch("boardResolution"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("boardResolution")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for a,b,c */}
                        {(watch("selectType")?.value == "partial" ||
                          watch("selectType")?.value == "complete" ||
                          watch("changeOfDeveloper") == "yes") && (
                          <tr>
                            <th class="fw-normal">5</th>
                            <td>
                              No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated
                              for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                              change/assignment.
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "objectionCertificate")}
                                />

                                {watch("objectionCertificate") && (
                                  <a onClick={() => getDocShareholding(watch("objectionCertificate"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("objectionCertificate")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for c */}
                        {watch("changeOfDeveloper") == "yes" && (
                          <tr>
                            <th class="fw-normal">6</th>
                            <td>
                              Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                              ‘shareholder(s)’ as per prescribed policy parameters for grant of a license<span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "technicalFinancialCapacity")}
                                />

                                {watch("technicalFinancialCapacity") && (
                                  <a onClick={() => getDocShareholding(watch("technicalFinancialCapacity"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("technicalFinancialCapacity")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for c */}
                        {watch("changeOfDeveloper") == "yes" && (
                          <tr>
                            <th class="fw-normal">7</th>
                            <td>
                              An affidavit to pay the balance of administrative charges before final approval
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "undertakingBalance")}
                                />

                                {watch("undertakingBalance") && (
                                  <a onClick={() => getDocShareholding(watch("undertakingBalance"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("undertakingBalance")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for c */}
                        {watch("changeOfDeveloper") == "yes" && (
                          <tr>
                            <th class="fw-normal">8</th>
                            <td>
                              Justification for request
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "justificationRequest")}
                                />

                                {watch("justificationRequest") && (
                                  <a onClick={() => getDocShareholding(watch("justificationRequest"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("justificationRequest")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for c */}
                        {watch("changeOfDeveloper") == "yes" && (
                          <tr>
                            <th class="fw-normal">9</th>
                            <td>
                              An affidavit to the effect that in case the administrative charges for such cases are fixed in act and rules at a rate
                              higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded by TCP
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "administrativeCharges")}
                                />

                                {watch("administrativeCharges") && (
                                  <a onClick={() => getDocShareholding(watch("administrativeCharges"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("administrativeCharges")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for a,b,c */}
                        {(watch("selectType")?.value == "partial" ||
                          watch("selectType")?.value == "complete" ||
                          watch("changeOfDeveloper") == "yes") && (
                          <tr>
                            <th class="fw-normal">10</th>
                            <td>
                              The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                              been created in the colony, an affidavit to the said effect be also submitted by the existing developer
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "statusRegarding")}
                                />

                                {watch("statusRegarding") && (
                                  <a onClick={() => getDocShareholding(watch("statusRegarding"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                        {/* for a,b,c */}
                        {(watch("selectType")?.value == "partial" ||
                          watch("selectType")?.value == "complete" ||
                          watch("changeOfDeveloper") == "yes") && (
                          <tr>
                            <th class="fw-normal">11</th>
                            <td>
                              {" "}
                              Status regarding registration of project in RERA
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "registrationStatus")}
                                />

                                {watch("registrationStatus") && (
                                  <a onClick={() => getDocShareholding(watch("registrationStatus"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("registrationStatus")}></input> */}
                            </td>
                          </tr>
                        )}
                        {/* for a,bc, */}
                        {(watch("selectType")?.value == "partial" ||
                          watch("selectType")?.value == "complete" ||
                          watch("changeOfDeveloper") == "yes") && (
                          <tr>
                            <th class="fw-normal">12</th>
                            <td>
                              {" "}
                              Any Other Document <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "otherDocument")}
                                />

                                {watch("otherDocument") && (
                                  <a onClick={() => getDocShareholding(watch("otherDocument"), setLoader)} className="btn btn-sm "></a>
                                )}
                              </div>
                              {/* <input type="file" placeholder="" className="form-control" {...register("otherDocument")}></input> */}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TransferLicense;
