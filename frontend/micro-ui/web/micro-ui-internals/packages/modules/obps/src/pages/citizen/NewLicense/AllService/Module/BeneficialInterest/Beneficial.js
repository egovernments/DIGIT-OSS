import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import FileUpload from "@mui/icons-material/FileUpload";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../../../docView/docView.help";
import axios from "axios";
import CusToaster from "../../../../../../components/Toaster";

function Beneficial() {
  const [applicantId, setApplicantId] = useState("");
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [beneficialInterestLabel, setBeneficialInterestLabel] = useState([]);
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  // const beneficialNew = (data) => console.log(data);
  const beneficialNew = async (data) => {
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};
    try {
      const postDistrict = {
        changeBeneficial: [
          {
            ...data,
          },
        ],
        RequestInfo: {
          apiId: "Rainmaker",
          msgId: "1669293303096|en_IN",
          authToken: token,
          userInfo: userInfo,
        },
      };
      const Resp = await axios.post("/tl-services/beneficial/_create", postDistrict);
      setBeneficialInterestLabel(Resp.data);
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {
      setLoader(false);
      setToastError(error?.response?.data?.Errors?.[0]?.code);
      setTimeout(() => {
        setToastError(null);
      }, 2000);
      return error.message;
    }
  };
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(false);
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

  return (
    <div>
      <form onSubmit={handleSubmit(beneficialNew)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>CHANGE IN BENEFICIAL INTEREST</h4>
          <div className="card">
            <div className="row-12">
              <div className="col md={4} xxl lg-4">
                <FormControl>
                  <h2 className="FormLable"> Licence No </h2>

                  <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("applicationNumber")} />
                </FormControl>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2 className="FormLable">Select Service</h2>

                  <select className="Inputcontrol" class="form-control" {...register("developerServiceCode")} onChange={(e) => handleshowhide(e)}>
                    <option value=" ">----Select value-----</option>
                    <option value="1">(a)Change of Developer</option>
                    <option value="2">(b) Joint Development and/or Marketing rights</option>
                    <option value="3">(c)Change in Share Holding Pattern</option>
                  </select>
                </FormControl>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2 className="FormLable">Amount</h2>

                  <OutlinedInput type="text" className="Inputcontrol" disabled {...register("amount")} />
                </FormControl>
                <div className="col md={4} xxl lg-4">
                  <div>
                    {showhide === "2" && (
                      <div>
                        <h2 className="FormLable"> Area in Acres</h2>

                        <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("areaInAcres")} />
                      </div>
                    )}
                  </div>
                </div>
                <br />
                <div className="row-12">
                  <div>
                    {showhide === "1" && (
                      // <div className="card">
                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">Sr.No</th>
                            <th class="fw-normal">Field Name</th>
                            <th class="fw-normal">Upload Documents</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th class="fw-normal">1</th>
                            <td>
                              No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated
                              for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                              change/assignmen
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
                              {/* <input type="file" className="fom-control" placeholder="" {...register("objectionCertificate")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">2</th>
                            <td> A consent letter from the new entity for the proposed change </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetter")}
                                />

                                {fileStoreId?.consentLetter ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.consentLetter)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("consentLetterFileName") ? watch("consentLetterFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("consentLetter")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">3</th>
                            <td> Justification for such request. </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "justification")}
                                />

                                {fileStoreId?.justification ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.justification)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("justificationFileName") ? watch("justificationFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("justification")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">4</th>
                            <td>
                              {" "}
                              The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                              been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyRights")}
                                />

                                {fileStoreId?.thirdPartyRights ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.thirdPartyRights)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("thirdPartyRightsFileName") ? watch("thirdPartyRightsFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("thirdPartyRights")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">5</th>
                            <td>
                              {" "}
                              Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                              ‘shareholder(s)’ as per prescribed policy parameters for grant of license.
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "fiancialCapacity")}
                                />

                                {fileStoreId?.fiancialCapacity ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.fiancialCapacity)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("fiancialCapacityFileName") ? watch("fiancialCapacityFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("fiancialCapacity")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">6</th>
                            <td> An undertaking to pay the balance administrative charges before final approval.</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "aministrativeChargeCertificates")}
                                />

                                {fileStoreId?.aministrativeChargeCertificates ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.aministrativeChargeCertificates)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>
                                  {watch("aministrativeChargeCertificatesFileName") ? watch("aministrativeChargeCertificatesFileName") : null}
                                </h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("aministrativeChargeCertificates")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">7</th>
                            <td> Status of RERA registration of project of non registered,then affidavit to this effect.</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "reraRegistration")}
                                />

                                {fileStoreId?.reraRegistration ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.reraRegistration)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("reraRegistrationFileName") ? watch("reraRegistrationFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("reraRegistration")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">8</th>
                            <td> Board resolution of authorised signatory of “existing developer </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionExisting")}
                                />

                                {fileStoreId?.boardResolutionExisting ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.boardResolutionExisting)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("boardResolutionExistingFileName") ? watch("boardResolutionExistingFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("boardResolutionExisting")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">9</th>
                            <td>
                              {" "}
                              Board resolution of authorised signatory of “new entity ”<span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionNewEntity")}
                                />

                                {fileStoreId?.boardResolutionNewEntity ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.boardResolutionNewEntity)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("boardResolutionNewEntityFileName") ? watch("boardResolutionNewEntityFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("boardResolutionNewEntity")}></input> */}
                            </td>
                          </tr>
                        </tbody>
                      </div>
                      // </div>
                    )}
                  </div>
                  <div>
                    {showhide === "2" && (
                      // <div className="card">
                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">Sr.No</th>
                            <th class="fw-normal">Field Name</th>
                            <th class="fw-normal">Upload Documents</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th class="fw-normal">1</th>
                            <td>
                              No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated
                              for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                              change/assignment
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "noObjectionCertificate")}
                                />

                                {fileStoreId?.noObjectionCertificate ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.noObjectionCertificate)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("noObjectionCertificateFileName") ? watch("noObjectionCertificateFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("noObjectionCertificate")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">2</th>
                            <td> A consent letter from the new entity for the proposed change. </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetter")}
                                />

                                {fileStoreId?.consentLetter ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.consentLetter)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("consentLetterFileName") ? watch("consentLetterFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("consentLetter")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">3</th>
                            <td> Justification for such request.</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "justificationRequest")}
                                />

                                {fileStoreId?.justificationRequest ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.justificationRequest)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("justificationRequestFileName") ? watch("justificationRequestFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("justificationRequest")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">4</th>
                            <td>
                              {" "}
                              The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                              been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyclaimed")}
                                />

                                {fileStoreId?.thirdPartyclaimed ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.thirdPartyclaimed)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("thirdPartyclaimedFileName") ? watch("thirdPartyclaimedFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("thirdPartyclaimed")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">5</th>
                            <td> Details of the applied area where joint development and /or marketing rights are to be assigned</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyclaimedFileName")}
                                />

                                {fileStoreId?.thirdPartyclaimedFileName ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.thirdPartyclaimedFileName)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("thirdPartyclaimedFileNameFileName") ? watch("thirdPartyclaimedFileNameFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("jointDevelopment")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">6</th>
                            <td> An undertaking to pay the balance administrative charges before final approval.</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "balanceAministrative")}
                                />

                                {fileStoreId?.balanceAministrative ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.balanceAministrative)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("balanceAministrativeFileName") ? watch("balanceAministrativeFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("balanceAministrative")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">7</th>
                            <td> Board resolution of authorised signatory of “existing developer”.</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionDeveloper")}
                                />

                                {fileStoreId?.boardResolutionDeveloper ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.boardResolutionDeveloper)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("boardResolutionDeveloperFileName") ? watch("boardResolutionDeveloperFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("boardResolutionDeveloper")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">8</th>
                            <td> Board resolution of authorised signatory of “new entity ”</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionEntity")}
                                />

                                {fileStoreId?.boardResolutionEntity ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.boardResolutionEntity)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("boardResolutionEntityFileName") ? watch("boardResolutionEntityFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("boardResolutionEntity")}></input> */}
                            </td>
                          </tr>
                        </tbody>
                      </div>
                      // </div>
                    )}
                  </div>
                  <div>
                    {showhide === "3" && (
                      // <div className="card">

                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">Sr.No</th>
                            <th class="fw-normal">Field Name</th>
                            <th class="fw-normal">Upload Documents</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th class="fw-normal">1</th>
                            <td>
                              No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated
                              for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                              change/assignment
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "proposedAssigment")}
                                />

                                {fileStoreId?.proposedAssigment ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.proposedAssigment)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("proposedAssigmentFileName") ? watch("proposedAssigmentFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("proposedAssigment")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">2</th>
                            <td> Justification for such request </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "justificationRequest")}
                                />

                                {fileStoreId?.justificationRequest ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.justificationRequest)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("justificationRequestFileName") ? watch("justificationRequestFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("justificationRequest")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">3</th>
                            <td>
                              {" "}
                              The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                              been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "creationThirdParty")}
                                />

                                {fileStoreId?.creationThirdParty ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.creationThirdParty)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("creationThirdPartyFileName") ? watch("creationThirdPartyFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("creationThirdParty")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">4</th>
                            <td>
                              {" "}
                              Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                              ‘shareholder(s)’ as per prescribed policy parameters for grant of license
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "technicalAndFinancial")}
                                />

                                {fileStoreId?.technicalAndFinancial ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.technicalAndFinancial)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("technicalAndFinancialFileName") ? watch("technicalAndFinancialFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("technicalAndFinancial")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">5</th>
                            <td> An undertaking to pay the balance administrative charges before final approval </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "aministrativeChargeCertificatesApproval")}
                                />

                                {fileStoreId?.aministrativeChargeCertificatesApproval ? (
                                  <a
                                    onClick={() => getDocShareholding(fileStoreId?.aministrativeChargeCertificatesApproval)}
                                    className="btn btn-sm "
                                  ></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>
                                  {watch("aministrativeChargeCertificatesApprovalFileName")
                                    ? watch("aministrativeChargeCertificatesApprovalFileName")
                                    : null}
                                </h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("aministrativeChargeCertificatesApproval")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">6</th>
                            <td> Proposed Shareholding Pattern of the developer company.</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "shareholdingPattern")}
                                />

                                {fileStoreId?.shareholdingPattern ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.shareholdingPattern)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("shareholdingPatternFileName") ? watch("shareholdingPatternFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("shareholdingPattern")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">7</th>
                            <td> Status of RERA registration of project of non registered,then affidavit to this effect.</td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "statusOfRera")}
                                />

                                {fileStoreId?.statusOfRera ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.statusOfRera)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("statusOfReraFileName") ? watch("statusOfReraFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("statusOfRera")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">8</th>
                            <td> Board resolution of authorised signatory of “existing developer” </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionAuthorized")}
                                />

                                {fileStoreId?.boardResolutionAuthorized ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.boardResolutionAuthorized)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("boardResolutionAuthorizedFileName") ? watch("boardResolutionAuthorizedFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("boardResolutionAuthorized")}></input> */}
                            </td>
                          </tr>
                          <tr>
                            <th class="fw-normal">9</th>
                            <td>
                              {" "}
                              Board resolution of authorised signatory of “new entity ”<span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="application/pdf/jpeg/png"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionSignatory")}
                                />

                                {fileStoreId?.boardResolutionSignatory ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.boardResolutionSignatory)} className="btn btn-sm "></a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("boardResolutionSignatoryFileName") ? watch("boardResolutionSignatoryFileName") : null}</h3>
                              </div>
                              {/* <input type="file" className="fom-control" placeholder="" {...register("boardResolutionSignatory")}></input> */}
                            </td>
                          </tr>
                        </tbody>
                      </div>

                      // </div>
                    )}
                  </div>
                </div>
                <div class="col-sm-12 text-right">
                  <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit" aria-label="right-end">
                    Pay
                  </Button>{" "}
                  &nbsp;
                  <Button variant="contained" class="btn btn-primary btn-md center-block" type="save" aria-label="right-end">
                    Save as Draft
                  </Button>{" "}
                  &nbsp;
                  <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit" aria-label="right-end">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {showToastError && (
        <CusToaster
          label={showToastError?.label}
          success={showToastError?.success}
          error={showToastError?.error}
          onClose={() => {
            setShowToastError({ label: "", success: false, error: false });
          }}
        />
      )}
    </div>
  );
}

export default Beneficial;
