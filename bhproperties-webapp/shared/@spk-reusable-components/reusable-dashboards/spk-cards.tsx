import React, { Fragment } from 'react';
import { Card } from 'react-bootstrap';

interface SpkcardscomponentProps {
    cardClass?: string;
    Icon?: boolean;
    textbefore?: boolean;
    textafter?: boolean;
    svgIcon?: JSX.Element;
    mainClass?: string;
    parentClass?: string;
    card?: any;
    badgeClass?: string
    dataClass?: string
    headingClass?: string
    badgeColor?: string;
    iconClass?: string;
}

const Spkcardscomponent: React.FC<SpkcardscomponentProps> = ({ card, cardClass, textbefore=false, textafter=true, Icon, svgIcon, mainClass, parentClass, dataClass, badgeClass, headingClass, badgeColor, iconClass }) => {

    return (
        <Fragment>
            <Card className={`custom-card ${cardClass}`}>
                <Card.Body>
                    <div className={`${mainClass}`}>
                        <div className={parentClass}>
                            <span className={`text-muted ${headingClass}`}>{card.title}</span>
                            <h4 className={`fw-medium  ${dataClass}`}>{card.count}</h4>
                            {textbefore ? 
                            <div className="text-muted fs-13 d-inline-flex">
                                {card.inc}
                                <span className={`text-${card.color} ms-1`}>{card.percentageChange}   <i className={` ${card.icon} fs-16`}></i>
                                </span>
                            </div>: ""}
                        </div>

                        <div className={`avatar avatar-${badgeClass} bg-${card.backgroundColor} ${badgeColor} `}>
                            {svgIcon || (Icon ? <i className={` ${iconClass} fs-5`} /> : null)}
                        </div>
                    </div>
                    {textafter ?<div className="text-muted fs-13 d-inline-flex">
                        {card.inc}
                        <span className={`text-${card.color} ms-1`}>{card.percentageChange}   <i className={` ${card.icon} fs-16`}></i>
                        </span>
                    </div>: ""}
                </Card.Body>
            </Card>

        </Fragment>
    );
}

export default Spkcardscomponent;
