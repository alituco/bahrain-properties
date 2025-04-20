import React from 'react';

const SpkActivityCard = ({ activityCard, showTime = false }: any) => {
    return (
        <li>
            <div>
                <div className='d-flex justify-content-between'>
                    <div className="fw-medium fs-14">{activityCard?.activityUser}</div>
                    {showTime && (
                        <span className="fs-12 activity-time">
                            {activityCard?.activityTime}
                        </span>
                    )}
                </div>
                <span
                    className="d-block text-muted"
                    dangerouslySetInnerHTML={{ __html: activityCard?.activityDesc }}
                />
            </div>
        </li>
    );
};

export default SpkActivityCard;
