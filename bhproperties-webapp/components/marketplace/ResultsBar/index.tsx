"use client";
import { Row, Col, Card, ButtonGroup, Dropdown } from "react-bootstrap";
import SpkDropdown from "@/shared/@spk-reusable-components/reusable-uielements/spk-dropdown";

const ResultsBar: React.FC<{ total:number }> = ({ total }) => (
  <Row className="mb-3">
    <Col>
      <Card className="custom-card">
        <Card.Body className="p-3">
          <Row className="align-items-center gy-2">
            <Col sm={8}>
              <h6 className="mb-0">
                Total <span className="fw-semibold text-primary1">{total}</span>
                &nbsp;Properties&nbsp;Available
              </h6>
            </Col>
            <Col sm={4} className="text-sm-end text-start">
              <SpkDropdown as={ButtonGroup} toggleas="a"
                Customtoggleclass="border no-caret btn-outline-light"
                Toggletext="Sort By" iconPosition="before"
                Icon IconClass="ti ti-sort-descending-2 me-1" Arrowicon>
                <Dropdown.Item>Date Published</Dropdown.Item>
                <Dropdown.Item>Most Relevant</Dropdown.Item>
                <Dropdown.Item>Price Low → High</Dropdown.Item>
                <Dropdown.Item>Price High → Low</Dropdown.Item>
              </SpkDropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default ResultsBar;
