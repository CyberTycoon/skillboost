'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'freelancer' | 'client';
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (userData: any) => void;
    signOut: () => void;
    updateUser: (updates: Partial<User>) => void;
    signupPayload: Partial<any> | null;
    updateSignupPayload: (payload: Partial<any>) => void;
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
    const [signupPayload, setSignupPayload] = useState<Partial<any> | null>(null)

    // Load user and signupPayload from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('trustwork_user')
        if (savedUser) {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            setIsAuthenticated(true)
        }
        const savedPayload = localStorage.getItem('trustwork_signup_payload');
        if (savedPayload) {
            setSignupPayload(JSON.parse(savedPayload));
        }
    }, [])

    const signIn = (data: any) => {
        const userData = { ...data.user, ...data.profile };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('trustwork_user', JSON.stringify(userData));
        localStorage.setItem('trustwork_token', data.token);
        // Clear signup payload on successful sign in or registration
        localStorage.removeItem('trustwork_signup_payload');
        setSignupPayload(null);
    };

    const signOut = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('trustwork_user');
        localStorage.removeItem('trustwork_token');
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates }
            setUser(updatedUser)
            localStorage.setItem('trustwork_user', JSON.stringify(updatedUser))
        }
    }

    const updateSignupPayload = (payload: Partial<any>) => {
        const newPayload = { ...signupPayload, ...payload };
        setSignupPayload(newPayload);
        localStorage.setItem('trustwork_signup_payload', JSON.stringify(newPayload));
    };

    const value = {
        user,
        isAuthenticated,
        signIn,
        signOut,
        updateUser,
        signupPayload,
        updateSignupPayload
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
