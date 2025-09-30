import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import {
    FaHome,
    FaUsers,
    FaFileContract,
    FaCreditCard,
    FaUserShield,
    FaUserTie,
    FaUser,
    FaBlog,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaCog
} from 'react-icons/fa';
import useUserRole from '@/Hooks/useUserRole';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UseAuth from '@/Hooks/UseAuth';
import { useNavigate } from 'react-router';

const DashboardLayout = () => {
    const { role, roleLoading } = useUserRole();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logOut } = UseAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-close sidebar on mobile when route changes
    useEffect(() => {
        if (window.innerWidth < 1024) { // lg breakpoint
            setSidebarOpen(false);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Check if we're on mobile
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Mobile Header */}
            {isMobile && (
                <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border/40">
                    <div className="flex h-16 items-center px-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mr-2"
                        >
                            {sidebarOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
                        </Button>
                        <div className="flex-1 font-medium">Insurance Dashboard</div>
                        <div className="ml-auto flex items-center space-x-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photoURL} />
                                <AvatarFallback>
                                    {user?.displayName?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>
            )}

            {/* Mobile Backdrop */}
            {isMobile && sidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            {/* Always show on desktop, conditionally show on mobile based on sidebarOpen state */}
            <AnimatePresence>
                {(!isMobile || sidebarOpen) && (
                    <motion.aside
                        initial={isMobile ? { x: -300 } : false}
                        animate={isMobile ? { x: 0 } : false}
                        exit={isMobile ? { x: -300 } : false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={cn(
                            'fixed lg:relative z-30 flex h-full w-72 flex-col border-r border-border/40 bg-background',
                            isMobile && !sidebarOpen && 'hidden'
                        )}
                    >
                        {/* Logo & user part */}
                        <div className="flex h-16 items-center px-6 border-b border-border/40">
                            <NavLink to="/" className="flex items-center gap-2 font-semibold">
                                <span className="text-lg">Insura</span>
                                <Badge variant="outline" className="ml-auto">
                                    {role}
                                </Badge>
                            </NavLink>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <nav className="space-y-1 px-4">
                                <DashboardNavItem to="/dashboard" icon={<FaHome />}>
                                    Profile
                                </DashboardNavItem>
                                
                                {/* Admin Routes */}
                                {!roleLoading && role === 'admin' && (
                                    <>
                                        <Separator className="my-2" />
                                        <p className="px-4 text-xs font-medium text-muted-foreground">Admin</p>
                                        <DashboardNavItem to="/dashboard/manage-applications" icon={<FaFileContract />}>
                                            Manage Applications
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/manage-users" icon={<FaUsers />}>
                                            Manage Users
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/manage-policies" icon={<FaFileContract />}>
                                            Manage Policies
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/manage-transactions" icon={<FaCreditCard />}>
                                            Manage Transactions
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/manage-blogs" icon={<FaBlog />}>
                                            Manage Blogs
                                        </DashboardNavItem>
                                    </>
                                )}

                                {/* Agent Routes */}
                                {!roleLoading && role === 'agent' && (
                                    <>
                                        <Separator className="my-2" />
                                        <p className="px-4 text-xs font-medium text-muted-foreground">Agent</p>
                                        <DashboardNavItem to="/dashboard/assigned-customers" icon={<FaUsers />}>
                                            Assigned Customers
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/manage-blogs" icon={<FaBlog />}>
                                            Manage Blogs
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/policy-clearance" icon={<FaUserTie />}>
                                            Policy Clearance
                                        </DashboardNavItem>
                                    </>
                                )}

                                {/* Customer Routes */}
                                {!roleLoading && role === 'customer' && (
                                    <>
                                        <Separator className="my-2" />
                                        <p className="px-4 text-xs font-medium text-muted-foreground">Customer</p>
                                        <DashboardNavItem to="/dashboard/my-policies" icon={<FaFileContract />}>
                                            My Policies
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/payment-status" icon={<FaCreditCard />}>
                                            Payment Status
                                        </DashboardNavItem>
                                        <DashboardNavItem to="/dashboard/claim-request" icon={<FaUser />}>
                                            Claim Request
                                        </DashboardNavItem>
                                    </>
                                )}
                            </nav>
                        </div>

                        {/* User Profile & Logout */}
                        <div className="p-4 border-t border-border/40 space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={user?.photoURL} />
                                    <AvatarFallback>
                                        {user?.displayName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-medium">{user?.displayName || 'User'}</p>
                                    <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0">
                <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// Simple DashboardNavItem without any mobile closing logic
const DashboardNavItem = ({ to, icon, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                )
            }
        >
            <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
            <span>{children}</span>
        </NavLink>
    );
};

export default DashboardLayout;