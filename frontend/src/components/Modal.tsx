import { createContext, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ChildrenProp = React.ReactNode | React.ReactElement | React.ReactElement[];

interface ModalProviderProps {
  children: ChildrenProp,
  size: 'sm' | 'md' | 'lg',
  isOpen?: boolean,
  onClose: ()=> void
}

type ContextValue = Omit<ModalProviderProps, 'children'> | undefined

interface ModalGeneralProps {
  children?: ChildrenProp
  className?: string
}

export const ModalContext = createContext<ContextValue>(undefined);

const Modal: React.FC<ModalProviderProps> = ({
  children,
  size,
  isOpen = false,
  onClose,
}) => {
  useEffect(() => {
    document.body.style.overflowY = isOpen ? "hidden" : "scroll";
  }, [isOpen]);

  const classNameVisibility = !isOpen ? "hidden" : "flex justify-center items-center"

  return (
    <ModalContext.Provider value={{ size, isOpen, onClose }}>
      {isOpen
        ? createPortal(
            <div className={`${classNameVisibility} fixed left-0 top-0 w-full h-full z-20 bg-black bg-opacity-60`} onClick={onClose}>
              {children}
            </div>,
            document.body
          )
        : ""
      }
    </ModalContext.Provider>
  );
};

// export const ModalOverlay = ()=> {
//   const { onClose } = useContext(ModalContext)!;

//   return <div onClick={onClose} className='fixed z-10 left-0 top-0 w-full h-full bg-black bg-opacity-50'></div>
// }

export const ModalContent: React.FC<ModalGeneralProps> = ({ children, className })=> {
  const { size } = useContext(ModalContext)!;

  const sizes = {
    'sm': 'sm:w-8/12 md:w-5/12 w-11/12',
    'md': 'w-7/12',
    'lg': 'w-10/12',
  }

  return (
    // <div className={`fixed left-0 top-0 flex justify-center items-center w-full h-full z-20`}>
      <div onClick={e=> e.stopPropagation()} className={`${className} relative rounded-lg p-4 max-h-[500px] overflow-auto ${sizes[size]} z-40`}>
        {children}
      </div>
    // </div>
  )
}

export const ModalHeader: React.FC<ModalGeneralProps> = ({ children, className = '' })=> {
  return <header className={`${className}`}>
    {children}
  </header>
}

export const ModalBody: React.FC<ModalGeneralProps> = ({ children, className = '' })=> {
  return <div className={`${className}`}>
    {children}
  </div>
}

export const ModalFooter: React.FC<ModalGeneralProps> = ({ children, className = '' }) => {
  return <footer className={`${className}`}>
    {children}
  </footer>
}

export const ButtonCloseModal = ()=> {
  const { onClose } = useContext(ModalContext)!;

  return (
    <button
      onClick={onClose}
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    >
      ✕
    </button>
  )
}

export default Modal;