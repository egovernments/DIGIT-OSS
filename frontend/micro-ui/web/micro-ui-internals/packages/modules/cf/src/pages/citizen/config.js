export const WEBSOCKET_URL = globalConfigs?.getConfig("xstate-webchat-services") || 'ws://dev.digit.org/xstate-webchat';

export const accordionData = [
    {
        title: "How to raise a Bill?",
        children:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapient laborum cupiditate possimus labore, hic temporibus velit dicta earu suscipit commodi eum enim atque at? Et perspiciatis dolore iure voluptatem.",
    },
    {
        title: "How to Collect Cash Payment? ",
        children: "Collect",
    },
    {
        title: "How to Collect Online Payment?",
        children: "online mode",
    },
];