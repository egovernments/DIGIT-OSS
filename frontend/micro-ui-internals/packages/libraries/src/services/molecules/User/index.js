import { Storage } from "../../atoms/Utils/Storage";

export const UserService = {
  getType: () => {
    return Storage.get("userType") || "citizen";
  },
  getUser: () => {
    return Digit.SessionStorage.get("User");
  },
};
