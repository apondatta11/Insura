// src/Pages/Dashboard/Admin/ManageTransactions.jsx
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Download,
  Filter,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ManageTransactions = () => {
  const axiosSecure = useAxiosSecure();
  const [filters, setFilters] = useState({
    dateRange: "all",
    user: "",
    policy: "",
    search: "",
  });
  const [chartType, setChartType] = useState("line");

  const {
    data: transactionsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await axiosSecure.get("/payments");
      const payments = response.data;
      
      const transactionsWithPolicyNames = await Promise.all(
        payments.map(async (payment) => {
          try {
            if (payment.applicationId) {
                console.log('Fetching policy details for application ID:', payment.applicationId);
              const applicationResponse = await axiosSecure.get(`/applications/${payment.applicationId}`);
              const application = applicationResponse.data;
              console.log('Fetched application:', application);
              
              return {
                ...payment,
                policyName: application.policyDetails?.title || "Unknown Policy",
                policyCategory: application.policyDetails?.category || "General",
              };
            }
            return {
              ...payment,
              policyName: "Unknown Policy",
              policyCategory: "General",
            };
          } catch (error) {
            console.error(`Error fetching policy details for payment ${payment._id}:`, error);
            return {
              ...payment,
              policyName: "Unknown Policy",
              policyCategory: "General",
            };
          }
        })
      );
      
      return transactionsWithPolicyNames;
    },
  });

  const filteredTransactions = useMemo(() => {
    return transactionsData.filter(transaction => {
      if (filters.dateRange !== "all") {
        const transactionDate = new Date(transaction.paymentDate);
        const now = new Date();
        
        switch (filters.dateRange) {
          case "today":
            const todayStart = startOfDay(now);
            const todayEnd = endOfDay(now);
            if (transactionDate < todayStart || transactionDate > todayEnd) return false;
            break;
          case "week":
            const weekAgo = subDays(now, 7);
            if (transactionDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = subDays(now, 30);
            if (transactionDate < monthAgo) return false;
            break;
          default:
            break;
        }
      }

      if (filters.user && !transaction.userEmail.toLowerCase().includes(filters.user.toLowerCase())) {
        return false;
      }

      if (filters.policy && !transaction.policyName.toLowerCase().includes(filters.policy.toLowerCase())) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matches = 
          transaction.userEmail.toLowerCase().includes(searchTerm) ||
          transaction.transactionId?.toLowerCase().includes(searchTerm) ||
          transaction.policyName.toLowerCase().includes(searchTerm) ||
          transaction.policyCategory.toLowerCase().includes(searchTerm);
        if (!matches) return false;
      }

      return true;
    });
  }, [transactionsData, filters]);

  const stats = useMemo(() => {
    const totalIncome = filteredTransactions.reduce((sum, transaction) => {
      return transaction.status === "completed" ? sum + transaction.amount : sum;
    }, 0);

    const totalTransactions = filteredTransactions.length;
    const successfulTransactions = filteredTransactions.filter(
      (t) => t.status === "completed"
    ).length;
    const failedTransactions = filteredTransactions.filter(
      (t) => t.status === "failed"
    ).length;

    return {
      totalIncome,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0,
      averagePayment: successfulTransactions > 0 ? totalIncome / successfulTransactions : 0,
    };
  }, [filteredTransactions]);

  const uniquePolicyNames = useMemo(() => {
    const names = [...new Set(transactionsData.map(t => t.policyName))];
    return names.filter(name => name && name !== "Unknown Policy");
  }, [transactionsData]);

  const chartData = useMemo(() => {
    const dailyData = {};
    
    filteredTransactions
      .filter(t => t.status === "completed")
      .forEach(transaction => {
        const date = new Date(transaction.paymentDate);
        const dayKey = format(date, 'MMM dd');
        
        dailyData[dayKey] = (dailyData[dayKey] || 0) + transaction.amount;
      });

    const labels = Object.keys(dailyData).slice(-30); 
    const data = labels.map(label => dailyData[label] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Earnings',
          data,
          borderColor: 'rgb(97, 128, 245)',
          backgroundColor: chartType === 'line' 
            ? 'rgba(97, 128, 245, 0.1)' 
            : 'rgba(97, 128, 245, 0.8)',
          tension: 0.4,
          fill: chartType === 'line',
        },
      ],
    };
  }, [filteredTransactions, chartType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Earnings Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y}`;
          }
        }
      }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "default", label: "Success" },
      failed: { variant: "destructive", label: "Failed" },
      pending: { variant: "secondary", label: "Pending" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      label: status,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const clearFilters = () => {
    setFilters({
      dateRange: "all",
      user: "",
      policy: "",
      search: "",
    });
  };

  const hasActiveFilters = filters.dateRange !== "all" || filters.user || filters.policy || filters.search;

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <p>Failed to load transactions.</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
            <Button onClick={() => refetch()}>Try Again</Button>
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
            <h1 className="text-3xl font-bold text-foreground">
              Manage Transactions
            </h1>
            <p className="text-muted-foreground text-lg">
              View and manage all payment transactions
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-5 w-5" />
            <span>Stripe-powered payments</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Income</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(stats.totalIncome)}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalTransactions}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Successful</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.successfulTransactions}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.successRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <CardTitle className="text-foreground">Filters</CardTitle>
                <CardDescription>
                  Filter transactions by various criteria
                </CardDescription>
              </div>
              
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              {/* User Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">User Email</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Filter by email..."
                    value={filters.user}
                    onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Policy Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Policy Name</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Filter by policy name..."
                    value={filters.policy}
                    onChange={(e) => setFilters(prev => ({ ...prev, policy: e.target.value }))}
                    className="pl-10"
                    list="policy-suggestions"
                  />
                  <datalist id="policy-suggestions">
                    {uniquePolicyNames.map((policyName, index) => (
                      <option key={index} value={policyName} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Search Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search all fields..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Transaction History</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transactions found
              {hasActiveFilters && " (filtered)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-foreground">Loading transactions...</span>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">Transaction ID</TableHead>
                      <TableHead className="font-semibold text-foreground">Customer Email</TableHead>
                      <TableHead className="font-semibold text-foreground">Policy Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Policy Category</TableHead>
                      <TableHead className="font-semibold text-foreground">Amount</TableHead>
                      <TableHead className="font-semibold text-foreground">Date</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="font-mono text-sm text-foreground">
                            {transaction.transactionId?.slice(-8) || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {transaction.userEmail}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <div className="font-medium text-foreground">
                              {transaction.policyName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {transaction.policyCategory}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            {formatDate(transaction.paymentDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <CreditCard className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No transactions found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {hasActiveFilters 
                    ? "No transactions match your current filters. Try adjusting your search criteria."
                    : "There are no payment transactions recorded yet. Transactions will appear here once customers start making payments."
                  }
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earnings Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-foreground">Earnings Overview</CardTitle>
                <CardDescription>Total income from policy sales over time</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  Line Chart
                </Button>
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  Bar Chart
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {chartType === "line" ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(stats.totalIncome)}
                </p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {stats.successfulTransactions}
                </p>
                <p className="text-xs text-muted-foreground">Successful Payments</p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(stats.averagePayment)}
                </p>
                <p className="text-xs text-muted-foreground">Average Payment</p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {stats.successRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageTransactions;