import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, Shield } from 'lucide-react';
import useAxios from '@/Hooks/useAxios';

const AllPolicies = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const axiosInstance = useAxios();

    const PREDEFINED_CATEGORIES = ['Term Life', 'Whole Life', 'Senior Plan', 'Family Plan', 'Child Plan'];

    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: allPoliciesData = {} } = useQuery({
        queryKey: ['all-policies-categories'],
        queryFn: async () => {
            const res = await axiosInstance.get('/policies');
            return res.data;
        }
    });

    const getAllCategories = () => {
        if (!allPoliciesData.policies) return PREDEFINED_CATEGORIES;
        
        const categories = [...new Set(allPoliciesData.policies.map(policy => policy.category))];
        return [...new Set([...PREDEFINED_CATEGORIES, ...categories])];
    };

    const getOtherCategories = () => {
        if (!allPoliciesData.policies) return [];
        const allCategories = [...new Set(allPoliciesData.policies.map(policy => policy.category))];
        return allCategories.filter(cat => !PREDEFINED_CATEGORIES.includes(cat));
    };

    const allCategories = getAllCategories();
    const otherCategories = getOtherCategories();

    const { data: response = {}, isLoading, error } = useQuery({
        queryKey: ['policies', selectedCategory, debouncedSearch, currentPage],
        queryFn: async () => {
            const params = {
                page: currentPage
            };
            
            if (debouncedSearch) {
                params.search = debouncedSearch;
            }
            if (selectedCategory !== 'all') {
                if (selectedCategory === 'other') {
                    params.category = ''; 
                } else {
                    params.category = selectedCategory;
                }
            }

            const res = await axiosInstance.get('/policies', { params });
            return res.data;
        },
        keepPreviousData: true
    });

    let { policies = [], totalPages = 1, totalPolicies = 0 } = response;

    if (selectedCategory === 'other' && policies.length > 0) {
        policies = policies.filter(policy => 
            !PREDEFINED_CATEGORIES.includes(policy.category)
        );
        totalPolicies = policies.length; 
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, selectedCategory]);

    const getCategoryColor = (category) => {
        const colors = {
            'Term Life': 'bg-blue-500/20 text-blue-600 border-blue-200',
            'Whole Life': 'bg-emerald-500/20 text-emerald-600 border-emerald-200',
            'Senior Plan': 'bg-purple-500/20 text-purple-600 border-purple-200',
            'Family Plan': 'bg-pink-500/20 text-pink-600 border-pink-200',
            'Child Plan': 'bg-amber-500/20 text-amber-600 border-amber-200'
        };
        return colors[category] || 'bg-background text-gray-400 border-gray-200';
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Failed to Load Policies</h3>
                        <p className="text-muted-foreground mb-4">Please try again later.</p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Insurance Policies
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover comprehensive protection plans tailored for every stage of life.
                    </p>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search policies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    
                                    {/* Predefined Categories */}
                                    <SelectItem value="Term Life">Term Life</SelectItem>
                                    <SelectItem value="Whole Life">Whole Life</SelectItem>
                                    <SelectItem value="Senior Plan">Senior Plan</SelectItem>
                                    <SelectItem value="Family Plan">Family Plan</SelectItem>
                                    <SelectItem value="Child Plan">Child Plan</SelectItem>
                                    
                                    {/* Other Categories */}
                                    {otherCategories.length > 0 && (
                                        <SelectItem value="other">Other Categories</SelectItem>
                                    )}
                                    
                                    {/* Individual Other Categories */}
                                    {otherCategories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground mb-6">
                    {totalPolicies} policies found
                    {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                    {selectedCategory === 'other' && ` • Showing other categories`}
                </div>

                {/* Policies Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-0">
                                    <div className="h-48 w-full bg-muted" />
                                    <div className="p-6">
                                        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                                        <div className="space-y-2">
                                            <div className="h-4 bg-muted rounded w-full" />
                                            <div className="h-4 bg-muted rounded w-4/5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : policies.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
                                <Search className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">No Policies Found</h3>
                            <p className="text-muted-foreground text-lg">
                                {searchTerm || selectedCategory !== 'all' 
                                    ? "No policies match your search criteria."
                                    : "No policies available."
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {policies.map((policy) => (
                                <Link key={policy._id} to={`/policies/${policy._id}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={policy.image || '/default-policy.jpg'}
                                                alt={policy.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/default-policy.jpg';
                                                }}
                                            />
                                            <Badge className={`absolute top-4 left-4 ${getCategoryColor(policy.category)}`}>
                                                {policy.category}
                                            </Badge>
                                        </div>

                                        <CardHeader>
                                            <CardTitle className="line-clamp-2">{policy.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {policy.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardFooter>
                                            <Button className="w-full">
                                                View Details
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(page)}
                                                    isActive={currentPage === page}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    <PaginationItem>
                                        <PaginationNext 
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllPolicies;

