import React, { Fragment } from 'react'
import { Card } from 'react-bootstrap'

interface profile {
    Personalinformation?: string;
    Imgsrc?: string;
    Name?: string;
    Role?: string;
    Posts?: string;
    Followers?: string;
    Following?: string;
}
const SpkProfilecard: React.FC<profile> = ({ Personalinformation, Imgsrc, Name, Role, Posts, Followers, Following }) => {
    return (
        <Fragment>
            <Card className="custom-card">
                <Card.Header>
                    <div className="d-flex w-100">
                        <div className="me-4">
                            <span className="avatar avatar-lg avatar-rounded">
                                <img src={Imgsrc} alt="img" />
                            </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between w-100 flex-wrap">
                            <div className="me-3">
                                <p className="text-muted mb-0">Posts</p>
                                <p className="fw-medium fs-16 mb-0">{Posts}</p>
                            </div>
                            <div className="me-3">
                                <p className="text-muted mb-0">Followers</p>
                                <p className="fw-medium fs-16 mb-0">{Followers}</p>
                            </div>
                            <div className="me-3">
                                <p className="text-muted mb-0">Following</p>
                                <p className="fw-medium fs-16 mb-0">{Following}</p>
                            </div>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="fw-medium fs-16">{Name}</div>
                    <div className="text-muted fs-11 mb-4">{Role}</div>
                    <p className="fs-14 fw-medium mb-1">About:</p>
                    <p className="mb-0 card-text">{Personalinformation} </p>
                </Card.Body>
            </Card>
        </Fragment>
    )
}

export default SpkProfilecard