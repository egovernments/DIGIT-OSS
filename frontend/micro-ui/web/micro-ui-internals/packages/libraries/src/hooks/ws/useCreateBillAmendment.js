import { useMutation } from "react-query"
import Create from "../../services/molecules/WS/Create"

const useCreateBillAmendment = () => {
    return useMutation((data) => Create.BillAmendment(data))
}

export default useCreateBillAmendment