'use client'
import Link from 'next/link'
import { CheckCircle, Clock, AlertCircle, Plus, Eye, Briefcase, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '../contexts/UserContext'
import { useUI } from '../contexts/UIContext'

const Dashboard = () => {
  const { user } = useUser()
  const { showRestrictedModal } = useUI()

  const getStatusIcon = () => {
    if (user?.is_verified) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (user?.is_pending_review) {
      return <Clock className="w-5 h-5 text-orange-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }

  const getStatusText = () => {
    if (user?.is_verified) {
      return 'Verified';
    }
    if (user?.is_pending_review) {
      return 'Under Review';
    }
    return 'Not Verified';
  }

  const getStatusColor = () => {
    if (user?.is_verified) {
      return 'bg-green-100 text-green-800';
    }
    if (user?.is_pending_review) {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
  }

  const handleRestrictedAction = (action) => {
    if (!user?.is_verified) {
      showRestrictedModal(action)
      return
    }
    // If approved, navigate to the actual page
    // This would be handled by the Link component
  }

  const stats = [
    {
      title: user?.user_type === 'freelancer' ? 'Active Services' : 'Posted Jobs',
      value: '0',
      icon: user?.user_type === 'freelancer' ? Briefcase : Plus,
      color: 'text-blue-600'
    },
    {
      title: user?.user_type === 'freelancer' ? 'Total Earnings' : 'Active Hires',
      value: user?.user_type === 'freelancer' ? '₦0' : '0',
      icon: user?.user_type === 'freelancer' ? Users : Users,
      color: 'text-green-600'
    },
    {
      title: 'Profile Views',
      value: '0',
      icon: Eye,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your {user?.user_type === 'freelancer' ? 'services and projects' : 'job postings and hires'}
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span>Account Status</span>
                </CardTitle>
                <CardDescription>
                  Your current verification status
                </CardDescription>
              </div>
              <Badge className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {user?.is_verified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700">
                  🎉 Your account is verified! You have full access to all TrustWork features.
                </p>
              </div>
            ) : user?.is_pending_review ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-700">
                  ⏳ Your verification is under review. We'll notify you once it's complete.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 mb-3">
                  Complete your verification to access all features.
                </p>
                <Link href="/verification">
                  <Button size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                    Complete Verification
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with your {user?.user_type === 'freelancer' ? 'freelancing' : 'hiring'} journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.user_type === 'freelancer' ? (
                <>
                  {user?.is_verified ? (
                    <Link href="/offer-service">
                      <Button className="w-full justify-start bg-green-500 hover:bg-green-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Service
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full justify-start bg-green-500 hover:bg-green-600"
                      onClick={() => handleRestrictedAction('creating services')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Service
                    </Button>
                  )}
                  <Link href="/explore">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Available Jobs
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {user?.is_verified ? (
                    <Link href="/post-job">
                      <Button className="w-full justify-start bg-green-500 hover:bg-green-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full justify-start bg-green-500 hover:bg-green-600"
                      onClick={() => handleRestrictedAction('posting jobs')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </Button>
                  )}
                  <Link href="/explore">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Browse Freelancers
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Account created</span>
                  <span className="text-gray-400 ml-auto">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Today'}
                  </span>
                </div>
                {user?.user_type && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Selected role: {user.user_type === 'freelancer' ? 'Freelancer' : 'Client'}
                    </span>
                    <span className="text-gray-400 ml-auto">Today</span>
                  </div>
                )}
                {user?.is_pending_review && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Verification submitted</span>
                    <span className="text-gray-400 ml-auto">Today</span>
                  </div>
                )}
                {user?.is_verified && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Account verified</span>
                    <span className="text-gray-400 ml-auto">Today</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
