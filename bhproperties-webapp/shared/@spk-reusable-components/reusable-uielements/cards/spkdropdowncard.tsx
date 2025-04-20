
import React, { Fragment } from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import SpkDropdown from '../spk-dropdown'

interface Dropdowncardtype {
    Text?: string;
    Imgsrc?: string;
    Gender?: string;
    Date?: string;
    Role?: string;
    Title?: string;
    Navigate: string;
}

const SpkDropdowncard: React.FC<Dropdowncardtype> = ({ Text, Imgsrc, Gender, Date, Role, Title, Navigate }) => {
    return (
        <Fragment>
            <Card className="custom-card">
                <Card.Header className="">
                    <div className="d-flex align-items-center w-100">
                        <div className="me-2">
                            <span className="avatar avatar-rounded">
                                <img src={Imgsrc} alt="img" />
                            </span>
                        </div>
                        <div className="">
                            <div className="fs-15 fw-medium">{Title}</div>
                            <p className="mb-0 text-muted fs-11">{Gender}</p>
                        </div>
                        <SpkDropdown Togglevariant="light" Customclass="ms-auto" Customtoggleclass="btn-icon btn-sm  no-caret" Icon={true} IconClass='fe fe-more-vertical' >
                            <Dropdown.Item href={Navigate}>Week</Dropdown.Item>
                            <Dropdown.Item href={Navigate}>Month</Dropdown.Item>
                            <Dropdown.Item href={Navigate}>Year</Dropdown.Item>
                        </SpkDropdown>
                    </div>
                </Card.Header>
                <Card.Body>
                    {Text}
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div className="fs-semibold fs-14">{Date}</div>
                        <div className="fw-medium text-success">{Role}</div>
                    </div>
                </Card.Footer>
            </Card>
        </Fragment>
    )
}

export default SpkDropdowncard