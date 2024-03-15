import { useState } from 'react'

interface useDisclosureParams {
  initialValue?: boolean
  cbOnClose?: ()=> void
}

const useDisclosure = ({ initialValue = false, cbOnClose }: useDisclosureParams = {}) => {
  const [ isOpen, setIsOpen ] = useState(initialValue)

  const toggle = ()=> setIsOpen(prevActive=> !prevActive)
  const onOpen = ()=> setIsOpen(true)
  const onClose = ()=> {
    setIsOpen(false)
    cbOnClose && cbOnClose()
  }

  return { isOpen, toggle, onClose, onOpen }
}

export default useDisclosure