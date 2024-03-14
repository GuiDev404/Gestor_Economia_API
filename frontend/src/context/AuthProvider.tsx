import React, { createContext, useCallback, useMemo } from 'react'
import { KEY_STORAGE, getStorage, setStorage } from '../utils/storage'
import { User } from '../types';
import useStorage from '../hooks/useStorage';

type ContextValues = {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
  isLogged: () => boolean;
} | null

interface AuthProviderProps {
  children: string | JSX.Element | JSX.Element[]
}

export const AuthContext = createContext<ContextValues>(null);

const AuthProvider:React.FC<AuthProviderProps> = ({ children }) => {
  const { storage, addData, removeItem } = useStorage<User>(KEY_STORAGE);

  const login = useCallback((userData: User)=> {
    addData(userData)
    // setStorage(KEY_STORAGE, userData)
  }, [addData])

  const logout = useCallback(()=> {
    // setStorage(KEY_STORAGE, null)
    removeItem()
  }, [removeItem])

  const contextValue = useMemo(()=> {
 
    return {
      user: {
        accessToken: storage?.accessToken ? `Bearer ${storage.accessToken}` : null, 
        refreshToken: storage?.refreshToken ? `Bearer ${storage.refreshToken}` : null, 
        rol: storage?.rol,
        userId: storage?.userId
      },
      login,
      logout,
      isLogged: ()=> !!storage?.accessToken
    }
  }, [storage, login, logout])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider