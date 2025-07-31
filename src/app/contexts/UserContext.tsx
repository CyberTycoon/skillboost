'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (userData: User) => void;
    signOut: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('trustwork_user')
        if (savedUser) {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            setIsAuthenticated(true)
        }
    }, [])

    const signIn = (userData: User) => {
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('trustwork_user', JSON.stringify(userData))
    }

    const signOut = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('trustwork_user')
    }

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates }
            setUser(updatedUser)
            localStorage.setItem('trustwork_user', JSON.stringify(updatedUser))
        }
    }

    const value = {
        user,
        isAuthenticated,
        signIn,
        signOut,
        updateUser
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
