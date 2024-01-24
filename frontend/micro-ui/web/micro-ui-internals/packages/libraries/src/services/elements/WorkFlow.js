import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";
import cloneDeep from "lodash/cloneDeep";

const getThumbnails = async (ids, tenantId, documents = []) => {
  tenantId = window.location.href.includes("/obps/") || window.location.href.includes("/pt/") ? Digit.ULBService.getStateId() : tenantId;
  
  if (window.location.href.includes("/obps/")) {
    if (documents?.length > 0) {
      let workflowsDocs = [];
      documents?.map(doc => {
        if (doc?.url) {
          const thumbs = doc?.url?.split(",")?.[3] || doc?.url?.split(",")?.[0]
          workflowsDocs.push({
            thumbs: [thumbs],
            images: [Digit.Utils.getFileUrl(doc.url)]
          }) 
        }
      })
      return workflowsDocs?.[0];
    } else {
      return null;
    }
  } else {
    const res = await Digit.UploadServices.Filefetch(ids, tenantId);
    if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
      return { 
        thumbs: res.data.fileStoreIds.map((o) => o.url.split(",")[3] || o.url.split(",")[0]), 
        images: res.data.fileStoreIds.map((o) => Digit.Utils.getFileUrl(o.url)) };
    } else {
      return null;
    }
  }
};

const makeCommentsSubsidariesOfPreviousActions = async (wf) => {
  const TimelineMap = new Map();
  const tenantId = window.location.href.includes("/obps/") ? Digit.ULBService.getStateId() : wf?.[0]?.tenantId;
  let fileStoreIdsList = [];
  let res = {};

  if (window.location.href.includes("/obps/")) {
    wf?.map(wfData => {
      wfData?.documents?.map(wfDoc => {
        if (wfDoc?.fileStoreId) fileStoreIdsList.push(wfDoc?.fileStoreId);
      })
    })
    if (fileStoreIdsList?.length > 0) {
      res = await Digit.UploadServices.Filefetch(fileStoreIdsList, tenantId);
    }
    wf?.forEach(wfData => {
      wfData?.documents?.forEach(wfDoc => {
        if (wfDoc?.fileStoreId) wfDoc.url = res.data[wfDoc?.fileStoreId];
      })
    });
  }
  for (const eventHappened of wf) {
    if (eventHappened?.documents) {
      eventHappened.thumbnailsToShow = await getThumbnails(eventHappened?.documents?.map(e => e?.fileStoreId), eventHappened?.tenantId, eventHappened?.documents)
    }
    if (eventHappened.action === "COMMENT") {
      const commentAccumulator = TimelineMap.get("tlCommentStack") || []
      TimelineMap.set("tlCommentStack", [...commentAccumulator, eventHappened])
    }
    else {
      const eventAccumulator = TimelineMap.get("tlActions") || []
      const commentAccumulator = TimelineMap.get("tlCommentStack") || []
      eventHappened.wfComments = [...commentAccumulator, ...eventHappened.comment ? [eventHappened] : []]
      TimelineMap.set("tlActions", [...eventAccumulator, eventHappened])
      TimelineMap.delete("tlCommentStack")
    }
  }
  const response = TimelineMap.get("tlActions")
  return response
}

const getAssignerDetails = (instance, nextStep, moduleCode) => {
  let assigner = instance?.assigner
  if (moduleCode === "FSM" || moduleCode === "FSM_POST_PAY_SERVICE" || moduleCode === "FSM_ADVANCE_PAY_SERVICE" || moduleCode === "PAY_LATER_SERVICE" || moduleCode === "FSM_ZERO_PAY_SERVICE") {
    if (instance.state.applicationStatus === "CREATED") {
      assigner = instance?.assigner
    } else {
      assigner = nextStep?.assigner || instance?.assigner
    }
  } else {
    assigner = instance?.assigner
  }
  return assigner
}

