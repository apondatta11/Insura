import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '@/Hooks/useAxios';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  ArrowRight,
  Shield,
  Heart,
  GraduationCap,
  PiggyBank,
  UserCheck,
  Stethoscope,
  Loader2,
  AlertCircle
} from 'lucide-react';

const PopularPolicies = () => {
  const axiosInstance = useAxios();

  const { data: policies = [], isLoading, error } = useQuery({
    queryKey: ['popular-policies'],
    queryFn: async () => {
      const response = await axiosInstance.get('/popular-policies');
      return response.data;
    },
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'Health Insurance': Stethoscope,
      'Accident Cover': Shield,
      'Child Plan': GraduationCap,
      'Retirement': UserCheck,
      'Savings Plan': PiggyBank,
      'Life Insurance': Heart,
    };
    return icons[category] || Shield;
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    return `₹${(amount / 1000).toFixed(0)} K`;
  };

  const getCoverageRange = (policy) => {
    const min = policy.coverage?.minAmount || 0;
    const max = policy.coverage?.maxAmount || 0;
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  const getDurationOptions = (policy) => {
    const options = policy.duration?.options || [];
    if (options.length === 0) return 'Flexible';
    const min = Math.min(...options);
    const max = Math.max(...options);
    return min === max ? `${min} years` : `${min}-${max} years`;
  };

  const formatPopularity = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return `${count}+`;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full mb-4 animate-pulse">
              <div className="h-4 w-4 bg-muted-foreground/20 rounded"></div>
              <div className="h-3 w-20 bg-muted-foreground/20 rounded"></div>
            </div>
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-card border-border animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-20"></div>
                        <div className="h-6 bg-muted rounded w-32"></div>
                      </div>
                      <div className="h-10 w-10 bg-muted rounded-lg"></div>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                    
                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-16"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-16"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-9 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-destructive mb-2">
                Unable to Load Policies
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                We're having trouble loading popular policies. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (policies.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-muted border border-border rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                No Popular Policies Yet
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                Popular policies will appear here as customers start purchasing.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge 
            variant="outline" 
            className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2 font-sans"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
          
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 tracking-tight">
            Trending Insurance Plans
          </h2>
          
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Discover our most trusted insurance policies chosen by thousands of customers
          </p>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {policies.map((policy) => {
            const CategoryIcon = getCategoryIcon(policy.category);
            
            return (
              <Card 
                key={policy._id}
                className="group bg-card border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 overflow-hidden"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-sidebar text-foreground border-border font-sans text-xs"
                      >
                        {policy.category}
                      </Badge>
                      <h3 className="text-xl font-serif font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {policy.title}
                      </h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground font-sans text-sm mb-6 leading-relaxed line-clamp-2">
                    {policy.description}
                  </p>

                  {/* Policy Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                        <DollarSign className="h-3 w-3" />
                        <span>Coverage</span>
                      </div>
                      <p className="text-sm font-sans font-semibold text-foreground">
                        {getCoverageRange(policy)}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                        <Calendar className="h-3 w-3" />
                        <span>Term</span>
                      </div>
                      <p className="text-sm font-sans font-semibold text-foreground">
                        {getDurationOptions(policy)}
                      </p>
                    </div>
                  </div>

                  {/* Popularity & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                        <Users className="h-3 w-3" />
                        <span>{formatPopularity(policy.popularity || 0)} customers</span>
                      </div>
                    </div>
                    
                    <Button 
                      asChild
                      size="sm"
                      variant="outline"
                      className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                    >
                      <Link to={`/policies/${policy._id}`} className="flex items-center gap-1">
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Policies CTA */}
        <div className="text-center">
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-8"
          >
            <Link to="/policies" className="flex items-center gap-2">
              Explore All Policies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularPolicies;