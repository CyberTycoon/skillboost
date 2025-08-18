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
    const { signupPayload, signIn, user } = useUser()
    const router = useRouter()
    const [formData, setFormData] = useState({
        // Freelancer fields
        skills: '',
        github_profile: '',
        portfolio_links: '',
        experience_description: '',
        education: '',

        // Client fields
        company_name: '',
        location: ''
    })
    const [isLoading, setIsLoading] = useState(false)
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

        if (!formData.experience_description.trim()) {
            newErrors.experience_description = 'Experience description is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateClientForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.company_name.trim()) {
            newErrors.company_name = 'Company name is required'
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const isValid = signupPayload?.role === 'freelancer'
            ? validateFreelancerForm()
            : validateClientForm()

        if (!isValid) return

        setIsLoading(true)
        setErrors({})

        const { role, ...restOfPayload } = signupPayload || {};
        let finalPayload = { ...restOfPayload };

        if (role === 'freelancer') {
            finalPayload = {
                ...finalPayload,
                skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                github_profile: formData.github_profile,
                portfolio_links: formData.portfolio_links.split('\n').map((s: string) => s.trim()).filter(Boolean),
                experience_description: formData.experience_description,
                education: formData.education,
            }
        } else {
            finalPayload = {
                ...finalPayload,
                company_name: formData.company_name,
                location: formData.location,
            }
        }

        const endpoint = role === 'freelancer' ? '/api/freelancer-signup' : '/api/client-signup';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors(data);
                return;
            }

            signIn(data);
            router.push('/signin');
        } catch (error) {
            console.error('Verification submission failed', error);
            setErrors({ form: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
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
                    <h1 className="text-3xl font-bold text-green-500 mb-4">Account <span className="text-amber-400">Verification</span></h1>
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
                                {signupPayload?.role === 'freelancer' ? 'Freelancer' : 'Client'} Verification
                            </CardTitle>
                            <CardDescription>
                                Please provide the following information to verify your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {signupPayload?.role === 'freelancer' ? (
                                    <>
                                        <div>
                                            <Label htmlFor="skills">Skills *</Label>
                                            <Input
                                                id="skills"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="e.g., React, Node.js, Python, Design"
                                                className={`${errors.skills ? 'border-red-500' : ''} mt-2`}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                                            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="github_profile">GitHub Profile</Label>
                                            <div className="relative mt-2">
                                                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    id="github_profile"
                                                    name="github_profile"
                                                    value={formData.github_profile}
                                                    onChange={handleChange}
                                                    placeholder="https://github.com/yourusername"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="portfolio_links">Portfolio Links</Label>
                                            <Textarea
                                                id="portfolio_links"
                                                name="portfolio_links"
                                                value={formData.portfolio_links}
                                                onChange={handleChange}
                                                placeholder="https://yourportfolio.com&#10;https://dribbble.com/yourusername&#10;https://behance.net/yourusername"
                                                rows={4}
                                                className='mt-2'
                                            />
                                            <p className="text-sm text-gray-500 mt-1">One link per line</p>
                                        </div>

                                        <div>
                                            <Label htmlFor="experience_description">Experience Description *</Label>
                                            <Textarea
                                                id="experience_description"
                                                name="experience_description"
                                                value={formData.experience_description}
                                                onChange={handleChange}
                                                placeholder="Describe your professional experience, notable projects, and expertise..."
                                                rows={4}
                                                className={`${errors.experience_description ? 'border-red-500' : ''} mt-2`}
                                            />
                                            {errors.experience_description && <p className="text-red-500 text-sm mt-1">{errors.experience_description}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="education">Education</Label>
                                            <Input
                                                id="education"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleChange}
                                                placeholder="e.g., B.Sc. in Computer Science"
                                                className="mt-2"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <Label htmlFor="company_name" className='mb-2'>Company/Organization Name *</Label>
                                            <Input
                                                id="company_name"
                                                name="company_name"
                                                value={formData.company_name}
                                                onChange={handleChange}
                                                placeholder="Your company or organization name"
                                                className={`${errors.company_name ? 'border-red-500' : ''} mt-2`}
                                            />
                                            {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="location" className='mb-2'>Location *</Label>
                                            <Input
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="e.g., New York, USA"
                                                className={`${errors.location ? 'border-red-500' : ''} mt-2`}
                                            />
                                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                        </div>
                                    </>
                                )}

                                {errors.form && <p className="text-red-500 text-sm mb-4 text-center">{errors.form}</p>}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">Verification Process</h4>
                                    <p className="text-blue-700 text-sm">
                                        Our team will review your information within 24-48 hours. You'll receive an email
                                        notification once your verification is complete.
                                    </p>
                                </div>

                                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>
                                    {isLoading ? 'Submitting...' : 'Submit for Verification'}
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
