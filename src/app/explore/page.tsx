'use client'

import { useState } from 'react'
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Explore = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    // Mock data for services
    const services = [
        {
            id: 1,
            title: "I will create a modern React website for your business",
            freelancer: "Sarah Johnson",
            rating: 4.9,
            reviews: 127,
            price: 299,
            delivery: "3 days",
            image: "/api/placeholder/300/200",
            category: "Programming & Tech",
            verified: true
        },
        {
            id: 2,
            title: "I will design a professional logo and brand identity",
            freelancer: "Mike Chen",
            rating: 4.8,
            reviews: 89,
            price: 150,
            delivery: "2 days",
            image: "/api/placeholder/300/200",
            category: "Graphics & Design",
            verified: true
        },
        {
            id: 3,
            title: "I will write SEO-optimized content for your website",
            freelancer: "Emma Davis",
            rating: 4.9,
            reviews: 156,
            price: 75,
            delivery: "1 day",
            image: "/api/placeholder/300/200",
            category: "Writing & Translation",
            verified: true
        },
        {
            id: 4,
            title: "I will create engaging social media marketing campaigns",
            freelancer: "Alex Rodriguez",
            rating: 4.7,
            reviews: 203,
            price: 199,
            delivery: "5 days",
            image: "/api/placeholder/300/200",
            category: "Digital Marketing",
            verified: true
        }
    ]

    // Mock data for jobs
    const jobs = [
        {
            id: 1,
            title: "Need a React developer for e-commerce website",
            client: "TechStart Inc.",
            budget: "₦1,000 - ₦2,500",
            timeline: "2 weeks",
            description: "Looking for an experienced React developer to build a modern e-commerce platform...",
            category: "Programming & Tech",
            posted: "2 hours ago",
            proposals: 12,
            verified: true
        },
        {
            id: 2,
            title: "Logo design for new startup",
            client: "GreenTech Solutions",
            budget: "₦200 - ₦500",
            timeline: "1 week",
            description: "We need a creative logo designer to create a modern, clean logo for our environmental tech startup...",
            category: "Graphics & Design",
            posted: "5 hours ago",
            proposals: 8,
            verified: true
        },
        {
            id: 3,
            title: "Content writer for blog articles",
            client: "Digital Marketing Pro",
            budget: "₦50 - ₦100",
            timeline: "3 days",
            description: "Seeking a skilled content writer to create engaging blog posts about digital marketing trends...",
            category: "Writing & Translation",
            posted: "1 day ago",
            proposals: 15,
            verified: true
        }
    ]

    const categories = [
        'All',
        'Programming & Tech',
        'Graphics & Design',
        'Digital Marketing',
        'Writing & Translation',
        'Video & Animation',
        'Music & Audio',
        'Business'
    ]

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.freelancer.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' ||
            service.category.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.client.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' ||
            job.category.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore AfroTask</h1>

                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search services or jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 text-lg"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </Button>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category.toLowerCase())}
                                className={selectedCategory === category.toLowerCase() ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="services" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="services">Services ({filteredServices.length})</TabsTrigger>
                        <TabsTrigger value="jobs">Jobs ({filteredJobs.length})</TabsTrigger>
                    </TabsList>

                    {/* Services Tab */}
                    <TabsContent value="services">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredServices.map((service) => (
                                <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-sm font-medium line-clamp-2 mb-2">
                                                    {service.title}
                                                </CardTitle>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">{service.freelancer}</span>
                                                    {service.verified && (
                                                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center space-x-1 mb-3">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{service.rating}</span>
                                            <span className="text-sm text-gray-500">({service.reviews})</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{service.delivery}</span>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">
                                                ₦{service.price}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Jobs Tab */}
                    <TabsContent value="jobs">
                        <div className="space-y-6">
                            {filteredJobs.map((job) => (
                                <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center space-x-1">
                                                        <span>{job.client}</span>
                                                        {job.verified && (
                                                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span>•</span>
                                                    <span>{job.posted}</span>
                                                </div>
                                                <CardDescription className="line-clamp-2">
                                                    {job.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-6 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Budget: </span>
                                                    <span className="font-medium">{job.budget}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Timeline: </span>
                                                    <span className="font-medium">{job.timeline}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Proposals: </span>
                                                    <span className="font-medium">{job.proposals}</span>
                                                </div>
                                            </div>
                                            <Badge variant="outline">{job.category}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* No Results */}
                {filteredServices.length === 0 && filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Explore

