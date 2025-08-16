'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Clock, AlertCircle, Github, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '../contexts/UserContext'

const Verification = () => {
    const { user, updateUser } = useUser()
    const router = useRouter()
    const [formData, setFormData] = useState({
        // Freelancer fields
        skills: user?.skills?.join(', ') || '',
        githubProfile: user?.githubProfile || '',
        portfolioLinks: user?.portfolioLinks?.join('\n') || '',
        experience: user?.experience || '',

        // Client fields
        companyName: user?.companyName || '',
        companyWebsite: user?.companyWebsite || '',
        jobCategories: user?.jobCategories?.join(', ') || '',
        companyDescription: user?.companyDescription || ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            })
        }
    }

    const validateFreelancerForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.skills.trim()) {
            newErrors.skills = 'Skills are required'
        }

        if (!formData.experience.trim()) {
            newErrors.experience = 'Experience description is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateClientForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required'
        }

        if (!formData.jobCategories.trim()) {
            newErrors.jobCategories = 'Job categories are required'
        }

        if (!formData.companyDescription.trim()) {
            newErrors.companyDescription = 'Company description is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const isValid = user?.role === 'freelancer'
            ? validateFreelancerForm()
            : validateClientForm()

        if (!isValid) return

        // Update user with verification data and set status to pending
        const updates: any = {
            status: 'pending',
            verificationSubmittedAt: new Date().toISOString()
        }

        if (user?.role === 'freelancer') {
            updates.skills = formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            updates.githubProfile = formData.githubProfile
            updates.portfolioLinks = formData.portfolioLinks.split('\n').map((s: string) => s.trim()).filter(Boolean)
            updates.experience = formData.experience
        } else {
            updates.companyName = formData.companyName
            updates.companyWebsite = formData.companyWebsite
            updates.jobCategories = formData.jobCategories.split(',').map((s: string) => s.trim()).filter(Boolean)
            updates.companyDescription = formData.companyDescription
        }

        updateUser(updates)
        router.push('/dashboard')
    }

    const getStatusIcon = () => {
        switch (user?.status) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'pending':
                return <Clock className="w-5 h-5 text-orange-500" />
            case 'rejected':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />
        }
    }

    const getStatusText = () => {
        switch (user?.status) {
            case 'approved':
                return 'Verified'
            case 'pending':
                return 'Under Review'
            case 'rejected':
                return 'Verification Failed'
            default:
                return 'Not Verified'
        }
    }

    const getStatusColor = () => {
        switch (user?.status) {
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-orange-100 text-orange-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (user?.status === 'approved') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <CardTitle className="text-2xl text-green-600">Verification Complete!</CardTitle>
                            <CardDescription>
                                Your account has been successfully verified and approved.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600 mb-6">
                                You now have full access to all TrustWork features. Start {user?.role === 'freelancer' ? 'offering your services' : 'posting jobs'} today!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button onClick={() => router.push('/dashboard')} className="bg-green-500 hover:bg-green-600">
                                    Go to Dashboard
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push(user?.role === 'freelancer' ? '/offer-service' : '/post-job')}
                                >
                                    {user?.role === 'freelancer' ? 'Offer a Service' : 'Post a Job'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Verification</h1>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        {getStatusIcon()}
                        <Badge className={getStatusColor()}>
                            {getStatusText()}
                        </Badge>
                    </div>
                    <p className="text-gray-600">
                        Complete your verification to access all TrustWork features
                    </p>
                </div>

                {user?.status === 'pending' ? (
                    <Card>
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-orange-500" />
                            </div>
                            <CardTitle className="text-xl text-orange-600">Verification Under Review</CardTitle>
                            <CardDescription>
                                Your verification request is being processed by our team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                <p className="text-orange-700 text-sm">
                                    <strong>What happens next?</strong><br />
                                    Our verification team will review your information within 24-48 hours.
                                    You'll receive an email notification once the review is complete.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">While you wait, you can:</h4>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Browse available {user?.role === 'freelancer' ? 'jobs' : 'services'}
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Explore different categories
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Complete your profile
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Read our community guidelines
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-6 text-center">
                                <Button onClick={() => router.push('/dashboard')} variant="outline">
                                    Go to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {user?.role === 'freelancer' ? 'Freelancer' : 'Client'} Verification
                            </CardTitle>
                            <CardDescription>
                                Please provide the following information to verify your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {user?.role === 'freelancer' ? (
                                    <>
                                        <div>
                                            <Label htmlFor="skills">Skills *</Label>
                                            <Input
                                                id="skills"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="e.g., React, Node.js, Python, Design"
                                                className={errors.skills ? 'border-red-500' : ''}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                                            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="githubProfile">GitHub Profile</Label>
                                            <div className="relative">
                                                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="githubProfile"
                                                    name="githubProfile"
                                                    value={formData.githubProfile}
                                                    onChange={handleChange}
                                                    placeholder="https://github.com/yourusername"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="portfolioLinks">Portfolio Links</Label>
                                            <Textarea
                                                id="portfolioLinks"
                                                name="portfolioLinks"
                                                value={formData.portfolioLinks}
                                                onChange={handleChange}
                                                placeholder="https://yourportfolio.com&#10;https://dribbble.com/yourusername&#10;https://behance.net/yourusername"
                                                rows={4}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">One link per line</p>
                                        </div>

                                        <div>
                                            <Label htmlFor="experience">Experience Description *</Label>
                                            <Textarea
                                                id="experience"
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                placeholder="Describe your professional experience, notable projects, and expertise..."
                                                rows={4}
                                                className={errors.experience ? 'border-red-500' : ''}
                                            />
                                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <Label htmlFor="companyName" className='mb-2'>Company/Organization Name *</Label>
                                            <Input
                                                id="companyName"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                placeholder="Your company or organization name"
                                                className={errors.companyName ? 'border-red-500' : ''}
                                            />
                                            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="companyWebsite" className='mb-2'>Company Website</Label>
                                            <div className="relative">
                                                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="companyWebsite"
                                                    name="companyWebsite"
                                                    value={formData.companyWebsite}
                                                    onChange={handleChange}
                                                    placeholder="https://yourcompany.com"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="jobCategories" className='mb-2'>Intended Job Categories *</Label>
                                            <Input
                                                id="jobCategories"
                                                name="jobCategories"
                                                value={formData.jobCategories}
                                                onChange={handleChange}
                                                placeholder="e.g., Web Development, Design, Marketing"
                                                className={errors.jobCategories ? 'border-red-500' : ''}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Separate categories with commas</p>
                                            {errors.jobCategories && <p className="text-red-500 text-sm mt-1">{errors.jobCategories}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="companyDescription" className='mb-2'>Company Description *</Label>
                                            <Textarea
                                                id="companyDescription"
                                                name="companyDescription"
                                                value={formData.companyDescription}
                                                onChange={handleChange}
                                                placeholder="Describe your company, industry, and the types of projects you typically work on..."
                                                rows={4}
                                                className={errors.companyDescription ? 'border-red-500' : ''}
                                            />
                                            {errors.companyDescription && <p className="text-red-500 text-sm mt-1">{errors.companyDescription}</p>}
                                        </div>
                                    </>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">Verification Process</h4>
                                    <p className="text-blue-700 text-sm">
                                        Our team will review your information within 24-48 hours. You'll receive an email
                                        notification once your verification is complete.
                                    </p>
                                </div>

                                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                                    Submit for Verification
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Verification
