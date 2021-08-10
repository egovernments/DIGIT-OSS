import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
export const construtCardCongtentObj = (moduleName, purpose, status) => {
	let tileContent = {
		"apply-success": {
			header: {
				labelName: "Application Submitted Successfully",
				labelKey: getTransformedLocale(`${moduleName}_APPLICATION_SUCCESS_MESSAGE_MAIN`)
			},
			body: {
				labelName: "A notification regarding Application Submission has been sent to building owner at registered Mobile No.",
				labelKey: getTransformedLocale(`${moduleName}_APPLICATION_SUCCESS_MESSAGE_SUB`)
			},
			tailText: {
				labelName: "Application No.",
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_APP_NO_LABEL`)
			}
		},
		"pay-success": {
			header: {
				labelName: "Payment has been collected successfully!",
				labelKey: getTransformedLocale(`${moduleName}_PAYMENT_COLLECTION_SUCCESS_MESSAGE_MAIN`)
			},
			body: {
				labelName:
					"A notification regarding Payment Collection has been sent to building owner at registered Mobile No.",
				labelKey: getTransformedLocale(`${moduleName}_PAYMENT_SUCCESS_MESSAGE_SUB`)
			},
			tailText: {
				labelName: "Payment Receipt No.",
				labelKey: getTransformedLocale(`${moduleName}_PMT_RCPT_NO`)
			}
		},
		"approve-success": {
			header: {
				labelName: `${moduleName} Approved Successfully`,
				labelKey: getTransformedLocale(`${moduleName}_APPROVAL_CHECKLIST_MESSAGE_HEAD`)
			},
			body: {
				labelName:
					`A notification regarding ${moduleName}Approval has been sent to building owner at registered Mobile No.`,
				labelKey: getTransformedLocale(`${moduleName}_APPROVAL_CHECKLIST_MESSAGE_SUB`)
			},
			tailText: {
				labelName: `${moduleName} No.`,
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_NOC_NO_LABEL`)
			}
		},
		"application-reject": {
			header: {
				labelName: `${moduleName} Application Rejected`,
				labelKey: getTransformedLocale(`${moduleName}_APPROVAL_REJ_MESSAGE_HEAD`)
			},
			body: {
				labelName:
					`A notification regarding ${moduleName} Rejection has been sent to building owner at registered Mobile No.`,
				labelKey: getTransformedLocale(`${moduleName}_APPROVAL_REJ_MESSAGE_SUBHEAD`)
			}
		},"application-rejected": {
			header: {
				labelName: `${moduleName} Application Rejected`,
				labelKey: getTransformedLocale(`${moduleName}_APPROVAL_REJ_MESSAGE_HEAD`)
			},
			body: {
				labelName:
					`A notification regarding ${moduleName} Rejection has been sent to building owner at registered Mobile No.`,
				labelKey: getTransformedLocale(`${moduleName}_APPROVAL_REJ_MESSAGE_SUBHEAD`)
			}
		},
		"application-cancelled": {
			header: {
				labelName: `${moduleName} Cancelled`,
				labelKey: getTransformedLocale(`${moduleName}_CANCELLED_MESSAGE_HEAD`)
			},
			body: {
				labelName:
					`A notification regarding ${moduleName} cancellation has been sent to building owner at registered Mobile No.`,
				labelKey: getTransformedLocale(`${moduleName}_CANCELLED_MESSAGE_SUBHEAD`)
			},
			tailText: {
				labelName: `${moduleName} No.`,
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_NOC_NO_LABEL`)
			}
		},
		"pay-failure": {
			header: {
				labelName: "Payment has failed!",
				labelKey: getTransformedLocale(`${moduleName}_PAYMENT_FAILURE_MESSAGE_MAIN`)
			},
			body: {
				labelName:
					"A notification regarding payment failure has been sent to the building owner and applicant.",
				labelKey: getTransformedLocale(`${moduleName}_PAYMENT_FAILURE_MESSAGE_SUB`)
			}
		},
		"mark-success": {
			header: {
				labelName: "Application Marked Successfully",
				labelKey: getTransformedLocale(`${moduleName}_MARK_SUCCESS_MESSAGE_MAIN`)
			},
			body: {
				labelName: "Application has been marked successfully",
				labelKey: getTransformedLocale(`${moduleName}_APPLICATION_MARKED_SUCCESS`)
			},
			tailText: {
				labelName: "Application No.",
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_APP_NO_LABEL`)
			}
		},
		"forward-success": {
			header: {
				labelName: "Application Forwarded Successfully",
				labelKey: getTransformedLocale(`${moduleName}_FORWARD_SUCCESS_MESSAGE_MAIN`)
			},
			body: {
				labelName: "Application has been marked successfully",
				labelKey: getTransformedLocale(`${moduleName}_APPLICATION_FORWARD_SUCCESS`)
			},
			tailText: {
				labelName: "Application No.",
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_APP_NO_LABEL`)
			}
		},
		"sendback-success": {
			header: {
				labelName: "Application sent back Successfully",
				labelKey: getTransformedLocale(`${moduleName}_SENDBACK_SUCCESS_MESSAGE_MAIN`)
			},
			body: {
				labelName: "Application has been sent back successfully",
				labelKey: getTransformedLocale(`${moduleName}_APPLICATION_SENDBACK_SUCCESS`)
			},
			tailText: {
				labelName: "Application No.",
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_APP_NO_LABEL`)
			}
		},
		"refer-success": {
			header: {
				labelName: "Application referred Successfully",
				labelKey: getTransformedLocale(`${moduleName}_REFER_SUCCESS_MESSAGE_MAIN`)
			},
			body: {
				labelName: "Application has been referred successfully",
				labelKey: getTransformedLocale(`${moduleName}_APPLICATION_REFER_SUCCESS`)
			},
			tailText: {
				labelName: "Application No.",
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_APP_NO_LABEL`)
			},
		},
		"sendbacktocitizen-success": {
			header: {
				labelName: "Application sent back Successfully",
				labelKey: getTransformedLocale(`${moduleName}_SENDBACKTOCITIZEN_SUCCESS_MESSAGE_MAIN`)
			},
			body: {
				labelName: "Application has been sent back successfully",
				labelKey: getTransformedLocale(`${moduleName}_APPLICATION_SENDBACKTOCITIZEN_SUCCESS`)
			},
			tailText: {
				labelName: "Application No.",
				labelKey: getTransformedLocale(`${moduleName}_HOME_SEARCH_RESULTS_APP_NO_LABEL`)
			}
		}
	}
	return tileContent[`${purpose}-${status}`];
}