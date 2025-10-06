import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Search, 
    Users, 
    Shield, 
    UserCheck, 
    UserX, 
    Trash2,
    AlertCircle,
    Loader2,
    Crown,
    UserCog
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '@/Hooks/useAxiosSecure';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const { data: response = {}, isLoading, error } = useQuery({
        queryKey: ['users', searchTerm, roleFilter],
        queryFn: async () => {
            const res = await axiosSecure.get('/users', {
                params: { search: searchTerm, role: roleFilter }
            });
            console.log('Users API Response:', res.data);
            return res.data; 
        }
    });

    const users = response.users || [];
    const totalUsers = response.totalUsers || 0;

    const updateUserRole = useMutation({
        mutationFn: async ({ userId, newRole }) => {
            const res = await axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                title: 'Success!',
                text: 'User role updated successfully',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update user role',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    const deleteUser = useMutation({
        mutationFn: async (userId) => {
            const res = await axiosSecure.delete(`/users/${userId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                title: 'Deleted!',
                text: 'User has been deleted successfully',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete user',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    const handleRoleChange = (userId, currentRole, newRole, userName) => {
        if (currentRole === newRole) return;

        const actionText = newRole === 'admin' ? 'make an admin' : 
                          newRole === 'agent' ? 'promote to agent' : 
                          'demote to customer';

        Swal.fire({
            title: `Change User Role?`,
            text: `Are you sure you want to ${actionText} ${userName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${actionText}!`
        }).then((result) => {
            if (result.isConfirmed) {
                updateUserRole.mutate({ userId, newRole });
            }
        });
    };

    const handleDeleteUser = (userId, userName) => {
        Swal.fire({
            title: 'Delete User?',
            text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser.mutate(userId);
            }
        });
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            admin: { variant: 'destructive', label: 'Admin', icon: Crown },
            agent: { variant: 'default', label: 'Agent', icon: UserCog },
            customer: { variant: 'secondary', label: 'Customer', icon: Users }
        };
        
        const config = roleConfig[role] || { variant: 'outline', label: role, icon: Users };
        const IconComponent = config.icon;
        
        return (
            <Badge variant={config.variant} className="flex items-center gap-1 w-fit rounded-full px-3 py-1">
                <IconComponent className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load users. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Users</h1>
                    <p className="text-muted-foreground">
                        Manage user roles and permissions across the platform
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {totalUsers} Users
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-foreground font-semibold">Search Users</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="search"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-input bg-background/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role-filter" className="text-foreground font-semibold">Filter by Role</Label>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="border-input bg-background/50">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setRoleFilter('all');
                                }}
                                className="w-full border-input hover:bg-accent/20"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-foreground">User Management</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        View and manage all registered users. Promote/demote users between customer, agent, and admin roles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-foreground">Loading users...</span>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">No users found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || roleFilter !== 'all' 
                                    ? 'Try adjusting your search filters' 
                                    : 'No users registered yet'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border border-border/50">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-foreground font-semibold">User</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Email</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Role</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Registration Date</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user._id || user.email} className="hover:bg-accent/10">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={user.photoURL || '/default-avatar.png'}
                                                            alt={user.name}
                                                            className="h-8 w-8 rounded-full border border-border"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{user.name || 'No Name'}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-foreground">{user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    {getRoleBadge(user.role)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">
                                                {formatDate(user.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-1 flex-wrap">
                                                    {/* Make Admin - for customers and agents */}
                                                    {(user.role === 'customer' || user.role === 'agent') && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRoleChange(user._id, user.role, 'admin', user.name)}
                                                            disabled={updateUserRole.isLoading}
                                                            className="gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 text-xs px-2 py-1 h-7 min-w-[85px]"
                                                        >
                                                            <Crown className="h-3 w-3" />
                                                            Admin
                                                        </Button>
                                                    )}
                                                    
                                                    {/* Promote Customer to Agent */}
                                                    {user.role === 'customer' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRoleChange(user._id, user.role, 'agent', user.name)}
                                                            disabled={updateUserRole.isLoading}
                                                            className="gap-1 text-xs px-2 py-1 h-7 min-w-[85px]"
                                                        >
                                                            <UserCheck className="h-3 w-3" />
                                                            Agent
                                                        </Button>
                                                    )}
                                                    
                                                    {/* Demote Admin to Agent */}
                                                    {user.role === 'admin' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRoleChange(user._id, user.role, 'agent', user.name)}
                                                            disabled={updateUserRole.isLoading}
                                                            className="gap-1 bg-blue-50 hover:bg-blue-100 text-red-400 border-blue-200 text-xs px-2 py-1 h-7 min-w-[85px]"
                                                        >
                                                            <UserCog className="h-3 w-3" />
                                                            To Agent
                                                        </Button>
                                                    )}
                                                    
                                                    {/* Demote to Customer - for agents and admins */}
                                                    {(user.role === 'agent' || user.role === 'admin') && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRoleChange(user._id, user.role, 'customer', user.name)}
                                                            disabled={updateUserRole.isLoading}
                                                            className="gap-1 bg-gray-50 hover:bg-gray-100 text-blue-400 border-gray-200 text-xs px-2 py-1 h-7 min-w-[85px]"
                                                        >
                                                            <UserX className="h-3 w-3 " />
                                                            To Customer
                                                        </Button>
                                                    )}

                                                    {/* Delete User (Optional) */}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        disabled={deleteUser.isLoading}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs px-2 py-1 h-7 min-w-[70px]"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {users.filter(u => u.role === 'customer').length}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Agents</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {users.filter(u => u.role === 'agent').length}
                                </p>
                            </div>
                            <UserCog className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                            <Crown className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManageUsers;