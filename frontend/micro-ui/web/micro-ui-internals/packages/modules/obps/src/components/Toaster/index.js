import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const CusToaster = ({ error, success, label, onClose }) => {
  useEffect(() => {
    if (success) {
      toast.success(label, {
        onClose: () => {
          onClose();
        },
        autoClose: 3000,
      });
    }

    if (error) {
      toast.error(label, {
        onClose: () => {
          onClose();
        },
        autoClose: 3000,
      });
    }
  }, [error, success]);

  return <ToastContainer />;
};

export default CusToaster;
