import React, { Fragment } from 'react';
import SpkTooltips from '../reusable-uielements/spk-tooltips';
import { Card } from 'react-bootstrap';
import Link from 'next/link';

interface SpkProductsProps {
  onclick?: () => void;
  cartClick?: () => void;
  detailsClick?: () => void;
  shoBadge?: boolean;
  card?: any;
  badge?: string;
  idx?: any;
}

const SpkProducts: React.FC<SpkProductsProps> = ({ onclick, cartClick, detailsClick, shoBadge = false, card, badge, idx }) => {
  return (
    <Fragment>
      <Card className="custom-card card-style-2">
        <Card.Body className="p-0">
          <div className="top-left-badge">
            {shoBadge && badge && (
              <div className={`badge bg-${card.badgeColor} d-inline-flex gap-1 lh-1 align-items-center text-fixed-white mb-1`}>
                <div className="badge-icon"><i className="ti ti-bolt"></i>
                </div> <div className="badge-text">{card.badge}</div>
              </div>

            )}
            <span className={`badge bg-${card.color}`}>{card.discount1} Off</span>

          </div>
          <div className="card-img-top border-bottom border-block-end-dashed">
            <div className="btns-container-1 align-items-center gap-1">
              <SpkTooltips placement="top" title="Quick View">
                <Link href="#!" className="btn btn-icon btn-primary rounded-circle">
                  <i className="bx bx-search"></i>
                </Link>
              </SpkTooltips>
              <SpkTooltips placement="top" title="Add to Wishlist">
                <Link href="/components/apps/ecommerce/wishlist" onClick={onclick} className="btn btn-icon btn-primary1 rounded-circle">
                  <i className="bx bx-heart align-center"></i>
                </Link>
              </SpkTooltips>
              <SpkTooltips placement="top" title="Compare">
                <Link href="#!" className="btn btn-icon btn-info rounded-circle">
                  <i className="bx bx-adjust"></i>
                </Link>
              </SpkTooltips>
            </div>
            <div className="img-box-2 p-2">
              <img src={card.productpicture} alt="img" className="scale-img img-fluid w-100 bg-primary-transparent rounded" />
            </div>
            <SpkTooltips placement="top" title="Add to Cart">
              <Link href="/components/apps/ecommerce/cart" onClick={cartClick} className="btn btn-primary rounded-circle btn-style-1 btn-icon">
                <i className="bx bxs-cart-add fs-18"></i>
              </Link>
            </SpkTooltips>
          </div>
          <div className="p-3">
            <h6 className="mb-1 fw-semibold fs-16">
              <Link href={idx} onClick={detailsClick}>
                {card.title}
              </Link>
            </h6>
            <div className="d-flex align-items-end justify-content-between flex-wrap">
              <div className="flex-grow-1">
                <div className="d-flex align-items-baseline fs-11">
                  <div className="min-w-fit-content">
                    <span className="text-warning"><i className="bi bi-star-fill mx-1"></i></span>
                    <span className="text-warning"><i className="bi bi-star-fill mx-1"></i></span>
                    <span className="text-warning"><i className="bi bi-star-fill mx-1"></i></span>
                    <span className="text-warning"><i className="bi bi-star-half mx-1"></i></span>
                  </div>
                  <p className="mb-1 ms-1 min-w-fit-content text-muted">
                    <span>{card.rating}</span>
                    <span> Ratings</span>
                  </p>
                </div>
                <Link href="#!" className="text-primary1 fs-13 fw-semibold">
                  {card.status}
                </Link>
              </div>
              <div className="min-w-fit-content">
                <h5 className="fw-semibold text-primary mb-0">{card.price}</h5>
                <span className="fs-13 ms-2 text-muted text-decoration-line-through">{card.discount}</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkProducts;
