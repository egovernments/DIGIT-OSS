import { Card, CardLabel, CardSectionHeader, CardText, Header, LabelFieldPair, LastRow, CardSectionSubText, CheckBox, Loader, TextInput, Dropdown, DatePicker, UploadFile, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, {Fragment} from "react"
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ApplicationBillAmendment = () => {
    //connectionNumber=WS/107/2021-22/227166&tenantId=pb.amritsar&service=WATER&connectionType=Metered
    const { t } = useTranslation()
    const {connectionNumber, tenantId, service, connectionType } = Digit.Hooks.useQueryParams();
    const stateId = Digit.ULBService.getStateId();
    const { isLoading: BillAmendmentMDMSLoading, data: BillAmendmentMDMS } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSMDMSBillAmendment({tenantId: stateId});
    const billSearchFilters = { tenantId, consumerCode:connectionNumber, service:"WS" }
    const {data: billSearchData, isLoading: isBillSearchLoading} = Digit.Hooks.usePaymentSearch(tenantId, billSearchFilters );
    
    // const selectFile = (e, props) => {
    //     setFile()
    //     setFileSize()
    //     setFileType()
    //     setUploadError("")
    //     if (!e.target?.files?.length) return

    //     const size = e?.target?.files[0]?.size;
    //     const type = e?.target?.files[0]?.type;
    //     if (size && (size / 1024 / 1024) > 5) {
    //         setUploadError('FILE_SIZE_EXCEEDED')
    //         return
    //     }

    //     if (type && checkValidFileType(type)) {
    //         setFileSize(size);
    //         setFileType(type);
    //         setProps(props);
    //         setFile(e.target.files[0]);
    //         return
    //     } else {
    //         setUploadError('NOT_SUPPORTED_FILE_TYPE')
    //     }
    // };
    
    // useEffect(() => {
    //     if (file) uploadFile();
    // }, [file]);

    // useEffect(() => {
    //     if (fileStoreId) disableUrlField();
    //     else setUrlDisabled(false);
    //     controllerProps?.onChange?.({ fileStoreId, fileSize, fileType });
    // }, [fileStoreId, controllerProps]);

    // const uploadFile = async () => {
    //     try {
    //         setIsUploadingImage(true)
    //         const response = await Digit.UploadServices.Filestorage("engagement", file, Digit.ULBService.getStateId());
    //         if (response?.data?.files?.length > 0) {
    //         setFileStoreId(response?.data?.files[0]?.fileStoreId);
    //         } else {
    //         setError(t("CS_FILE_UPLOAD_ERROR"));
    //         }

    //     } catch (err) {
    //     } finally {
    //         setIsUploadingImage(false)
    //     }
    // };
    const { register, control, watch, ...methods } = useForm()
    const amendmentReason = watch("amendmentReason");
    // debugger

    return <form>
        <Header>{t("WS_BILL_AMENDMENT_BUTTON")}</Header>
        <Card>
            <LabelFieldPair>
                <CardLabel style={{fontWeight: "500"}}>{t("WS_ACKNO_CONNECTION_NO_LABEL")}</CardLabel>
                <CardText style={{marginBottom: "0px"}}>{connectionNumber}</CardText>
            </LabelFieldPair>
            <CardSectionHeader style={{marginBottom: "16px"}}>{t("WS_ADJUSTMENT_AMOUNT")}</CardSectionHeader>
            <CardSectionSubText style={{marginBottom: "16px"}}>{t("WS_ADJUSTMENT_AMOUNT_ADDITION_TEXT")}</CardSectionSubText>
            {!isBillSearchLoading ? <table>
                <tr style={{textAlign: "left"}}>
                    <th>{t("WS_TAX_HEADS")}</th>
                    <th>{t("WS_CURRENT_AMOUNT")}</th>
                    <th>
                        <Controller
                            name="action"
                            control={control}
                            render={(props) => {
                                return <CheckBox 
                                    // className="form-field"
                                    label={t("WS_REDUCED_AMOUNT")}
                                    onChange={props?.onChange}
                                    value={"negative"}
                                    checked={props?.value === "negative"}
                                />
                            }}
                        />
                    </th>
                    <th>
                        <Controller
                            name="action"
                            control={control}
                            render={(props) => {
                                return <CheckBox 
                                    // className="form-field"
                                    label={t("WS_ADDITIONAL_AMOUNT")}
                                    onChange={props?.onChange}
                                    value={"positive"}
                                    checked={props?.value === "positive"}
                                />
                            }}
                        />
                    </th>
                </tr>
                <tr>
                    <td style={{paddingRight: "60px"}}>{t("WS_CHARGE")}</td>
                    <td style={{paddingRight: "60px", textAlign: "end"}}>₹ {billSearchData?.find(e => e.taxHeadCode === "WS_CHARGE")?.amount}</td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                </tr>
                <tr>
                    <td style={{paddingRight: "60px"}}>{t("WS_TIME_INTEREST")}</td>
                    <td style={{paddingRight: "60px", textAlign: "end"}}>₹ {billSearchData?.find(e => e.taxHeadCode === "WS_TIME_INTEREST")?.amount}</td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                </tr>
                <tr>
                    <td style={{paddingRight: "60px"}}>{t("WS_WATER_CESS")}</td>
                    <td style={{paddingRight: "60px", textAlign: "end"}}>₹ {billSearchData?.find(e => e.taxHeadCode === "WS_WATER_CESS")?.amount}</td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                </tr>
                <tr>
                    <td style={{paddingRight: "60px"}}>{t("WS_TIME_PENALTY")}</td>
                    <td style={{paddingRight: "60px", textAlign: "end"}}>₹ {billSearchData?.find(e => e.taxHeadCode === "WS_TIME_PENALTY")?.amount}</td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                    <td style={{paddingRight: "60px"}}><TextInput /></td>
                </tr>
            </table> : <Loader />}
            { BillAmendmentMDMSLoading ? <Loader/> : <>
                <CardSectionHeader style={{marginBottom: "16px"}}>{t("WS_ADD_DEMAND_REVISION_BASIS")}</CardSectionHeader>
                <CardSectionSubText style={{marginBottom: "16px"}}>{t("WS_SELECT_DEMAND_REVISION")}</CardSectionSubText>
                <LabelFieldPair>
                    <CardLabel style={{fontWeight: "500"}}>{t("WS_DEMAND_REVISION_BASIS")}</CardLabel>
                    <Controller
                        name="amendmentReason"
                        control={control}
                        render={(props) => {
                            return <Dropdown style={{width: "640px"}} option={BillAmendmentMDMS} selected={props?.value} optionKey={"i18nKey"} t={t} select={props?.onChange} />
                        }}
                    />
                </LabelFieldPair>
                <LabelFieldPair>
                    <CardLabel style={{fontWeight: "500"}}>{t("WS_GOVERNMENT_NOTIFICATION_NUMBER")}</CardLabel>
                    <div className="field">
                        <TextInput style={{width: "640px"}} name="reasonDocumentNumber" inputRef={register({})} />
                    </div>
                    
                </LabelFieldPair>
                <LabelFieldPair>
                    <CardLabel style={{fontWeight: "500"}}>{t("WS_GOVERNMENT_NOTIFICATION_NUMBER")}</CardLabel>
                    {/* <div className="field"> */}
                        {/* <TextInput style={{width: "640px"}}  inputRef={register({})} /> */}
                        {/* </div> */}
                    <Controller
                        render={(props) => <DatePicker style={{width:"640px"}} date={props.value} disabled={false} onChange={props.onChange} />}
                        name="effectiveFrom"
                        control={control}
                    />
                </LabelFieldPair>
                <LabelFieldPair>
                    <CardLabel style={{fontWeight: "500"}}>{t("WS_GOVERNMENT_NOTIFICATION_NUMBER")}</CardLabel>
                    {/* <div className="field">
                        <TextInput style={{width: "640px"}} name="effectiveTill" inputRef={register({})} />
                    </div> */}
                    <Controller
                        render={(props) => <DatePicker style={{width:"640px"}} date={props.value} disabled={false} onChange={props.onChange} />}
                        name="effectiveTill"
                        control={control}
                    />
                </LabelFieldPair>
            </>}
            {!!amendmentReason ? <CardSectionHeader style={{marginBottom: "16px"}}>{t("WS_DOCUMENT_REQUIRED")}</CardSectionHeader> : null }
            {amendmentReason?.allowedDocuments?.allowedDocs?.map(e => <LabelFieldPair>
                <CardLabel style={{fontWeight: "500"}}>{t(`WS_${e?.documentType}`)}{e?.required ? `*` : null}</CardLabel>
                <div className="field">
                    <Controller
                        name={e?.documentType}
                        control={control}
                        render={(props) => (
                        <UploadFile
                            // onUpload={(d) => selectFile(d, props)}
                            // onDelete={() => {
                            //     setFileStoreId(null);
                            //     setFileSize(100);
                            // }}
                            style={{width: "640px"}}
                            accept="image/*, .pdf, .png, .jpeg, .doc"
                            showHintBelow={true}
                            hintText={t("WS_DOCUMENTS_ATTACH_RESTRICTIONS_SIZE")}
                            // message={isUploadingImage ? <Loader /> : documentUploadMessage(t, fileStoreId, isInEditFormMode)}
                            textStyles={{ width: "100%" }}
                            inputStyles={{ width: "280px" }}
                        />
                        )}
                    />
                    {/* {fileSize ? `${getFileSize(fileSize)}` : null}
                    {imageUploadError ? <CardLabelError>{t(imageUploadError)}</CardLabelError> : null} */}
                </div>
            </LabelFieldPair>)}
        </Card>
        <ActionBar>
              <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => {}} />
        </ActionBar>
    </form>
}

export default ApplicationBillAmendment