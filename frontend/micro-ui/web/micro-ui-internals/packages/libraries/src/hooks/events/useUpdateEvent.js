import { useMutation } from "react-query";

const useUpdateEvent = () => {
  return useMutation(eventData => Digit.EventsServices.Update(eventData))
}

export default useUpdateEvent; 