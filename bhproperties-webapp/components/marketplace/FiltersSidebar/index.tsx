"use client";
import { useState } from "react";
import { Card, Collapse } from "react-bootstrap";
import Link from "next/link";

const FilterSidebar: React.FC = () => {
  const [openCats, setOpenCats]   = useState(false);
  const [openSizes, setOpenSizes] = useState(false);

  return (
    <Card className="custom-card products-navigation-card">
      <Card.Header className="justify-content-between">
        <Card.Title>Filter</Card.Title>
        <Link href="#" className="text-decoration-underline fw-medium text-primary2">
          Clear&nbsp;All
        </Link>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="p-3 border-bottom">
          <h6 className="fw-semibold mb-0">Categories</h6>
          <div className="py-3 pb-0">
            <Collapse in={openCats}><div id="category-more" /></Collapse>
            <Link href="#"
              className="ecommerce-more-link"
              onClick={() => setOpenCats(!openCats)}>
              MORE
            </Link>
          </div>
        </div>

        <div className="p-3">
          <h6 className="fw-semibold mb-0">Sizes</h6>
          <div className="py-3 pb-0">
=            <Collapse in={openSizes}><div id="sizes-more" /></Collapse>
            <Link href="#"
              className="ecommerce-more-link mt-3"
              onClick={() => setOpenSizes(!openSizes)}>
              MORE
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FilterSidebar;
