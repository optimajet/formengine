import styles from './message.module.css'
import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'

interface UseToggle {
  isOpen: boolean,
  toggle: () => void,
  setOpen: (isOpen: boolean) => void,
  open: () => void,
  close: () => void
}

export const useToggle = (): UseToggle => {
  const [isOpen, setOpen] = useState(false)

  const toggle = useCallback(() => {
    setOpen((isOpen) => !isOpen)
  }, [])

  const close = useCallback(() => setOpen(false), [])
  const open = useCallback(() => setOpen(true), [])

  return useMemo(() => ({
    isOpen,
    toggle,
    setOpen,
    close,
    open
  }), [isOpen, toggle, setOpen, close, open])
}

interface MessageContext {
  open: (message: string) => void,
  close: () => void,
  isOpen: boolean,
  setOpen: (isOpen: boolean) => void,
  message: string
}

const MessageContext = createContext<MessageContext>({
  open: (_: string) => {
  },
  close: () => {
  },
  isOpen: false,
  setOpen: (_: boolean) => {
  },
  message: ''
})

export const MessageProvider = ({children}: { children: ReactNode }) => {
  const {isOpen, close, setOpen} = useToggle()
  const [message, setMessage] = useState<string>('')

  const openDialog = useCallback((msg: string) => {
    setMessage(msg)
    setOpen(true)
  }, [setOpen])

  const contextValue = useMemo(() => ({
    setOpen, isOpen, open: openDialog, close, message
  }), [isOpen, setOpen, openDialog, close, message])

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = (): MessageContext => useContext(MessageContext)

export const Message = ({open: propsOpen = false}: {
  open?: boolean
}) => {
  const {close, isOpen, setOpen, message} = useMessage()

  useEffect(() => {
    setOpen(propsOpen)
  }, [propsOpen, setOpen])

  return <dialog className={styles.dialog} open={isOpen}>
    <p dangerouslySetInnerHTML={{__html: message}}/>
    <form method="dialog">
      <button onClick={close}>OK</button>
    </form>
  </dialog>
}
