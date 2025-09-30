import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/Hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import useUserRole from '@/Hooks/useUserRole';
import UseAuth from '@/Hooks/UseAuth';
import { Link } from 'react-router';

const DashboardHome = () => {
  const { user } = UseAuth();
  const { role, roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();

  // Fetch dashboard stats based on user role - with error handling
  const { data: stats = {}, isLoading: statsLoading, error } = useQuery({
    queryKey: ['dashboard-stats', role, user?.email],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(`/dashboard/stats?role=${role}&email=${user?.email}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Return empty stats if API fails
        return getDefaultStats(role);
      }
    },
    enabled: !!user?.email && !roleLoading,
  });

  // Default stats if API fails
  const getDefaultStats = (userRole) => {
    const defaultStats = {
      profileComplete: true,
      recentActivity: []
    };

    if (userRole === 'admin') {
      return {
        ...defaultStats,
        totalUsers: 0,
        pendingApplications: 0,
        totalPolicies: 0,
        monthlyRevenue: 0
      };
    } else if (userRole === 'agent') {
      return {
        ...defaultStats,
        assignedCustomers: 0,
        pendingClaims: 0,
        approvedPolicies: 0,
        commission: 0
      };
    } else if (userRole === 'customer') {
      return {
        ...defaultStats,
        activePolicies: 0,
        pendingPayments: 0,
        claimsSubmitted: 0,
        nextPaymentDue: 'No due'
      };
    }

    return defaultStats;
  };

  if (roleLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-muted-foreground font-serif">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Role-based welcome messages
  const getWelcomeMessage = () => {
    const messages = {
      admin: `Welcome back, Administrator! Manage your insurance platform efficiently.`,
      agent: `Hello ${user?.displayName || 'Agent'}! Ready to assist customers today?`,
      customer: `Welcome ${user?.displayName || 'Valued Customer'}! Manage your insurance policies with ease.`
    };
    return messages[role] || 'Welcome to your dashboard!';
  };

  // Role-based quick actions
  const getQuickActions = () => {
    const baseActions = [
      { 
        title: 'Update Profile', 
        description: 'Manage your personal information',
        href: '/dashboard/profile',
        icon: '👤',
        color: 'bg-blue-500'
      }
    ];

    const roleActions = {
      admin: [
        {
          title: 'Manage Applications',
          description: 'Review and process policy applications',
          href: '/dashboard/manage-applications',
          icon: '📋',
          color: 'bg-green-500'
        },
        {
          title: 'Manage Users',
          description: 'Oversee user accounts and roles',
          href: '/dashboard/manage-users',
          icon: '👥',
          color: 'bg-purple-500'
        },
        {
          title: 'Manage Policies',
          description: 'Create and update insurance policies',
          href: '/dashboard/manage-policies',
          icon: '📄',
          color: 'bg-orange-500'
        },
        {
          title: 'View Transactions',
          description: 'Monitor payments and revenue',
          href: '/dashboard/manage-transactions',
          icon: '💳',
          color: 'bg-emerald-500'
        }
      ],
      agent: [
        {
          title: 'Assigned Customers',
          description: 'View and manage your customer portfolio',
          href: '/dashboard/assigned-customers',
          icon: '👨‍👩‍👧‍👦',
          color: 'bg-indigo-500'
        },
        {
          title: 'Policy Clearance',
          description: 'Process insurance claims',
          href: '/dashboard/policy-clearance',
          icon: '✅',
          color: 'bg-teal-500'
        },
        {
          title: 'Write Blog',
          description: 'Share insurance insights',
          href: '/dashboard/manage-blogs',
          icon: '📝',
          color: 'bg-pink-500'
        }
      ],
      customer: [
        {
          title: 'My Policies',
          description: 'View your insurance policies',
          href: '/dashboard/my-policies',
          icon: '📑',
          color: 'bg-blue-500'
        },
        {
          title: 'Payment Status',
          description: 'Check and manage payments',
          href: '/dashboard/payment-status',
          icon: '💰',
          color: 'bg-green-500'
        },
        {
          title: 'Submit Claim',
          description: 'Request policy claims',
          href: '/dashboard/claim-request',
          icon: '🏥',
          color: 'bg-red-500'
        },
        {
          title: 'Get New Policy',
          description: 'Explore available policies',
          href: '/policies',
          icon: '🛡️',
          color: 'bg-purple-500'
        }
      ]
    };

    return [...baseActions, ...(roleActions[role] || [])];
  };

  // Role-based statistics cards
  const getStatCards = () => {
    const baseStats = [
      {
        title: 'Profile Completeness',
        value: stats?.profileComplete ? '100%' : '70%',
        description: 'Your profile status',
        icon: '📊',
        color: 'border-l-blue-500'
      }
    ];

    const roleStats = {
      admin: [
        {
          title: 'Total Users',
          value: stats?.totalUsers || 0,
          description: 'Registered users',
          icon: '👥',
          color: 'border-l-green-500'
        },
        {
          title: 'Pending Applications',
          value: stats?.pendingApplications || 0,
          description: 'Awaiting review',
          icon: '⏳',
          color: 'border-l-orange-500'
        },
        {
          title: 'Total Policies',
          value: stats?.totalPolicies || 0,
          description: 'Active policies',
          icon: '📄',
          color: 'border-l-purple-500'
        },
        {
          title: 'Monthly Revenue',
          value: stats?.monthlyRevenue ? `$${stats.monthlyRevenue}` : '$0',
          description: 'This month',
          icon: '💰',
          color: 'border-l-emerald-500'
        }
      ],
      agent: [
        {
          title: 'Assigned Customers',
          value: stats?.assignedCustomers || 0,
          description: 'Your customers',
          icon: '👨‍👩‍👧‍👦',
          color: 'border-l-indigo-500'
        },
        {
          title: 'Pending Claims',
          value: stats?.pendingClaims || 0,
          description: 'Awaiting approval',
          icon: '📋',
          color: 'border-l-red-500'
        },
        {
          title: 'Approved Policies',
          value: stats?.approvedPolicies || 0,
          description: 'This month',
          icon: '✅',
          color: 'border-l-teal-500'
        },
        {
          title: 'Commission',
          value: stats?.commission ? `$${stats.commission}` : '$0',
          description: 'Total earnings',
          icon: '💸',
          color: 'border-l-green-500'
        }
      ],
      customer: [
        {
          title: 'Active Policies',
          value: stats?.activePolicies || 0,
          description: 'Your policies',
          icon: '🛡️',
          color: 'border-l-blue-500'
        },
        {
          title: 'Pending Payments',
          value: stats?.pendingPayments || 0,
          description: 'Due payments',
          icon: '⏰',
          color: 'border-l-orange-500'
        },
        {
          title: 'Claims Submitted',
          value: stats?.claimsSubmitted || 0,
          description: 'Total claims',
          icon: '📨',
          color: 'border-l-purple-500'
        },
        {
          title: 'Next Payment',
          value: stats?.nextPaymentDue || 'No due',
          description: 'Payment schedule',
          icon: '📅',
          color: 'border-l-green-500'
        }
      ]
    };

    return [...baseStats, ...(roleStats[role] || [])];
  };

  const quickActions = getQuickActions();
  const statCards = getStatCards();

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Dashboard - Insurance Platform</title>
      </Helmet>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground font-sans mt-3 text-lg">
              {getWelcomeMessage()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${
              role === 'admin' ? 'bg-destructive text-destructive-foreground' :
              role === 'agent' ? 'bg-warning text-warning-foreground' :
              'bg-success text-success-foreground'
            }`}>
              {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              Last login: {user?.metadata?.lastSignInTime ? 
                new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                'Recently'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className={`card bg-card border border-border rounded-xl shadow-sm p-6 ${stat.color} border-l-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-sans text-muted-foreground font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-serif font-bold text-foreground mt-2">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div className="text-2xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="card bg-card border border-border rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Quick Actions
          </h2>
          <p className="text-muted-foreground font-sans mt-1">
            Quickly access frequently used features
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="block p-4 bg-sidebar border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center text-white text-lg`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans font-semibold text-foreground group-hover:text-accent-foreground">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/80 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Show error message if stats failed to load */}
      {error && (
        <div className="alert alert-warning mb-8">
          <div className="flex items-center gap-3">
            <span>⚠️</span>
            <span>Dashboard statistics are temporarily unavailable. Showing default data.</span>
          </div>
        </div>
      )}

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Recent Activity
            </h2>
            <p className="text-muted-foreground font-sans mt-1">
              Your latest actions and updates
            </p>
          </div>
          <div className="p-6">
            {stats?.recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-sidebar rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm">📌</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-muted-foreground font-sans">
                  No recent activity to display
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your activities will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="card bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              System Status
            </h2>
            <p className="text-muted-foreground font-sans mt-1">
              Platform overview and notifications
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="font-sans text-sm">System Operational</span>
                </div>
                <span className="text-xs text-muted-foreground">All systems normal</span>
              </div>
              
              {role === 'admin' && (
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="font-sans text-sm">Pending Reviews</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stats?.pendingApplications || 0} applications
                  </span>
                </div>
              )}

              {role === 'agent' && (
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="font-sans text-sm">Pending Claims</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stats?.pendingClaims || 0} claims
                  </span>
                </div>
              )}

              {role === 'customer' && stats?.pendingPayments > 0 && (
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="font-sans text-sm">Due Payments</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stats.pendingPayments} payments
                  </span>
                </div>
              )}

              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;