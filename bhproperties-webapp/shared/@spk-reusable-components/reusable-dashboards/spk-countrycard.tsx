
import React, { Fragment } from 'react';
import SpkProgress from '../reusable-uielements/spk-progress';

interface SpkCountrycardProps {
    src?: string;
    states?: string;
    count?: number | any;
    now?: any;
    color?: string;
    listClass?: string;
}

const SpkCountrycard: React.FC<SpkCountrycardProps> = ({ src, states, count, now, color, listClass }) => {

    return (
        <Fragment>
            <li className={listClass}>
                <div className="d-flex align-items-start gap-3">
                    {src && (
                        <div className="lh-1">
                            <span className="avatar avatar-sm p-1 bg-light border">
                                <img src={src} alt="img" />
                            </span>
                        </div>
                    )}
                    <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                            <span className="d-block fw-medium mb-2 lh-1">{states}</span>
                            <span className="fs-14 fw-medium d-block lh-1">{count}</span>
                        </div>
                        <SpkProgress variant={color} mainClass="progress-md p-1" striped={true} animated={true} now={now} />
                    </div>
                </div>
            </li>
        </Fragment>
    );
};

export default SpkCountrycard;
