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
    signupPayload: Partial<any> | null;
    updateSignupPayload: (payload: Partial<any> | null) => void;
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

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('trustwork_token');
        if (token) {
            try {
                const res = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    const userData = { ...data.user, ...data.profile };
                    setUser(userData);
                    setIsAuthenticated(true);
                    localStorage.setItem('trustwork_user', JSON.stringify(userData));
                } else {
                    // Token might be invalid, so sign out
                    signOut();
                }
            } catch (error) {
                console.error('Failed to fetch user profile', error);
                signOut();
            }
        }
    };

    // Load user and signupPayload from localStorage on mount
    useEffect(() => {
        fetchUserProfile();
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

    const signOut = async () => {
        const token = localStorage.getItem('trustwork_token');
        if (token) {
            try {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
            } catch (error) {
                console.error('Failed to logout from backend', error);
            }
        }
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('trustwork_user');
        localStorage.removeItem('trustwork_token');
    };

    const updateSignupPayload = (payload: Partial<any> | null) => {
        if (payload) {
            const newPayload = { ...signupPayload, ...payload };
            setSignupPayload(newPayload);
            localStorage.setItem('trustwork_signup_payload', JSON.stringify(newPayload));
        } else {
            setSignupPayload(null);
            localStorage.removeItem('trustwork_signup_payload');
        }
    };

    const value = {
        user,
        isAuthenticated,
        signIn,
        signOut,
        signupPayload,
        updateSignupPayload
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
