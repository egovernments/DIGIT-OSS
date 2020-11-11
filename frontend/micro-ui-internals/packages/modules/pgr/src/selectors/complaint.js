export const selectComplaints = (state) => state.complaints.list || [];

export const selectComplaintById = (state, id) => state.complaints.list.filter((complaint) => complaint.service.serviceRequestId === id);
