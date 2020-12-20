import { Complaint } from "./Complaint";
import { useQuery } from "react-query";

class APIServices {
  constructor(module, tenantId) {
    this.module = module;
    this.tenantId = tenantId;
  }

  async PGRCreate(data) {
    return useQuery("createQueryResponse", async () => await Complaint.create(data));
  }
}

export default APIServices;