export const WorkflowService = {
  init: (stateCode, businessServices) => {
    return Request({
      url: Urls.WorkFlow,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode, businessServices },
      auth: true,
    });
  },

  getByBusinessId: (stateCode, businessIds, params = {}, history = true) => {
    return Request({
      url: Urls.WorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: { tenantId: stateCode, businessIds: businessIds, ...params, history },
      auth: true,
    });
  },

  getDetailsById: async ({ tenantId, id, moduleCode, role, getTripData }) => {
    const workflow = await Digit.WorkflowService.getByBusinessId(tenantId, id);
    const applicationProcessInstance = cloneDeep(workflow?.ProcessInstances);
    const getLocationDetails = window.location.href.includes("/obps/") || window.location.href.includes("noc/inbox");
    const moduleCodeData = getLocationDetails ? applicationProcessInstance?.[0]?.businessService : moduleCode;
    const businessServiceResponse = (await Digit.WorkflowService.init(tenantId, moduleCodeData))?.BusinessServices[0]?.states;
    if (workflow && workflow.ProcessInstances) {
      const processInstances = workflow.ProcessInstances;
      const nextStates = processInstances[0]?.nextActions.map((action) => ({ action: action?.action, nextState: processInstances[0]?.state.uuid }));
      const nextActions = nextStates.map((id) => ({
        action: id.action,
        state: businessServiceResponse?.find((state) => state.uuid === id.nextState),
      }));

      /* To check state is updatable and provide edit option*/
      const currentState = businessServiceResponse?.find((state) => state.uuid === processInstances[0]?.state.uuid);
      if (currentState && currentState?.isStateUpdatable) {
        if (moduleCode === "FSM" || moduleCode === "FSM_POST_PAY_SERVICE" || moduleCode === "FSM_ADVANCE_PAY_SERVICE" || moduleCode === "FSM_ZERO_PAY_SERVICE" || moduleCode === "PAY_LATER_SERVICE" || moduleCode === "FSM_VEHICLE_TRIP" || moduleCode === "PGR" || moduleCode === "OBPS") null;
        else nextActions.push({ action: "EDIT", state: currentState });
      }

      const getStateForUUID = (uuid) => businessServiceResponse?.find((state) => state.uuid === uuid);

      const actionState = businessServiceResponse
        ?.filter((state) => state.uuid === processInstances[0]?.state.uuid)
        .map((state) => {
          let _nextActions = state.actions?.map?.((ac) => {
            let actionResultantState = getStateForUUID(ac.nextState);
            let assignees = actionResultantState?.actions?.reduce?.((acc, act) => {
              return [...acc, ...act.roles];
            }, []);
            return { ...actionResultantState, assigneeRoles: assignees, action: ac.action, roles: ac.roles };
          });
          return { ...state, nextActions: _nextActions, roles: state?.action, roles: state?.actions?.reduce((acc, el) => [...acc, ...el.roles], []) };
        })?.[0];

      // HANDLING ACTION for NEW VEHICLE LOG FROM UI SIDE
      const action_newVehicle = [{
        "action": "READY_FOR_DISPOSAL",
        "roles": "FSM_EMP_FSTPO,FSM_EMP_FSTPO"
      }]

      // const actionRolePair = nextActions?.map((action) => ({
      //   action: action?.action,
      //   roles: action.state?.actions?.map((action) => action.roles).join(","),
      // }));

      if (processInstances.length > 0) {
        const TLEnrichedWithWorflowData = await makeCommentsSubsidariesOfPreviousActions(processInstances)
        let timeline = TLEnrichedWithWorflowData.map((instance, ind) => {
          let checkPoint = {
            performedAction: instance.action,
            status: moduleCode === "WS.AMENDMENT" ||  moduleCode === "SW.AMENDMENT" ? instance.state.state :instance.state.applicationStatus,
            state: instance.state.state,
            assigner: getAssignerDetails(instance, TLEnrichedWithWorflowData[ind - 1], moduleCode),
            rating: instance?.rating,
            wfComment: instance?.wfComments.map(e => e?.comment),
            wfDocuments: instance?.documents,
            thumbnailsToShow: { thumbs: instance?.thumbnailsToShow?.thumbs, fullImage: instance?.thumbnailsToShow?.images },
            assignes: instance.assignes,
            caption: instance.assignes ? instance.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
            auditDetails: {
              created: Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.createdTime),
              lastModified: Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.lastModifiedTime),
            },
            timeLineActions: instance.nextActions
              ? instance.nextActions.filter((action) => action.roles.includes(role)).map((action) => action?.action)
              : null,
          };
          return checkPoint;
        });

        if (getTripData) {
          try {
            const filters = {
              businessService: 'FSM_VEHICLE_TRIP',
              refernceNos: id
            };
            const tripSearchResp = await Digit.FSMService.vehicleSearch(tenantId, filters)
            if (tripSearchResp && tripSearchResp.vehicleTrip && tripSearchResp.vehicleTrip.length) {
              const numberOfTrips = tripSearchResp.vehicleTrip.length
              let cretaedTime = 0
              let lastModifiedTime = 0
              let waitingForDisposedCount = 0
              let disposedCount = 0
              let waitingForDisposedAction = []
              let disposedAction = []
              for (const data of tripSearchResp.vehicleTrip) {
                const resp = await Digit.WorkflowService.getByBusinessId(tenantId, data.applicationNo)
                resp?.ProcessInstances?.map((instance, ind) => {
                  if (instance.state.applicationStatus === "WAITING_FOR_DISPOSAL") {
                    waitingForDisposedCount++
                    cretaedTime = Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.createdTime)
                    lastModifiedTime = Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.lastModifiedTime)
                    waitingForDisposedAction = [{
                      performedAction: instance.action,
                      status: instance.state.applicationStatus,
                      state: instance.state.state,
                      assigner: instance?.assigner,
                      rating: instance?.rating,
                      thumbnailsToShow: { thumbs: instance?.thumbnailsToShow?.thumbs, fullImage: instance?.thumbnailsToShow?.images },
                      assignes: instance.assignes,
                      caption: instance.assignes ? instance.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
                      auditDetails: {
                        created: cretaedTime,
                        lastModified: lastModifiedTime,
                      },
                      numberOfTrips: numberOfTrips
                    }]
                  }
                  if (instance.state.applicationStatus === "DISPOSED") {
                    disposedCount++
                    cretaedTime = instance.auditDetails.createdTime > cretaedTime ? Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.createdTime) : cretaedTime
                    lastModifiedTime = instance.auditDetails.lastModifiedTime > lastModifiedTime ? Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.lastModifiedTime) : lastModifiedTime
                    disposedAction = [{
                      performedAction: instance.action,
                      status: instance.state.applicationStatus,
                      state: instance.state.state,
                      assigner: instance?.assigner,
                      rating: instance?.rating,
                      thumbnailsToShow: { thumbs: instance?.thumbnailsToShow?.thumbs, fullImage: instance?.thumbnailsToShow?.images },
                      assignes: instance.assignes,
                      caption: instance.assignes ? instance.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
                      auditDetails: {
                        created: cretaedTime,
                        lastModified: lastModifiedTime,
                      },
                      numberOfTrips: disposedCount
                    }]
                  }
                })
              }

              let tripTimeline = []
              const disposalInProgressPosition = timeline.findIndex((data) => data.status === "DISPOSAL_IN_PROGRESS")
              if (disposalInProgressPosition !== -1) {
                timeline[disposalInProgressPosition].numberOfTrips = numberOfTrips
                timeline.splice(disposalInProgressPosition + 1, 0, ...waitingForDisposedAction)
                tripTimeline = disposedAction
              } else {
                tripTimeline = disposedAction.concat(waitingForDisposedAction)
              }
              const feedbackPosition = timeline.findIndex((data) => data.status === "CITIZEN_FEEDBACK_PENDING")
              if (feedbackPosition !== -1) {
                timeline.splice(feedbackPosition + 1, 0, ...tripTimeline)
              } else {
                timeline = tripTimeline.concat(timeline)
              }
            }
          } catch (err) { }
        }

      //Added the condition so that following filter can happen only for fsm and does not affect other module
      let nextStep = [];
      if(window.location.href?.includes("fsm")){
        // TAKING OUT CURRENT APPL STATUS
        const actionRolePair = nextActions?.map((action) => ({
          action: action?.action,
          roles: action.state?.actions?.map((action) => action.roles).join(","),
        }));
        nextStep = location.pathname.includes("new-vehicle-entry") ? action_newVehicle : location.pathname.includes("dso") ? actionRolePair.filter((i)=> i.action !== "PAY") : actionRolePair;
      }

        if (role !== "CITIZEN" && moduleCode === "PGR") {
          const onlyPendingForAssignmentStatusArray = timeline?.filter(e => e?.status === "PENDINGFORASSIGNMENT")
          const duplicateCheckpointOfPendingForAssignment = onlyPendingForAssignmentStatusArray.at(-1)
          // const duplicateCheckpointOfPendingForAssignment = timeline?.find( e => e?.status === "PENDINGFORASSIGNMENT")
          timeline.push({
            ...duplicateCheckpointOfPendingForAssignment,
            status: "COMPLAINT_FILED",
          });
        }

        if (timeline[timeline.length - 1].status !== "CREATED" && (moduleCode === "FSM" || moduleCode === "FSM_POST_PAY_SERVICE" || moduleCode==="FSM_ADVANCE_PAY_SERVICE" || moduleCode==="FSM_ZERO_PAY_SERVICE" || moduleCode==="PAY_LATER_SERVICE" ))
          timeline.push({
            status: "CREATED",
          });

        const details = {
          timeline,
          nextActions : window.location.href?.includes("fsm") ? nextStep : nextActions,
          actionState,
          applicationBusinessService: workflow?.ProcessInstances?.[0]?.businessService,
          processInstances: applicationProcessInstance,
        };
        return details;
      }
    } else {
      throw new Error("error fetching workflow services");
    }
    return {};
  },

  getAllApplication: (tenantId, filters) => {
    return Request({
      url: Urls.WorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: { tenantId, ...filters },
      auth: true,
    });
  },
};
