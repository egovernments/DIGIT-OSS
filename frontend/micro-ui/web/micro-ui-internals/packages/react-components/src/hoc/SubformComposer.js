import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import BreakLine from "../atoms/BreakLine";
import Card from "../atoms/Card";
import CardLabel from "../atoms/CardLabel";
import CardText from "../atoms/CardText";
// import CardLabelError from "../atoms/CardLabelError";
import CardSubHeader from "../atoms/CardSubHeader";
import CardSectionHeader from "../atoms/CardSectionHeader";
import CardLabelDesc from "../atoms/CardLabelDesc";
import CardLabelError from "../atoms/CardLabelError";
import ActionBar from "../atoms/ActionBar";
import SubmitBar from "../atoms/SubmitBar";
import LabelFieldPair from "../atoms/LabelFieldPair";

import { useTranslation } from "react-i18next";
import TextInput from "../atoms/TextInput";
import Dropdown from "../atoms/Dropdown";
import MobileNumber from "../atoms/MobileNumber";
import DatePicker from "../atoms/DatePicker";
import TextArea from "../atoms/TextArea";

export const SubFormComposer = ({
  userType,
  setValue,
  onSelect,
  config,
  data,
  formData,
  register,
  errors,
  props,
  setError,
  clearErrors,
  formState,
  onBlur,
  control,
}) => {};
