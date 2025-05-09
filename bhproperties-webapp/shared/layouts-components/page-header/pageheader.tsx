import SpkBreadcrumb from '@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb'
import SpkButton from '@/shared/@spk-reusable-components/reusable-uielements/spk-button'
import Link from 'next/link'
import React, { Fragment } from 'react'

interface PageheaderProps {
  share: boolean;
  filter: boolean;
  title?: string;
  subtitle?: string;
  currentpage?: string;
  activepage?: string;
}

const Pageheader: React.FC<PageheaderProps> = ({
  share,
  filter,
  title,
  subtitle,
  currentpage,
  activepage
}) => {

  

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          {/* <nav> */}
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item"><Link href="#!">{title}</Link></li>
            {subtitle && (
              <li className="breadcrumb-item">
                <Link href="#!">{subtitle}</Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">{currentpage}</li>
          </SpkBreadcrumb>
          {/* </nav> */}
          <h1 className="page-title fw-medium fs-18 mb-0">{activepage}</h1>
        </div>
        <div className="btn-list">

          {filter && (
          <SpkButton Buttonvariant="white">
            <i className="ri-filter-3-line align-middle me-1 lh-1"></i> Filter
          </SpkButton>
          )}
          { share && (
            <SpkButton Buttonvariant='primary' Customclass="me-0">
              <i className="ri-share-forward-line me-1"></i> Share
            </SpkButton>
          )}

        </div>
      </div>
    </Fragment>
  )
}

export default Pageheader