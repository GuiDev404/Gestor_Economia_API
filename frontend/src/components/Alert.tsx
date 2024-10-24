import React from "react"
import { ErrorIcon, InfoIcon, SuccessIcon, SvgIconProps, WarningIcon } from "./Icons"

type AlertProps = {
  type: 'error' | 'warning' | 'success' | 'info'
  message: string
} 

const alertIcons: { 
  [keyof in AlertProps['type']]: React.FC<SvgIconProps>
} = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon
}

const Alert = ({ type, message }: AlertProps) => {
  const IconComponent = alertIcons[type];

  return (
    <div role="alert" className={`alert alert-${type}  my-4`}>
      <IconComponent />
      <span>{message}</span>
    </div>
  );
}

export default Alert