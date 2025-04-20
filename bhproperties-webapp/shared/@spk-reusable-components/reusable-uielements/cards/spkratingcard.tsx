import React, { Fragment } from 'react'
import { Card } from 'react-bootstrap'

interface ratingcard {
    Timevalue?: string
    Text?: string;
    Title?: string;
    Imgsrc?: string;
    Name?: string;
}
const Spkratingcard: React.FC<ratingcard> = ({ Timevalue, Title, Text, Imgsrc, Name }) => {
    return (
        <Fragment>
            <Card className="custom-card">
                <Card.Header className="border-bottom-0 pb-0">
                    <div>
                        <span className="text-warning me-1"><i className="bi bi-star-fill"></i></span>
                        <span className="text-warning me-1"><i className="bi bi-star-fill"></i></span>
                        <span className="text-warning me-1"><i className="bi bi-star-fill"></i></span>
                        <span className="text-warning me-1"><i className="bi bi-star-fill"></i></span>
                        <span className="text-black op-1"><i className="bi bi-star-fill"></i></span>
                        <p className="d-block text-muted mb-0 fs-12 fw-medium">{Timevalue}</p>
                    </div>
                </Card.Header>
                <Card.Body className="pt-3">
                    <div className="fw-medium fs-15 mb-2">{Title}</div>
                    {Text}
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm avatar-rounded me-2">
                            <img src={Imgsrc} alt="img" />
                        </span>
                        <div className="fw-medium fs-14">{Name}</div>
                    </div>
                </Card.Footer>
            </Card>
        </Fragment>
    )
}

export default Spkratingcard