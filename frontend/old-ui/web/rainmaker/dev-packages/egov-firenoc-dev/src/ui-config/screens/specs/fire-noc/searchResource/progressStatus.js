export const progressStatus = {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
        style: { display: "flex", justifyContent: "center" }
    },
    visible: false,
    children: {
        progress: {
            uiFramework: "material-ui",
            componentPath: "CircularProgress"
        }
    }
};
