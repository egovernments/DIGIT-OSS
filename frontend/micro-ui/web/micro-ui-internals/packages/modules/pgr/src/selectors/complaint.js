export const selectComplaints = (state) => state.pgr.complaints.list || [];

export const selectComplaintById = (state, id) => state.pgr.complaints.list.filter((complaint) => complaint.service.serviceRequestId === id);
