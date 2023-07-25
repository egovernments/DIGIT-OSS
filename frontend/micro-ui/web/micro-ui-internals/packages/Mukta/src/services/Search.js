import _ from "lodash";

const createProjectsArray = (t, project, searchParams, headerLocale) => {
    let totalProjects = {
        searchedProject : {},
        subProjects : []
    };
    let basicDetails = {};
    let totalProjectsLength = project.length;
    // for(let projectIndex = 0; projectIndex < totalProjectsLength; projectIndex++) {
        let currentProject = project[0];
        const headerDetails = {
            title: " ",
            asSectionHeader: true,
            values: [
                { title: "WORKS_PROJECT_ID", value: currentProject?.projectNumber || "NA"},
                { title: "ES_COMMON_PROPOSAL_DATE", value: Digit.Utils.pt.convertEpochToDate(currentProject?.additionalDetails?.dateOfProposal) || "NA"},
                { title: "WORKS_PROJECT_NAME", value: currentProject?.name || "NA"},
                { title: "PROJECT_PROJECT_DESC", value: currentProject?.description || "NA"}
            ]
        };

        const projectDetails = {
            title: "WORKS_PROJECT_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "PROJECT_LOR", value: currentProject?.referenceID || "NA" },
                { title: "WORKS_PROJECT_TYPE", value: currentProject?.projectType ? t(`COMMON_MASTERS_${Digit.Utils.locale.getTransformedLocale(currentProject?.projectType)}`) : "NA" },
                { title: "PROJECT_TARGET_DEMOGRAPHY", value: currentProject?.additionalDetails?.targetDemography ? t(`COMMON_MASTERS_${currentProject?.additionalDetails?.targetDemography }`) : "NA" },
                { title: "PROJECT_ESTIMATED_COST", value: currentProject?.additionalDetails?.estimatedCostInRs ? `₹ ${Digit.Utils.dss.formatterWithoutRound(currentProject?.additionalDetails?.estimatedCostInRs, 'number')}` : "NA" },
            ]
        };

        const locationDetails = {
            title: "WORKS_LOCATION_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_GEO_LOCATION",value: (currentProject?.address?.latitude || currentProject?.address?.longitude ) ? `${currentProject?.address?.latitude}, ${currentProject?.address?.longitude}`  : "NA" },
                { title: "WORKS_CITY",value: currentProject?.address?.city ? t(`TENANT_TENANTS_${Digit.Utils.locale.getTransformedLocale(currentProject?.address?.city)}`) : "NA" }, //will check with Backend
                { title: "WORKS_WARD", value: currentProject?.address?.boundary ? t(`${headerLocale}_ADMIN_${currentProject?.address?.boundary}`) : "NA"  }, ///backend to update this
                { title: "WORKS_LOCALITY",value: currentProject?.additionalDetails?.locality ? t(`${headerLocale}_ADMIN_${currentProject?.additionalDetails?.locality}`) : "NA" },
            ]
        };

        // const financialDetails = {
        //     title: "WORKS_FINANCIAL_DETAILS",
        //     asSectionHeader: false,
        //     values: [
        //         { title: "WORKS_HEAD_OF_ACCOUNTS", value: currentProject?.additionalDetails?.fund ? t(`COMMON_MASTERS_FUND_${currentProject?.additionalDetails?.fund}`) : "NA" },
        //     ],
        //   };

        
        let documentDetails = {
            title: "",
            asSectionHeader: true,
            additionalDetails: {
                documents: [{
                    title: "WORKS_RELEVANT_DOCUMENTS",
                    BS : 'Works',
                    values: currentProject?.documents?.map((document) => {
                        if(document?.status !== "INACTIVE") {
                            return {
                                title: document?.documentType === "OTHERS" ? document?.additionalDetails?.otherCategoryName : t(`PROJECT_${document?.documentType}`),
                                documentType: document?.documentType,
                                documentUid: document?.fileStore,
                                fileStoreId: document?.fileStore,
                            };
                        }
                        return {};
                    }),
                },
                ]
            }
        }

        //filter any empty object
        documentDetails.additionalDetails.documents[0].values =documentDetails?.additionalDetails?.documents?.[0]?.values?.filter(value=>{
            if(value?.title){
                return value;
            }
        });

        // if(currentProject?.projectNumber === searchParams?.Projects?.[0]?.projectNumber) {
            basicDetails = {
                projectID : currentProject?.projectNumber,
                projectProposalDate : Digit.Utils.pt.convertEpochToDate(currentProject?.additionalDetails?.dateOfProposal) || "NA",
                projectName : currentProject?.name || "NA",
                projectDesc : currentProject?.description || "NA",
                projectHasSubProject : (totalProjectsLength > 1 ? "COMMON_YES" : "COMMON_NO"),
                projectParentProjectID : currentProject?.ancestors?.[0]?.projectNumber || "NA",
                uuid:currentProject?.id,
                address:currentProject?.address,
                ward: currentProject?.address?.boundary,
                locality:currentProject?.additionalDetails?.locality
            }
            totalProjects.searchedProject = {
                basicDetails,
                headerDetails, 
                projectDetails, 
                locationDetails, 
                documentDetails
            }
        // }
    // }
    return totalProjects;
}

export const Search = {
    viewProjectDetailsScreen: async(t,tenantId, searchParams, filters = {limit : 10, offset : 0, includeAncestors : true, includeDescendants : true}, headerLocale)=> {
        const response = await Digit.WorksService?.searchProject(tenantId, searchParams, filters);
        
        let projectDetails = {
            searchedProject : {
                basicDetails : {},
                details : {
                    projectDetails : [],
                }
            },
        }

        if(response?.Project) {
            let projects = createProjectsArray(t, response?.Project, searchParams, headerLocale);
        
            //searched Project details
            projectDetails.searchedProject['basicDetails'] = projects?.searchedProject?.basicDetails;
            projectDetails.searchedProject['details']['projectDetails'] = {applicationDetails : [projects?.searchedProject?.headerDetails, projects?.searchedProject?.projectDetails, projects?.searchedProject?.locationDetails, projects?.searchedProject?.documentDetails]}; //rest categories will come here
    
        }

        return {
            projectDetails : response?.Project ? projectDetails : [],
            response : response?.Project,
            processInstancesDetails: [],
            applicationData: {},
            workflowDetails: [],
            applicationData:{},
            isNoDataFound : response?.Project?.length === 0
        }
    },
    searchEstimate : async(tenantId, filters) => {
        const response = await Digit.WorksService?.estimateSearch({tenantId, filters});
        return response?.estimates;
    }
}