
import Link from 'next/link'
import React, { Fragment } from 'react'

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer mt-auto py-3 bg-white text-center">
        <div className="container">
          <span className="text-muted"> Copyright © <span id="year"> 2025 </span>
            <span className="fw-medium text-primary"><Link href="https://spruko.com/" target='_blank'  > PMS Bahrain </Link></span> All rights reserved
          </span>
        </div>
      </footer>
    </Fragment>
  )
}

export default Footer