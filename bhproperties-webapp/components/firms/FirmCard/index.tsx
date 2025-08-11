import React from 'react';
import Link  from 'next/link';
import { Card } from 'react-bootstrap';

/* ------------ shared type ------------------------------------- */
export type Firm = {
  firm_id        : number;
  firm_name      : string;
  logo_url      ?: string | null;
  phone_number  ?: string | null;
  website       ?: string | null;
  listings_count?: number | null;
};

const placeholder = 'https://placehold.co/120x120?text=Broker';

const FirmCard: React.FC<{ firm: Firm }> = ({ firm }) => {

  const logoSrc =
    !firm.logo_url
      ? placeholder
      : /^(https?:)?\/\//.test(firm.logo_url)     
          ? firm.logo_url
          : `${process.env.NEXT_PUBLIC_API_URL}${firm.logo_url}`;

  const listings = Number(firm.listings_count ?? 0);

  return (
    <Link
      href={`/${firm.firm_name}`}
      className="text-reset text-decoration-none"
    >
      <Card className="shadow-sm h-100 p-3 d-flex flex-row align-items-center">
        {/* --- logo ------------------------------------------- */}
        <img
          src={logoSrc}
          alt={firm.firm_name}
          style={{
            width: 128,
            height: 128,
            objectFit: 'cover',
            borderRadius: 8,
          }}
        />

        {/* --- info ------------------------------------------- */}
        <div className="ms-3 flex-grow-1 text-truncate">
          <h6 className="fw-semibold mb-1 text-truncate">
            {firm.firm_name}
          </h6>

          <small className="text-muted">
            {listings} listing{listings === 1 ? '' : 's'}
          </small>
        </div>
      </Card>
    </Link>
  );
};

export default FirmCard;
