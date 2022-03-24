import { WSService } from "../../elements/WS";

const Create = {
    BillAmendment: async(data) => {
        try {
            const response = await WSService.createBillAmendment({filters: data});
            return response;
        } catch (error) {
            throw new Error(error?.response?.data?.Errors[0].message);
        }
    }
}

export default Create