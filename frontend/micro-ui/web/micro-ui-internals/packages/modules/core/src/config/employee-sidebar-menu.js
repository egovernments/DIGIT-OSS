import React from "react";
import { HomeIcon, ComplaintIcon, PropertyHouse, ArrowDirection } from "@egovernments/digit-ui-react-components";

const EmployeeSideBarMenu = [
  {
    type: "link",
    element: "Home",
    icon: <HomeIcon className="icon" />,
    href: "/digit-ui/employee/",
  },
  {
    type: "link",
    element: "Complaints",
    href: "/digit-ui/employee/complaints/",
    icon: <ComplaintIcon className="icon" />,

    subNav: [
      {
        type: "link",
        element: "New Complaint",
        href: "/digit-ui/employee/complaints/new",
      },
      {
        type: "link",
        element: "Test",
        href: "/digit-ui/employee/complaints/new",
        icon: <ArrowDirection className="icon" />,
      },
    ],
  },
  {
    type: "link",
    element: "Property Tax",
    icon: <PropertyHouse className="icon" />,

    href: "/digit-ui/employee/property-tax",

    subNav: [
      {
        type: "link",
        element: "Applications",
        href: "/digit-ui/employee/property-tax/applications",
        icon: <ArrowDirection className="icon" />,
      },
      {
        type: "link",
        element: "Reports",
        href: "/digit-ui/employee/property-tax/applications",
        icon: <ArrowDirection className="icon" />,
      },
    ],
  },
];
export default EmployeeSideBarMenu;
