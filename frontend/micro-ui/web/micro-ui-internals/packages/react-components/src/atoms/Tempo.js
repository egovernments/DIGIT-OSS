import React, { useState, useEffect } from "react";
import { Loader, CheckBox, Modal } from "..";

const Heading = (props) => {
    return <h1 style={{ marginLeft: "22px" }} className="heading-m BPAheading-m">{props.label}</h1>;
};

const Close = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#0B0C0C" />
    </svg>
);

const CloseBtn = (props) => {
    return (
        <div className="icon-bg-secondary" onClick={props.onClick} style={{ backgroundColor: "#FFFFFF" }}>
            <Close />
        </div>
    );
};


const Tempo = ({ t, styles, mdmsConfig = "", setMdmsConfig }) => {
    const [selectedData, setSelectedData] = useState({});
    const [showModal, setShowModal] = useState();
    const isMobile = window.Digit.Utils.browser.isMobile();

    const { isLoading, data: tempoData } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "common-masters", [{ name: mdmsConfig }]);

    useEffect(() => {
        if (mdmsConfig && !showModal) setShowModal(true)
    }, [mdmsConfig])

    useEffect(() => {
        if (tempoData?.["common-masters"]?.[mdmsConfig]) {
            setSelectedData(tempoData?.["common-masters"]?.[mdmsConfig]);
        }
    }, [tempoData])

    const closeModal = () => {
        setShowModal(false);
        setMdmsConfig("")
    }


    return (
        <div style={styles ? styles : {}}>
            {showModal ? <Modal
                headerBarMain={<Heading label={mdmsConfig ? t(`CCF_${mdmsConfig?.toUpperCase()}_HEADER`) : ""} />}
                headerBarEnd={<CloseBtn onClick={closeModal} />}
                actionCancelOnSubmit={closeModal}
                formId="modal-action"
                popupStyles={{ width: "720px", overflow: "auto" }}
                style={{ minHeight: "45px", height: "auto", width: "160px" }}
                hideSubmit={true}
                headerBarMainStyle={{ margin: "0px", height: "35px" }}
            >
                {isLoading ? <Loader /> : null}

                {!isLoading && <div style={{margin: isMobile ? "10px -10px 10px -12px" : "10px 10px 10px 5px"}}>
                    {selectedData?.length > 0 &&
                        selectedData?.map((value) =>
                            <div>
                                {value?.header &&
                                    <div style={{ fontWeight: "700", fontSize: "16px", margin: "10px 0px 10px 10px" }}>
                                        {t(value.header)}
                                    </div>}
                                {value?.paragragh?.length &&
                                    value.paragragh.map((para) =>
                                        <div style={{ fontSize: "16px", margin: "10px 0px 10px 10px" }}>
                                            {para?.paras?.map((value, index) => {
                                                return <span>
                                                    {/* {index == 0 && "CCF_PP"} */}
                                                    {value && <span>{`${t(value)}`}</span>}
                                                    {para?.linkLabels?.[index] && <a href={para?.links?.[index]} target={"_blank"} style={{color: "blue"}}>{`${t(para?.linkLabels?.[index])}`}</a>}
                                                    {/* {index == para?.paras?.length - 1 && "LABEL"} */}
                                                </span>
                                            })}
                                        </div>
                                    )
                                }
                                {value?.bulletinPoints?.length &&
                                    <div>
                                        <ul style={{ listStyleType: "disc", width: "90%", marginLeft: "10%", fontSize: "16px" }}>
                                            {value?.bulletinPoints?.map((point) => <li>{t(point)}</li>)}
                                        </ul>
                                    </div>
                                }
                                {value?.numericPoints?.length &&
                                    <div>
                                        <ol style={{ listStyleType: "decimal", width: "90%", marginLeft: "10%", fontSize: "16px" }}>
                                            {value.numericPoints.map((point) => <li>{t(point)}</li>)}
                                        </ol>
                                    </div>
                                }
                                {value?.subParagragh?.length &&
                                    value.subParagragh.map((subPara) =>
                                        <div style={{ fontSize: "16px", margin: "10px 0px 10px 10px" }}>
                                            {t(subPara)}
                                        </div>
                                    )
                                }
                            </div>
                        )}</div>}

            </Modal> : null}
        </div>
    );
};

export default Tempo;
