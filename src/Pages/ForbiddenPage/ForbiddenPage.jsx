import { Link, useNavigate } from 'react-router';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  Home, 
  Shield, 
  Lock, 
  UserCheck,
  AlertTriangle,
  LogIn,
  UserCog,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import  useAuth  from '@/Hooks/useAuth';
import useAxiosSecure from '@/Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userRoleData, isLoading: roleLoading } = useQuery({
    queryKey: ['user-role', user?.email],
    queryFn: async () => {
      if (!user?.email) return { role: 'customer' };
      try {
        const response = await axiosSecure.get(`/users/${user.email}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user role:', error);
        return { role: 'customer' };
      }
    },
    enabled: !!user?.email, 
  });

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const roleBasedSuggestions = [
    {
      role: 'customer',
      title: 'Customer Access',
      description: 'As a customer, you can browse policies, submit applications, and manage your insurance portfolio.',
      actions: [
        { href: '/policies', label: 'Browse Policies' },
        { href: '/dashboard/my-policies', label: 'My Policies' },
      ]
    },
    {
      role: 'agent',
      title: 'Agent Portal',
      description: 'Agents can manage assigned customers, review applications, and handle policy clearances.',
      actions: [
        { href: '/dashboard/assigned-customers', label: 'Assigned Customers' },
        { href: '/dashboard/manage-blogs', label: 'Manage Blogs' }
      ]
    },
    {
      role: 'admin',
      title: 'Admin Dashboard',
      description: 'Administrators have full access to manage users, policies, applications, and platform settings.',
      actions: [
        { href: '/dashboard/manage-users', label: 'Manage Users' },
        { href: '/dashboard/manage-applications', label: 'Applications' },
        { href: '/admin/manage-policies', label: 'Manage Policies' }
      ]
    }
  ];

  const getCurrentUserRoleInfo = () => {
    if (!user) return null;

    const userRole = userRoleData?.role || 'customer';
    return roleBasedSuggestions.find(suggestion => suggestion.role === userRole) || roleBasedSuggestions[0];
  };

  const userRoleInfo = getCurrentUserRoleInfo();
  const currentRole = userRoleData?.role || 'customer';

  if (user && roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-sans">Checking your access permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Decorative Elements */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-destructive/5 rounded-full blur-3xl"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative">
              <Badge 
                variant="outline" 
                className="mb-6 bg-destructive/10 text-destructive border-destructive/20 px-4 py-2 font-sans text-sm"
              >
                <Lock className="h-3 w-3 mr-1" />
                Access Restricted
              </Badge>
              
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20">
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
              </div>
              
              <h1 className="text-6xl font-serif font-bold text-foreground mb-4 tracking-tighter">
                403
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-semibold text-foreground">
                  Access Denied
                </h2>
                
                <p className="text-lg text-muted-foreground font-sans max-w-xl mx-auto leading-relaxed">
                  {user 
                    ? `You don't have permission to access this page with your current role (${currentRole}).`
                    : 'You need to be logged in to access this page.'
                  }
                </p>

                {user && (
                  <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 border border-border">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-sans text-foreground">
                      Logged in as: <span className="font-semibold">{user.email}</span>
                    </span>
                    <Badge variant="secondary" className="font-sans text-xs">
                      {currentRole}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Guidance */}
        {userRoleInfo && (
          <Card className="bg-card border-border rounded-xl shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-serif font-semibold text-foreground text-lg">
                  {userRoleInfo.title}
                </h3>
                <p className="text-muted-foreground font-sans text-sm">
                  {userRoleInfo.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {userRoleInfo.actions.map((action, index) => (
                    <Button
                      key={index}
                      asChild
                      size="sm"
                      variant="outline"
                      className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link to={action.href}>
                        {action.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-card border-border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-lg mb-2">
                    Need Higher Access?
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm mb-4">
                    Contact an administrator to request additional permissions for your role
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground w-full"
                >
                  {/* <Link to="/contact" className="flex items-center gap-2 justify-center"> */}

                    Contact Admin
                  {/* </Link> */}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-lg mb-2">
                    Switch Account
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm mb-4">
                    Log out and sign in with an account that has the required permissions
                  </p>
                </div>
                {user ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="font-sans border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground w-full"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Logout & Switch
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground w-full"
                  >
                    <Link to="/auth/login" className="flex items-center gap-2 justify-center">
                      <LogIn className="h-4 w-4" />
                      Login Now
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="font-sans bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground px-8"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center">
          <Card className="bg-muted/30 border-border rounded-xl max-w-2xl mx-auto">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-sans">
                <Shield className="h-3 w-3 inline mr-1" />
                This access restriction helps maintain the security and integrity of our insurance platform.
                If you believe this is an error, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage