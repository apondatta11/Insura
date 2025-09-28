import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Shield, Users, Heart, Baby, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import useAxios from '@/Hooks/useAxios';

const AllPolicies = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [policiesPerPage] = useState(9);
    const axiosInstance = useAxios();

    // Predefined categories for filtering
    const PREDEFINED_CATEGORIES = ['Term Life', 'Whole Life', 'Senior Plan', 'Family Plan', 'Child Plan'];

    // Fetch all policies
    const { data: allPolicies = [], isLoading, error } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            try {
                console.log('Fetching all policies...');
                const res = await axiosInstance.get('/policies');
                console.log('All policies received:', res.data);
                
                // Log all unique categories found
                const categories = [...new Set(res.data.map(policy => policy.category))];
                console.log('Unique categories in data:', categories);
                console.log('Policies with other categories:', 
                    res.data.filter(policy => !PREDEFINED_CATEGORIES.includes(policy.category))
                );
                
                return res.data;
            } catch (err) {
                console.error('API Error:', err);
                throw err;
            }
        },
        keepPreviousData: true
    });

    // Filter policies based on search and category
    const filteredPolicies = useMemo(() => {
        let filtered = allPolicies;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(policy =>
                policy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            if (selectedCategory === 'other') {
                // Show policies that don't belong to predefined categories
                filtered = filtered.filter(policy => 
                    !PREDEFINED_CATEGORIES.includes(policy.category)
                );
            } else {
                // Show policies from specific category
                filtered = filtered.filter(policy => 
                    policy.category === selectedCategory
                );
            }
        }

        console.log('Filtered policies:', {
            total: allPolicies.length,
            filtered: filtered.length,
            selectedCategory,
            searchTerm,
            otherCategories: [...new Set(filtered.map(p => p.category))]
        });

        return filtered;
    }, [allPolicies, searchTerm, selectedCategory]);

    // Client-side pagination
    const totalPolicies = filteredPolicies.length;
    const totalPages = Math.ceil(totalPolicies / policiesPerPage);
    const startIndex = (currentPage - 1) * policiesPerPage;
    const endIndex = startIndex + policiesPerPage;
    const currentPolicies = filteredPolicies.slice(startIndex, endIndex);


    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    // Handle search with debounce
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(debouncedSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    const getCategoryIcon = (category) => {
        const icons = {
            'Term Life': <Shield className="w-4 h-4" />,
            'Whole Life': <Heart className="w-4 h-4" />,
            'Senior Plan': <Users className="w-4 h-4" />,
            'Family Plan': <Users className="w-4 h-4" />,
            'Child Plan': <Baby className="w-4 h-4" />
        };
        return icons[category] || <Sparkles className="w-4 h-4" />;
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Term Life': 'bg-blue-500/20 text-blue-600 border-blue-200',
            'Whole Life': 'bg-emerald-500/20 text-emerald-600 border-emerald-200',
            'Senior Plan': 'bg-purple-500/20 text-purple-600 border-purple-200',
            'Family Plan': 'bg-pink-500/20 text-pink-600 border-pink-200',
            'Child Plan': 'bg-amber-500/20 text-amber-600 border-amber-200'
        };
        return colors[category] || 'bg-primary/20 text-primary border-primary/30';
    };

    const formatCoverage = (minAmount, maxAmount) => {
        if (!minAmount || !maxAmount) return 'Custom Coverage';
        
        if (minAmount >= 1000000) {
            return `$${(minAmount / 1000000).toFixed(1)}M - $${(maxAmount / 1000000).toFixed(1)}M`;
        }
        if (minAmount >= 1000) {
            return `$${(minAmount / 1000).toFixed(0)}K - $${(maxAmount / 1000).toFixed(0)}K`;
        }
        return `$${minAmount?.toLocaleString()} - $${maxAmount?.toLocaleString()}`;
    };



    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md mx-4 border-border">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Policies</h3>
                        <p className="text-muted-foreground mb-4">Unable to fetch insurance policies. Please try again later.</p>
                        <p className="text-sm text-muted-foreground mb-4">Error: {error.message}</p>
                        <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10 py-8">
            <div className="container mx-auto px-4">


                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Insurance Policies
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Discover comprehensive protection plans tailored for every stage of life. 
                        Secure your future with our trusted insurance solutions.
                    </p>
                </div>

                {/* Filters Section */}
                <Card className="mb-8 shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                {/* Search Input */}
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search policies..."
                                        value={debouncedSearch}
                                        onChange={(e) => setDebouncedSearch(e.target.value)}
                                        className="pl-10 pr-4 w-full sm:w-64 bg-background/80 border-border focus:border-primary transition-all duration-300"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="flex-1 sm:flex-none">
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-full sm:w-48 bg-background/80 border-border focus:border-primary transition-all duration-300">
                                            <Filter className="w-4 h-4 mr-2" />
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="Term Life">Term Life</SelectItem>
                                            <SelectItem value="Whole Life">Whole Life</SelectItem>
                                            <SelectItem value="Senior Plan">Senior Plan</SelectItem>
                                            <SelectItem value="Family Plan">Family Plan</SelectItem>
                                            <SelectItem value="Child Plan">Child Plan</SelectItem>
                                            <SelectItem value="other">Other Categories</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Results Count */}
                            <div className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-lg border border-border font-medium">
                                <span className="text-foreground font-semibold">{totalPolicies}</span> policies found
                                {totalPages > 1 && (
                                    <span className="text-primary"> • Page {currentPage} of {totalPages}</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Policies Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-pulse">
                                <CardContent className="p-0">
                                    <div className="h-48 w-full bg-muted" />
                                    <div className="p-6">
                                        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                                        <div className="space-y-2">
                                            <div className="h-4 bg-muted rounded w-full" />
                                            <div className="h-4 bg-muted rounded w-4/5" />
                                        </div>
                                        <div className="h-10 bg-muted rounded w-full mt-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : currentPolicies.length === 0 ? (
                    <Card className="text-center py-16 shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent>
                            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
                                <Search className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground mb-3">No Policies Found</h3>
                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                {searchTerm || selectedCategory !== 'all' 
                                    ? "We couldn't find any policies matching your criteria. Try adjusting your search or filters."
                                    : "No insurance policies are currently available. Please check back later for new offerings."
                                }
                            </p>
                            {(searchTerm || selectedCategory !== 'all') && (
                                <Button 
                                    onClick={() => {
                                        setDebouncedSearch('');
                                        setSelectedCategory('all');
                                    }}
                                    variant="outline"
                                    className="border-border hover:bg-accent"
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentPolicies.map((policy) => (
                                <Card 
                                    key={policy._id} 
                                    className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer hover:border-primary/30"
                                >
                                    <Link to={`/policy/${policy._id}`}>
                                        {/* Policy Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={policy.image || '/default-policy.jpg'}
                                                alt={policy.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = '/default-policy.jpg';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            <Badge 
                                                className={`absolute top-4 left-4 ${getCategoryColor(policy.category)} border backdrop-blur-sm font-semibold shadow-lg`}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    {getCategoryIcon(policy.category)}
                                                    {policy.category}
                                                </span>
                                            </Badge>
                                        </div>

                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                                {policy.title}
                                            </CardTitle>
                                            <CardDescription className="text-muted-foreground line-clamp-2 leading-relaxed">
                                                {policy.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="pb-4">
                                            <div className="space-y-3">
                                                {/* Coverage */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Coverage:</span>
                                                    <span className="text-sm font-bold text-primary">
                                                        {formatCoverage(policy.coverage?.minAmount, policy.coverage?.maxAmount)}
                                                    </span>
                                                </div>

                                                {/* Age Range */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Age Range:</span>
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {policy.minAge} - {policy.maxAge} years
                                                    </span>
                                                </div>

                                                {/* Premium Rate */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Premium Rate:</span>
                                                    <span className="text-sm font-bold text-emerald-600">
                                                        {policy.premiumDetails?.baseRate}%
                                                    </span>
                                                </div>

                                                {/* Duration Options */}
                                                {policy.duration?.options && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {policy.duration.options.join(', ')} years
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter>
                                            <Link to={`/policies/${policy._id}`}>
                                            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0">
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                            </Link>
                                        </CardFooter>
                                    </Link>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Card className="shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <Pagination>
                                        <PaginationContent className="flex-wrap justify-center">
                                            <PaginationItem>
                                                <PaginationPrevious 
                                                    href="#" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                                    }}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-accent'}
                                                />
                                            </PaginationItem>

                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1;
                                                if (
                                                    page === 1 || 
                                                    page === totalPages || 
                                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <PaginationItem key={page}>
                                                            <PaginationLink
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setCurrentPage(page);
                                                                }}
                                                                isActive={currentPage === page}
                                                                className={currentPage === page 
                                                                    ? 'bg-primary text-primary-foreground border-primary' 
                                                                    : 'hover:bg-accent border-border'
                                                                }
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                    return (
                                                        <PaginationItem key={page}>
                                                            <span className="px-3 py-2 text-muted-foreground">...</span>
                                                        </PaginationItem>
                                                    );
                                                }
                                                return null;
                                            })}

                                            <PaginationItem>
                                                <PaginationNext 
                                                    href="#" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                                    }}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-accent'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllPolicies;