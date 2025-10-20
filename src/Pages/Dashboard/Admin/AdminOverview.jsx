import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  TrendingDown,
  Shield,
  UserCheck,
  Calendar,
  ArrowUpRight,
  BarChart3,
  PieChart,
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

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();
  const [timeRange, setTimeRange] = useState('month');

  // Fetch all necessary data for overview
  const { data: overviewData, isLoading } = useQuery({
    queryKey: ['admin-overview', timeRange],
    queryFn: async () => {
      const [usersRes, applicationsRes, transactionsRes, policiesRes] = await Promise.all([
        axiosSecure.get('/users?limit=1000'),
        axiosSecure.get('/applications?limit=1000'),
        axiosSecure.get('/payments?limit=1000'),
        axiosSecure.get('/policies?admin=true')
      ]);

      return {
        users: usersRes.data.users || [],
        applications: applicationsRes.data.applications || [],
        transactions: transactionsRes.data || [],
        policies: policiesRes.data || [],
      };
    },
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!overviewData) return null;

    const { users, applications, transactions, policies } = overviewData;

    // User statistics
    const totalUsers = users.length;
    const customers = users.filter(u => u.role === 'customer').length;
    const agents = users.filter(u => u.role === 'agent').length;
    const admins = users.filter(u => u.role === 'admin').length;

    // Application statistics
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;
    const approvedApplications = applications.filter(app => app.status === 'approved').length;
    const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
    const underReviewApplications = applications.filter(app => app.status === 'under_review').length;

    // Transaction statistics
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransactionValue = completedTransactions.length > 0 
      ? totalRevenue / completedTransactions.length 
      : 0;

    // Policy statistics
    const totalPolicies = policies.length;
    const popularCategories = policies.reduce((acc, policy) => {
      acc[policy.category] = (acc[policy.category] || 0) + 1;
      return acc;
    }, {});

    // Monthly growth (simplified)
    const currentMonthRevenue = totalRevenue; // In a real app, filter by current month
    const previousMonthRevenue = totalRevenue * 0.85; // Mock data

    const revenueGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

    return {
      totalUsers,
      customers,
      agents,
      admins,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      underReviewApplications,
      totalRevenue,
      averageTransactionValue,
      totalPolicies,
      popularCategories,
      revenueGrowth,
      completedTransactions: completedTransactions.length,
    };
  }, [overviewData]);

  // Chart data for revenue
  const revenueChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Mock data - in real app, you'd aggregate by month
    const revenueData = months.map(() => Math.floor(Math.random() * 10000) + 5000);
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Revenue',
          data: revenueData,
          borderColor: 'rgb(97, 128, 245)',
          backgroundColor: 'rgba(97, 128, 245, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, []);

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Overview',
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

  // Application status chart data
  const applicationChartData = useMemo(() => {
    if (!stats) return null;

    return {
      labels: ['Pending', 'Approved', 'Rejected', 'Under Review'],
      datasets: [
        {
          data: [
            stats.pendingApplications,
            stats.approvedApplications,
            stats.rejectedApplications,
            stats.underReviewApplications,
          ],
          backgroundColor: [
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderColor: [
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  // User distribution chart data
  const userDistributionData = useMemo(() => {
    if (!stats) return null;

    return {
      labels: ['Customers', 'Agents', 'Admins'],
      datasets: [
        {
          data: [stats.customers, stats.agents, stats.admins],
          backgroundColor: [
            'rgba(97, 128, 245, 0.8)',
            'rgba(139, 69, 255, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
          borderColor: [
            'rgb(97, 128, 245)',
            'rgb(139, 69, 255)',
            'rgb(255, 99, 132)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Failed to load dashboard data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Admin Overview</h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive view of your insurance platform performance
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
          {/* Total Revenue */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.revenueGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats.revenueGrowth).toFixed(1)}% from last period
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats.totalUsers}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{stats.customers} customers</span>
                    <span>{stats.agents} agents</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats.totalApplications}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {stats.pendingApplications} pending
                    </Badge>
                    <Badge variant="default" className="text-xs">
                      {stats.approvedApplications} approved
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats.totalPolicies}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {Object.keys(stats.popularCategories).length} categories
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Overview
              </CardTitle>
              <CardDescription>Monthly revenue from policy sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={revenueChartData} options={revenueChartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Application Status
              </CardTitle>
              <CardDescription>Distribution of application statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {applicationChartData && (
                  <Doughnut 
                    data={applicationChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats and User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">User Distribution</CardTitle>
              <CardDescription>Platform user roles breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {userDistributionData && (
                  <Doughnut 
                    data={userDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.completedTransactions}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Successful Payments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${stats.averageTransactionValue.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Avg. Transaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.approvedApplications}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Approved Apps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((stats.approvedApplications / stats.totalApplications) * 100) || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Approval Rate</div>
                </div>
              </div>

              {/* Recent Activity Summary */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-4">Recent Activity Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">New users this month</span>
                    <span className="font-medium text-foreground">+{Math.floor(stats.totalUsers * 0.1)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Applications this week</span>
                    <span className="font-medium text-foreground">+{Math.floor(stats.totalApplications * 0.05)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Revenue this month</span>
                    <span className="font-medium text-foreground">+${Math.floor(stats.totalRevenue * 0.15).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Policy Categories */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Popular Policy Categories</CardTitle>
            <CardDescription>Most active policy categories by application volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.popularCategories)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="font-medium text-foreground capitalize">
                        {category.toLowerCase().replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} policies</span>
                      <Badge variant="outline">{Math.round((count / stats.totalPolicies) * 100)}%</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;