import APIServices from "@egovernments/digit-ui-libraries/src/services/init";

class CreateComplaint extends APIServices {
  constructor(module, tenantId) {
    super(module, tenantId);
  }

  submit(data, tenantId) {
    return this.PGRCreate(data, tenantId);
  }
}

export default CreateComplaint;
