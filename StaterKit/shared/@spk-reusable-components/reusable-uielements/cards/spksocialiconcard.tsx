import React, { Fragment } from 'react'
import { Card } from 'react-bootstrap'
import SpkButton from '../spk-button'

interface Social {
    Imgsrc?: string;
    Name?: string;
    Role?: string;
}
const SpkSocialiconcard: React.FC<Social> = ({ Name, Role, Imgsrc }) => {
    return (
        <Fragment>
            <Card className="custom-card text-center">
                <Card.Header className="border-bottom-0 pb-0">
                    <span className="ms-auto shadow-lg fs-17"><i className="ri-heart-fill text-danger"></i></span>
                </Card.Header>
                <Card.Body className="pt-1">
                    <span className="avatar avatar-xl avatar-rounded me-2 mb-2">
                        <img src={Imgsrc} alt="img" />
                    </span>
                    <div className="fw-medium fs-16">{Name}</div>
                    <p className="mb-4 text-muted fs-11">{Role}</p>
                    <div className="btn-list">
                        <SpkButton Buttonvariant="" Customclass="btn-icon btn-facebook">
                            <i className="ri-facebook-line"></i>
                        </SpkButton>
                        <SpkButton Buttonvariant="" Customclass="btn-icon btn-twitter">
                            <i className="ri-twitter-x-line"></i>
                        </SpkButton>
                        <SpkButton Buttonvariant="" Customclass="btn-icon btn-instagram">
                            <i className="ri-instagram-line"></i>
                        </SpkButton>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    )
}

export default SpkSocialiconcard