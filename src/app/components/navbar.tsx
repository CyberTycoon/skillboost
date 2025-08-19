'use client'
import { LogOut, Menu, Search, User, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Logo from './logo'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, isAuthenticated, signOut } = useUser()
    const navigate = useRouter()

    const handleSignOut = () => {
        signOut()
        navigate.push('/')
    }

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md relative">
            <Link href="/" className="flex items-center">
                <div className="rounded">
                    <Logo />
                </div>
            </Link>
            <div className="relative mx-4 md:mx-8 w-140">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search for any service..."
                    className="border border-gray-300 rounded-md p-2 pl-10 w-full"
                />
            </div>
            <div className="hidden md:flex items-center space-x-6">
                <Link
                    href="/explore"
                    className="text-gray-600 hover:text-green-500 transition-colors"
                >
                    Explore
                </Link>
                {!isAuthenticated ? (
                    <>
                        <Link
                            href="/signin"
                            className="text-gray-600 hover:text-green-500 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors shadow-md shadow-green-300"
                        >
                            Join Now
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/dashboard">
                            <Button variant="ghost" className='cursor-pointer'>Dashboard</Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <User className="w-4 h-4" />
                                    <span>{user?.first_name || 'User'}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className='cursor-pointer' onClick={() => navigate.push('/dashboard')}>
                                    Dashboard
                                </DropdownMenuItem>
                                {(!user?.is_verified && !user?.is_pending_review) && (
                                    <DropdownMenuItem className='cursor-pointer' onClick={() => navigate.push('/verification')}>
                                        Verification
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className='cursor-pointer' onClick={handleSignOut}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </div>
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-white/40 bg-opacity-50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 p-6 transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    } w-64 md:hidden`}
            >
                <div className="flex justify-between items-center mb-8">
                    <div className="rounded">
                        <Logo />
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="focus:outline-none">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex flex-col space-y-6">
                    <Link
                        href="/explore"
                        className="text-gray-600 hover:text-green-500 transition-colors text-lg"
                    >
                        Explore
                    </Link>
                    {!isAuthenticated ? (
                        <>
                            <Link
                                href="/signin"
                                className="text-gray-600 hover:text-green-500 transition-colors text-lg"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors shadow-md text-center text-lg"
                            >
                                Join
                            </Link>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-3 px-2 py-2 rounded-md bg-gray-100">
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-800">{user?.first_name || 'User'}</span>
                            </div>
                            <Link
                                href="/dashboard"
                                className="text-gray-600 hover:text-green-500 transition-colors text-lg pl-4"
                            >
                                Dashboard
                            </Link>
                            {(!user?.is_verified && !user?.is_pending_review) && (
                                <Link
                                    href="/verification"
                                    className="text-gray-600 hover:text-green-500 transition-colors text-lg pl-4"
                                >
                                    Verification
                                </Link>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="flex items-center text-red-500 hover:text-red-600 transition-colors text-lg pl-4 text-left"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
