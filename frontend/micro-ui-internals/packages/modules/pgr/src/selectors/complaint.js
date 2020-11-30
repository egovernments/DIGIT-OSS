export const selectComplaints = (state) => state.pgr.complaints.list || [];

export const selectComplaintById = (state, id) => state.complaints.list.filter((complaint) => complaint.service.serviceRequestId === id);
