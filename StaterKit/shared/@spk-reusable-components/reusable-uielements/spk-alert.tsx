import React, { Fragment } from 'react'
import { Alert } from 'react-bootstrap'

interface AlertProps {
  CustomClass?: string
  Id?: string
  variant?: string
  dismissible?: boolean
  show?: boolean
  closeLabel?: string
  onClose?: () => void
  children?: React.ReactNode
}

const SpkAlert: React.FC<AlertProps> = ({
  CustomClass,
  Id,
  variant,
  dismissible = false,
  show = true,
  closeLabel,
  onClose,
  children,
  ...rest
}) => (
  <Fragment>
    <Alert
      variant={variant}
      className={CustomClass}
      role="alert"
      id={Id}
      dismissible={dismissible}
      show={show}
      closeLabel={closeLabel}
      onClose={onClose}
      {...rest}
    >
      {children}
    </Alert>
  </Fragment>
)

export default SpkAlert
