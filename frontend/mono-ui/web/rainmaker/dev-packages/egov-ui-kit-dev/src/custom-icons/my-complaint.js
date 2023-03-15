import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const MyComplaint = (props) => {
  return (
    <SvgIcon viewBox="0 0 42 42" className="custom-icon" {...props}>
      <path d="M-3-2h48v48H-3z" />
      <path
        d="M28.5687 10.9988V.42H18.638c-1.094 0-1.981 1.1493-1.981 2.5661v36.3644c0 1.4184.887 2.5677 1.981 2.5677h21.257c1.094 0 1.981-1.1493 1.981-2.5677v-22.341h-8.6694c-2.557 0-4.6379-2.698-4.6379-6.0107z"
        fill="#6C8CA1"
        fillRule="nonzero"
      />
      <text fontFamily="Roboto-Medium, Roboto" fontSize="24" fontWeight="400" letterSpacing="1.1111" fill="#FFF">
        <tspan x="26" y="38">
          !
        </tspan>
      </text>
      <path
        d="M14.4274 39.3505V8.4094h-5.007c-1.0941 0-1.9812 1.1492-1.9812 2.566v28.3751c0 1.4184.887 2.5677 1.9811 2.5677h6.9881c-1.094 0-1.981-1.1493-1.981-2.5677zM5.2301 39.3505V17.4972h-2.852c-1.0941 0-1.981 1.1492-1.981 2.566v19.2873c0 1.4184.8869 2.5677 1.981 2.5677h4.833c-1.094 0-1.981-1.1493-1.981-2.5677zM32.5444 14.5698h9.3316L30.4117.4201V11.8079c0 1.5245.955 2.762 2.1327 2.762z"
        fill="#6C8CA1"
        fillRule="nonzero"
      />{" "}
    </SvgIcon>
  );
};

export default MyComplaint;
