export const navigationItems = {
  citizen: [
    {
      label: "COMMON_BOTTOM_NAVIGATION_HOME",
      icon: { action: "action", name: "home" },
      route: "/home",
      id: "home",
    },
    {
      label: "COMMON_BOTTOM_NAVIGATION_INFORMATION",
      icon: { action: "action", name: "info" },
      route: "",
      id: "information-button",
    },
    {
      label: "COMMON_BOTTOM_NAVIGATION_PAYMENTS",
      icon: { action: "custom", name: "rupee" },
      route: "",
      id: "payments-button",
    },
    {
      label: "COMMON_BOTTOM_NAVIGATION_COMPLAINTS",
      icon: { action: "alert", name: "warning" },
      route: "/my-complaints",
      id: "complaints-button",
    },
  ],
  employee: [
    {
      label: "COMMON_BOTTOM_NAVIGATION_HOME",
      icon: { action: "action", name: "home" },
      route: "/employee",
      id: "home",
    },
    {
      label: "Modules",
      icon: { action: "action", name: "info" },
      route: "",
      id: "information-button",
    },
    {
      label: "Profile",
      icon: { action: "custom", name: "rupee" },
      route: "/user/profile",
      id: "payments-button",
    },
    {
      label: "Contact",
      icon: { action: "alert", name: "warning" },
      route: "/employee",
      id: "complaints-button",
    },
  ],
  csr: [
    {
      label: "COMMON_BOTTOM_NAVIGATION_HOME",
      icon: { action: "action", name: "home" },
      route: "/employee",
      id: "home",
    },
    {
      label: "Modules",
      icon: { action: "action", name: "info" },
      route: "",
      id: "information-button",
    },
    {
      label: "Profile",
      icon: { action: "custom", name: "rupee" },
      route: "/user/profile",
      id: "payments-button",
    },
    {
      label: "Contact",
      icon: { action: "alert", name: "warning" },
      route: "/employee",
      id: "complaints-button",
    },
  ],
};
