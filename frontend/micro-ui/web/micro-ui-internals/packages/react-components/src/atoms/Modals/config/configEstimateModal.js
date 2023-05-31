import Dropdown from '../../Dropdown';
import { Loader } from '../../Loader';
import React, { useState } from 'react'

const configEstimateModal = (
    t,
    action,
    approvers,
    businessService,
    moduleCode
) => {
    
    const {action:actionString} = action
    const bsEstimate = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("estimate");
    const bsContract = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("contract");
    const bsMuster = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("muster roll");
    const bsPurchaseBill = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("works.purchase");
    
    const configMap = {
        [bsEstimate]: {
            "default":{
                comments:{
                    isMandatory:false,
                    show:true,
                },
                assignee:{
                    isMandatory:false,
                    show:true
                },
                upload:{
                    isMandatory:false,
                    show:true,
                    allowedFileTypes:/(.*?)(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv|jpeg)$/i
                }
            },
            "REJECT": {
                comments: {
                    isMandatory: true,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            },
            "SENDBACK": {
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            },
            "SENDBACKTOORIGINATOR": {
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            },
            "APPROVE": {
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            }
        },
        [bsContract]: {
            "default":{
                comments:{
                    isMandatory:false,
                    show:true,
                },
                assignee:{
                    isMandatory:false,
                    show:true
                },
                upload:{
                    isMandatory:false,
                    show:true,
                    allowedFileTypes:/(.*?)(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv|jpeg)$/i
                }
            },
            "REJECT": {
                comments: {
                    isMandatory: true,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            },
            "SEND_BACK": {
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            },
            "VERIFY_AND_FORWARD": {
                comments:{
                    isMandatory:false,
                    show:true,
                },
                assignee:{
                    isMandatory:false,
                    show:true
                },
                upload:{
                    isMandatory:false,
                    show:true
                }
            },
            "SEND_BACK_TO_ORIGINATOR": {
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            },
            "APPROVE": {
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                }
            },
        },
        [bsMuster]:{
            "default":{
                comments:{
                    isMandatory:false,
                    show:true,
                },
                assignee:{
                    isMandatory:false,
                    show:true
                },
                upload:{
                    isMandatory:false,
                    show:true,
                    allowedFileTypes:/(.*?)(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv|jpeg)$/i
                }
            },
            "APPROVE": {
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                },
                acceptTerms: {
                    isMandatory:true,
                    show:true
                }
            },
            "REJECT": {
                comments: {
                    isMandatory: true,
                    show: true,
                },
                upload: {
                    isMandatory: false,
                    show: true
                },
            },
            "SENDBACK":{
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                },
                acceptTerms: {
                    isMandatory:false,
                    show:false
                }
            },
            "SENDBACKTOCBO":{
                comments: {
                    isMandatory: false,
                    show: true,
                },
                assignee: {
                    isMandatory: false,
                    show: false
                },
                upload: {
                    isMandatory: false,
                    show: true
                },
                acceptTerms: {
                    isMandatory:false,
                    show:false
                }
            }
        },
        [bsPurchaseBill]:{
            "default":{
                comments:{
                    isMandatory:false,
                    show:true,
                },
                assignee:{
                    isMandatory:false,
                    show:false
                },
                upload:{
                    isMandatory:false,
                    show:true
                }
            },
            "VERIFY_AND_FORWARD":{
                comments:{
                    isMandatory:false,
                    show:true,
                },
                assignee:{
                    isMandatory:false,
                    show:true
                },
                upload:{
                    isMandatory:false,
                    show:true
                }
            },
            "REJECT":{
                comments:{
                    isMandatory:true,
                    show:true,
                },
                assignee:{
                    isMandatory:false,
                    show:false
                },
                upload:{
                    isMandatory:false,
                    show:true
                }
            }
        }
    }
//field can have (comments,assignee,upload)
    const fetchIsMandatory = (field) => {
        
        if(configMap?.[businessService]?.[actionString]){
            return configMap?.[businessService]?.[actionString]?.[field]?.isMandatory ? configMap?.[businessService]?.[actionString]?.[field]?.isMandatory : false
        }else{
            return configMap?.[businessService]?.default?.[field]?.isMandatory ? configMap?.[businessService]?.default?.[field]?.isMandatory: false
        }
    }
    const fetchIsShow = (field) => {
        
        if (configMap?.[businessService]?.[actionString]) {
           return configMap?.[businessService]?.[actionString]?.[field]?.show ? configMap?.[businessService]?.[actionString]?.[field]?.show : false
        } else {
            return configMap?.[businessService]?.default?.[field]?.show ? configMap?.[businessService]?.default?.[field]?.show:false
        }
        
    }

    return {
        label: {
            heading: Digit.Utils.locale.getTransformedLocale(`WF_MODAL_HEADER_${businessService}_${action.action}`),
            submit: Digit.Utils.locale.getTransformedLocale(`WF_MODAL_SUBMIT_${businessService}_${action.action}`),
            cancel: "WF_MODAL_CANCEL",
        },
        form: [
            {
                body: [
                    {
                        label: " ",
                        type: "checkbox",
                        disable: false,
                        isMandatory:false,
                        populators: {
                            name: "acceptTerms",
                            title: "MUSTOR_APPROVAL_CHECKBOX",
                            isMandatory: false,
                            labelStyles: {marginLeft:"40px"},
                            customLabelMarkup: true,
                            hideInForm: !fetchIsShow("acceptTerms")
                        }
                    },
                    {
                        label: t("WF_MODAL_APPROVER"),
                        type: "dropdown",
                        isMandatory: fetchIsMandatory("assignee"),
                        disable: false,
                        key:"assignees",
                        populators: {
                            name: "assignee",
                            optionsKey: "nameOfEmp",
                            options: approvers,
                            hideInForm: !fetchIsShow("assignee"),
                            "optionsCustomStyle": {
                                "top": "2.3rem"
                              }
                        },
                    },
                    {
                        label: t("WF_MODAL_COMMENTS"),
                        type: "textarea",
                        isMandatory: fetchIsMandatory("comments"),
                        populators: {
                            name: "comments",
                            hideInForm:!fetchIsShow("comments"),
                            validation:{
                                maxLength:{
                                    value:1024,
                                    message:t("WORKS_COMMENT_LENGTH_EXCEEDED_1024")
                                }
                            }
                        },
                    },
                    {
                        type: "multiupload",
                        label: t("WORKFLOW_MODAL_UPLOAD_FILES"),
                        populators: {
                            name: "documents",
                            allowedMaxSizeInMB: 5,
                            maxFilesAllowed: 1,
                            allowedFileTypes:configMap?.[businessService]?.default?.upload?.allowedFileTypes,
                            hintText:t("WORKS_DOC_UPLOAD_HINT"),
                            showHintBelow:true,
                            customClass: "upload-margin-bottom",
                            errorMessage: t("WORKS_FILE_UPLOAD_CUSTOM_ERROR_MSG"),
                            hideInForm:!fetchIsShow("upload")
                        }
                    }
                ]
            }
        ]
    }
}

export default configEstimateModal