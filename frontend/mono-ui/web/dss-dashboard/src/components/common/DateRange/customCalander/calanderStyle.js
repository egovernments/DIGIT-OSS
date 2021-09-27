import variables from "../../../../styles/variables";


const styles = theme => ({
    mainDiv: {

    },
    root: {
        border: 'solid 1px #d9d9d9',
        borderRadius: 2,
        margin: 0,
        padding: 0,
        display: 'block',
        overflow: 'hidden',
        borderCollapse: 'collapse',
        fontFamily: "Robo",
        backgroundColor: variables.white,
        '& tbody': {
            backgroundColor: '#fcfcfc',
            '& tr': {
                fontFamily: 'Roboto',
                fontSize: 12,
                fontWeight: 500,
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                textAlign: 'center',
                color: '#000000',
                '& td': {
                    '& span': {
                        margin: 13,
                        cursor: 'pointer'
                    }
                }
            }
        }
    },
    tableHead: {
        borderRadius: 2,
        borderBottom: 'solid 1px #d9d9d9',
        backgroundColor: '#f6f6f6',
        '& tr': {
            height: 36,
            '& th': {
                fontFamily: 'Roboto',
                fontSize: 12,
                fontWeight: 500,
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                textAlign: 'center',
                color: '#000000',

            }
        }
    },
    calendarDate: {
        margin: 0,
        padding: 0,
        display: 'block',
    },
    calendarMonth: {
        width: '100%',
        margin: 0,
        padding: 0,
        width: 44,
        height: 49,
        borderSpacing: 0,
        borderCollapse: 'collapse',
        '& span': {
            margin: `24px !important`
        }
    },
    calendarYear: {
        width: '100%',
        margin: 0,
        padding: 0,
        width: 44,
        height: 49,
        borderSpacing: 0,
        borderCollapse: 'collapse',
        '& span': {
            margin: `36px !important`
        }
    },
    calendarDay: {
        width: '100%',
        margin: 0,
        padding: 0,
        height: 39,
        borderSpacing: 0,
        borderCollapse: 'collapse',

    },
    calNevi: {
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'table',
        borderSpacing: 0,
        borderCollapse: 'separate',
        backgroundColor: '#cd283c',
        borderRadius: '3px 3px 0 0',
        '-webkit-border-radius': '3px 3px 0 0',
    },
    rectangle: {
        height: '30px',
        borderRadius: '2px',
        display: 'flex',
        border: 'solid 1px #d9d9d9',
        backgroundColor: variables.white,
        textAlign: 'center',
        fontFamily: 'roboto',
        '& span': {
            margin: 'auto',
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 500,
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textAlign: 'center',
            color: '#000000',
        },
        '& svg:nth-child(1n)': {
            left: 0,
            margin: 'auto'
        },
        '& svg:nth-child(2n)': {
            transform: 'rotate(180deg)',
            margin: 'auto'
        }
    },
    calendarLabel: {
        cursor: 'pointer'
    },
    calButtonprev: {
        left: 0
    },
    calButtonNext: {
        right: 0,
        transform: 'rotate(180deg)',
    },
    divNext: {
        display: 'flex',
        minWidth: 24
    },
    divBack: {
        display: 'flex',
        minWidth: 24
    },
    today: {
        '& span': {
            color: 'red',
            fontWeight: 600
        }
    },
    selectedDay: {
        backgroundColor: "#fe7a51",
        borderRadius: '50%',
        '& span': {
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 500,
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textAlign: 'center',
            color: '#ffffff',
        }
    },
    selectedRange: {
        backgroundColor: '#ebebeb',
    },
    '@media (max-width: 1293px)': {
        root: {
            '& tbody': {
                '& tr': {
                    '& td': {
                        '& span': {
                            margin: 26
                        }
                    }
                }
            }
        },
        calendarDay: {
            height: 59
        }
    },
    '@media (max-width: 1024px)': {
        root: {
            '& tbody': {
                '& tr': {
                    '& td': {
                        '& span': {
                            margin: 25
                        }
                    }
                }
            }
        },
        calendarDay: {
            height: 25
        }
    },
    '@media (max-width: 768px)': {
        root: {
            '& tbody': {
                '& tr': {
                    '& td': {
                        '& span': {
                            margin: 12
                        }
                    }
                }
            }
        },
        calendarDay: {
            height: 42
        }
    },

    '@media (max-width: 375px)': {
        root: {
            '& tbody': {
                '& tr': {
                    '& td': {
                        '& span': {
                            margin: 7
                        }
                    }
                }
            }
        },
        calendarDay: {
            height: 22
        }
    },

});
export default styles;