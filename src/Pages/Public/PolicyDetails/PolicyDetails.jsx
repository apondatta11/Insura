import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Shield, 
    Users, 
    Calendar, 
    DollarSign, 
    CheckCircle, 
    ArrowLeft,
    Star,
    Clock,
    Heart,
    Baby,
    Sparkles,
    Calculator,
    FileText,
    Award,
    TrendingUp
} from 'lucide-react';
import useAxios from '@/Hooks/useAxios';

const PolicyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [activeTab, setActiveTab] = useState('overview');

    const { data: policy, isLoading, error } = useQuery({
        queryKey: ['policy', id],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(`/policies/${id}`);
                return res.data;
            } catch (err) {
                console.error('Error fetching policy:', err);
                throw err;
            }
        },
        enabled: !!id
    });

    const calculateSamplePremium = (coverageAmount, duration, baseRate) => {
        const annualPremium = (coverageAmount * baseRate) / 100;
        const totalPremium = annualPremium * duration;
        return {
            annual: Math.round(annualPremium),
            total: Math.round(totalPremium),
            monthly: Math.round(annualPremium / 12)
        };
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Term Life': <Shield className="w-5 h-5" />,
            'Whole Life': <Heart className="w-5 h-5" />,
            'Senior Plan': <Users className="w-5 h-5" />,
            'Family Plan': <Users className="w-5 h-5" />,
            'Child Plan': <Baby className="w-5 h-5" />
        };
        return icons[category] || <Sparkles className="w-5 h-5" />;
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

    const formatCurrency = (amount) => {
        if (!amount) return 'Not specified';
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount?.toLocaleString()}`;
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md mx-4 border-border">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Policy Not Found</h3>
                        <p className="text-muted-foreground mb-4">The requested policy could not be found.</p>
                        <Button onClick={() => navigate('/policies')} className="bg-primary hover:bg-primary/90">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Policies
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!policy) {
        return null;
    }

    const samplePremium = calculateSamplePremium(
        policy.coverage?.minAmount,
        policy.duration?.options?.[0] || 10,
        policy.premiumDetails?.baseRate || 0.5
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10 py-8">
            <div className="container mx-auto px-4">
                {/* Header Navigation */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/policies')}
                        className="border-border hover:bg-accent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Policies
                    </Button>
                    <Badge className={getCategoryColor(policy.category)}>
                        <span className="flex items-center gap-1.5">
                            {getCategoryIcon(policy.category)}
                            {policy.category}
                        </span>
                    </Badge>
                </div>

                <div className="space-y-6">
                    {/* Policy Header */}
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="flex-shrink-0">
                                    <img
                                        src={policy.image || '/default-policy.jpg'}
                                        alt={policy.title}
                                        className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                                        onError={(e) => {
                                            e.target.src = '/default-policy.jpg';
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                                        {policy.title}
                                    </h1>
                                    <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                                        {policy.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-200">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Active Policy
                                        </Badge>
                                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 border-blue-200">
                                            <Star className="w-3 h-3 mr-1" />
                                            Popular Choice
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Facts & Quote Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Quick Facts */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm md:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Facts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">Processing Time</p>
                                        <p className="text-sm text-muted-foreground">2-3 business days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">Coverage Type</p>
                                        <p className="text-sm text-muted-foreground">{policy.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">Policy Term</p>
                                        <p className="text-sm text-muted-foreground">
                                            {policy.duration?.options?.join(', ')} years
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">Coverage Range</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrency(policy.coverage?.minAmount)} - {formatCurrency(policy.coverage?.maxAmount)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Get Quote Card */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl md:col-span-2">
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Get Instant Quote
                                </CardTitle>
                                <CardDescription>
                                    Get your personalized premium calculation
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center space-y-2">
                                    <p className="text-2xl font-bold text-primary">
                                        From ${samplePremium.monthly}/month
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        or ${samplePremium.annual} annually
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                        <DollarSign className="w-6 h-6 text-primary mx-auto mb-1" />
                                        <h4 className="font-semibold text-foreground text-sm">Monthly</h4>
                                        <p className="text-lg font-bold text-primary">${samplePremium.monthly}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                        <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                                        <h4 className="font-semibold text-foreground text-sm">Annual</h4>
                                        <p className="text-lg font-bold text-emerald-500">${samplePremium.annual}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                                        <h4 className="font-semibold text-foreground text-sm">Total</h4>
                                        <p className="text-lg font-bold text-purple-500">${samplePremium.total}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Coverage</span>
                                        <span className="font-semibold">{formatCurrency(policy.coverage?.minAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Term</span>
                                        <span className="font-semibold">{policy.duration?.options?.[0] || 10} years</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base Rate</span>
                                        <span className="font-semibold">{policy.premiumDetails?.baseRate}%</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link to={`/quotes/${policy._id}`} className="w-full">
                                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6">
                                        <Calculator className="w-5 h-5 mr-2" />
                                        Get Personalized Quote
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Policy Details Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4 bg-background/80 border-border">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <FileText className="w-4 h-4 mr-2" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="benefits" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Award className="w-4 h-4 mr-2" />
                                Benefits
                            </TabsTrigger>
                            <TabsTrigger value="premium" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Calculator className="w-4 h-4 mr-2" />
                                Premium
                            </TabsTrigger>
                            <TabsTrigger value="eligibility" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Eligibility
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        Policy Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-foreground">Coverage Range</h4>
                                            <p className="text-muted-foreground">
                                                {formatCurrency(policy.coverage?.minAmount)} - {formatCurrency(policy.coverage?.maxAmount)}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-foreground">Age Eligibility</h4>
                                            <p className="text-muted-foreground">
                                                {policy.minAge} - {policy.maxAge} years
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-foreground">Policy Term</h4>
                                            <p className="text-muted-foreground">
                                                {policy.duration?.options?.join(', ')} years
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-foreground">Base Premium Rate</h4>
                                            <p className="text-muted-foreground">
                                                {policy.premiumDetails?.baseRate}% annually
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        Key Features
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground">Comprehensive life coverage with flexible terms</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground">Tax-free death benefits for beneficiaries</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground">No medical exam required for standard cases</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground">Convertible to permanent coverage options</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Benefits Tab */}
                        <TabsContent value="benefits" className="space-y-6">
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-primary" />
                                        Policy Benefits
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-foreground text-lg">Primary Benefits</h4>
                                            <ul className="space-y-3">
                                                {(policy.benefits || ['Death Benefit', 'Tax Free', 'Critical Illness Cover']).map((benefit, index) => (
                                                    <li key={index} className="flex items-center gap-3">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                        <span className="text-foreground">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-foreground text-lg">Additional Features</h4>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-foreground">Accelerated Death Benefit</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-foreground">Waiver of Premium</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-foreground">Policy Loan Options</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-foreground">24/7 Customer Support</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Premium Tab */}
                        <TabsContent value="premium" className="space-y-6">
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-primary" />
                                        Premium Calculation
                                    </CardTitle>
                                    <CardDescription>
                                        Sample premium calculation based on standard rates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                                            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                                            <h4 className="font-semibold text-foreground">Monthly Premium</h4>
                                            <p className="text-2xl font-bold text-primary">${samplePremium.monthly}</p>
                                        </div>
                                        <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                            <Calendar className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                            <h4 className="font-semibold text-foreground">Annual Premium</h4>
                                            <p className="text-2xl font-bold text-emerald-500">${samplePremium.annual}</p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                            <h4 className="font-semibold text-foreground">Total Premium</h4>
                                            <p className="text-2xl font-bold text-purple-500">${samplePremium.total}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-foreground">Calculation Details</h4>
                                        <div className="text-sm text-muted-foreground space-y-2">
                                            <p>• Base Rate: {policy.premiumDetails?.baseRate}% of coverage amount</p>
                                            <p>• Coverage Amount: {formatCurrency(policy.coverage?.minAmount)}</p>
                                            <p>• Policy Term: {policy.duration?.options?.[0] || 10} years</p>
                                            <p>• Premium includes all standard benefits and features</p>
                                        </div>
                                    </div>

                                    <Alert className="bg-blue-500/10 border-blue-500/20">
                                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                                            <strong>Note:</strong> This is a sample calculation. Your actual premium may vary based on age, health, and other factors. Get a personalized quote for accurate pricing.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Eligibility Tab */}
                        <TabsContent value="eligibility" className="space-y-6">
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                        Eligibility Criteria
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-foreground text-lg">Basic Requirements</h4>
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-foreground">Age between {policy.minAge} and {policy.maxAge} years</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-foreground">Legal resident of coverage area</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-foreground">Valid identification documents</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-foreground text-lg">Documentation</h4>
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-foreground">Proof of identity (Passport/Driving License)</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-foreground">Proof of address</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-foreground">Income verification (if applicable)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-foreground">Underwriting Process</h4>
                                        <p className="text-muted-foreground">
                                            Most applications are processed within 2-3 business days. Some cases may require additional medical information.
                                            We strive to make the process as smooth and efficient as possible.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;