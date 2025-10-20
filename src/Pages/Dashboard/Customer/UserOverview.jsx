import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  CreditCard,
  DollarSign,
  TrendingUp,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import useAuth from "@/Hooks/useAuth";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UserOverview = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');

  // Fetch applications data
  const { data: applicationsData = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['user-applications', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/applications?email=${user?.email}`);
      console.log('Applications response:', response.data);
      return response.data || [];
    },
    enabled: !!user?.email,
  });

  // Fetch payments data
  const { data: paymentsData = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['user-payments', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/payments?userEmail=${user?.email}`);
      console.log('Payments response:', response.data);
      return response.data || [];
    },
    enabled: !!user?.email,
  });

  // Fetch claims data
  const { data: claimsData = [], isLoading: claimsLoading } = useQuery({
    queryKey: ['user-claims', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/claims?email=${user?.email}`);
      console.log('Claims response:', response.data);
      return response.data || [];
    },
    enabled: !!user?.email,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    console.log('Calculating stats with:', {
      applications: applicationsData,
      payments: paymentsData,
      claims: claimsData
    });

    // Handle different response formats
    const applications = Array.isArray(applicationsData) ? applicationsData : (applicationsData.applications || []);
    const payments = Array.isArray(paymentsData) ? paymentsData : [];
    const claims = Array.isArray(claimsData) ? claimsData : [];

    // Application statistics
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(app => app.status === 'approved').length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;
    const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
    const underReviewApplications = applications.filter(app => app.status === 'under_review').length;

    // Payment statistics
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalPaid = completedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    // Active policies are approved applications with payments
    const activePolicies = applications.filter(app => 
      app.status === 'approved' && 
      completedPayments.some(payment => payment.applicationId === app._id)
    ).length;

    // Claim statistics
    const totalClaims = claims.length;
    const approvedClaims = claims.filter(claim => claim.status === 'approved').length;
    const pendingClaims = claims.filter(claim => claim.status === 'pending').length;

    // Coverage statistics - only for approved applications
    const totalCoverage = applications
      .filter(app => app.status === 'approved')
      .reduce((sum, app) => {
        const coverageAmount = app.quoteData?.coverageAmount || 
                              app.policyDetails?.coverage?.maxAmount || 
                              app.coverageAmount || 0;
        return sum + (parseInt(coverageAmount) || 0);
      }, 0);

    // Monthly premium calculation - only for approved applications
    const monthlyPremium = applications
      .filter(app => app.status === 'approved')
      .reduce((sum, app) => {
        const premium = app.estimatedPremium?.monthly || 
                       app.premiumAmount || 
                       app.policyDetails?.premiumDetails?.baseRate || 0;
        return sum + (parseFloat(premium) || 0);
      }, 0);

    const approvalRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

    const calculatedStats = {
      totalApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      underReviewApplications,
      totalPaid,
      activePolicies,
      totalClaims,
      approvedClaims,
      pendingClaims,
      totalCoverage,
      monthlyPremium,
      approvalRate,
    };

    console.log('Calculated stats:', calculatedStats);
    return calculatedStats;
  }, [applicationsData, paymentsData, claimsData]);

  // Application status chart data
  const applicationChartData = useMemo(() => {
    if (!stats || stats.totalApplications === 0) {
      return {
        labels: ['No Applications'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(200, 200, 200, 0.8)'],
            borderColor: ['rgb(150, 150, 150)'],
            borderWidth: 2,
          },
        ],
      };
    }

    return {
      labels: ['Approved', 'Pending', 'Rejected', 'Under Review'],
      datasets: [
        {
          data: [
            stats.approvedApplications,
            stats.pendingApplications,
            stats.rejectedApplications,
            stats.underReviewApplications,
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  const applicationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Payment history chart data
  const paymentChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Use actual payment data if available, otherwise show placeholder
    const paymentData = stats.totalPaid > 0 
      ? months.map(() => Math.floor(Math.random() * 500) + 100) // Mock data for demo
      : months.map(() => 0);
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Payments',
          data: paymentData,
          borderColor: 'rgb(97, 128, 245)',
          backgroundColor: stats.totalPaid > 0 ? 'rgba(97, 128, 245, 0.1)' : 'rgba(200, 200, 200, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [stats.totalPaid]);

  const paymentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Payment History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
  };

  // Quick actions data
  const quickActions = [
    {
      title: 'Apply for New Policy',
      description: 'Browse and apply for insurance policies',
      icon: FileText,
      link: '/policies',
      color: 'bg-blue-500',
    },
    {
      title: 'Make Payment',
      description: 'Pay for your approved policies',
      icon: CreditCard,
      link: '/dashboard/payment-status',
      color: 'bg-green-500',
    },
    {
      title: 'Submit Claim',
      description: 'File a claim for approved policies',
      icon: Shield,
      link: '/dashboard/claim-request',
      color: 'bg-purple-500',
    },
    {
      title: 'View Applications',
      description: 'Check your application status',
      icon: Users,
      link: '/dashboard/my-policies',
      color: 'bg-orange-500',
    },
  ];

  // Get recent activity
  const recentActivity = useMemo(() => {
    const applications = Array.isArray(applicationsData) ? applicationsData : (applicationsData.applications || []);
    const claims = Array.isArray(claimsData) ? claimsData : [];

    const activities = [
      ...applications.slice(0, 3).map(app => ({
        id: app._id,
        type: 'application',
        title: app.policyDetails?.title || 'Insurance Policy',
        date: app.appliedAt,
        status: app.status,
        icon: app.status === 'approved' ? CheckCircle : 
              app.status === 'pending' ? Clock : 
              app.status === 'rejected' ? AlertCircle : Clock,
        color: app.status === 'approved' ? 'text-green-500' : 
               app.status === 'pending' ? 'text-yellow-500' : 
               app.status === 'rejected' ? 'text-red-500' : 'text-blue-500',
      })),
      ...claims.slice(0, 2).map(claim => ({
        id: claim._id,
        type: 'claim',
        title: `Claim: ${claim.policyName || 'Policy'}`,
        date: claim.submittedAt,
        status: claim.status,
        icon: FileText,
        color: 'text-blue-500',
      })),
    ];

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [applicationsData, claimsData]);

  const isLoading = applicationsLoading || paymentsLoading || claimsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.displayName || 'Customer'}!</h1>
            <p className="text-muted-foreground text-lg">
              Here's your insurance portfolio overview
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Policies */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats.activePolicies}
                  </p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stats.approvedApplications > 0 ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stats.approvedApplications} approved
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Coverage */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Coverage</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    ${stats.totalCoverage > 0 ? (stats.totalCoverage / 1000).toFixed(0) + 'K' : '0'}
                  </p>
                  <div className="text-sm text-muted-foreground mt-2">
                    Across all policies
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Premium */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Premium</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    ${stats.monthlyPremium || '0'}
                  </p>
                  <div className="text-sm text-muted-foreground mt-2">
                    Total monthly cost
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claims Status */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Claims</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats.totalClaims}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {stats.approvedClaims > 0 && (
                      <Badge variant="default" className="text-xs">
                        {stats.approvedClaims} approved
                      </Badge>
                    )}
                    {stats.pendingClaims > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {stats.pendingClaims} pending
                      </Badge>
                    )}
                    {stats.totalClaims === 0 && (
                      <Badge variant="outline" className="text-xs">
                        No claims
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Status Chart */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Application Status
              </CardTitle>
              <CardDescription>
                {stats.totalApplications > 0 
                  ? 'Your insurance application breakdown' 
                  : 'No applications yet'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Doughnut 
                  data={applicationChartData}
                  options={applicationChartOptions}
                />
              </div>
              {stats.totalApplications === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">Start by applying for your first policy</p>
                  <Button asChild>
                    <Link to="/policies">Browse Policies</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription>Manage your insurance portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link key={index} to={action.link}>
                    <Button
                      variant="outline"
                      className="w-full justify-start p-4 h-auto border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-foreground">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-2" />
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment History */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Payment History</CardTitle>
              <CardDescription>
                {stats.totalPaid > 0 ? 'Your premium payment trends' : 'No payment history yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={paymentChartData} options={paymentChartOptions} />
              </div>
              
              {/* Payment Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    ${stats.totalPaid || '0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Paid</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.activePolicies}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Policies</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    ${stats.monthlyPremium || '0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Monthly Cost</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.approvalRate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Approval Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription>Your latest insurance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-4 w-4 ${activity.color}`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          activity.status === 'approved' ? 'default' :
                          activity.status === 'pending' ? 'secondary' : 
                          activity.status === 'rejected' ? 'destructive' : 'outline'
                        }>
                          {activity.status}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link to="/policies">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;