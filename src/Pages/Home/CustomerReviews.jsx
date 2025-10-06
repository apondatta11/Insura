// src/Components/CustomerReviews/CustomerReviews.jsx
import { useQuery } from '@tanstack/react-query';
import useAxios from '@/Hooks/useAxios';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
  Star, 
  Quote, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  User,
  Calendar,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

const CustomerReviews = () => {
  const axiosInstance = useAxios();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: reviewsWithUsers = [], isLoading, error } = useQuery({
    queryKey: ['customer-reviews'],
    queryFn: async () => {
      const response = await axiosInstance.get('/reviews');
      return response.data;
    },
  });

  useEffect(() => {
    if (reviewsWithUsers.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === reviewsWithUsers.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [reviewsWithUsers.length]);

  const nextReview = () => {
    setCurrentIndex(currentIndex === reviewsWithUsers.length - 1 ? 0 : currentIndex + 1);
  };

  const prevReview = () => {
    setCurrentIndex(currentIndex === 0 ? reviewsWithUsers.length - 1 : currentIndex - 1);
  };

  const goToReview = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full mb-4 animate-pulse">
              <div className="h-4 w-4 bg-muted-foreground/20 rounded"></div>
              <div className="h-3 w-24 bg-muted-foreground/20 rounded"></div>
            </div>
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          {/* Carousel Skeleton */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card border-border animate-pulse">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="h-6 bg-muted rounded w-32 mx-auto"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  </div>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-5 w-5 bg-muted rounded"></div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                Unable to Load Reviews
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                We're having trouble loading customer reviews. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviewsWithUsers.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-muted border border-border rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                No Reviews Yet
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                Customer reviews will appear here as they share their experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentReview = reviewsWithUsers[currentIndex];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge 
            variant="outline" 
            className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2 font-sans"
          >
            <Users className="h-3 w-3 mr-1" />
            Customer Stories
          </Badge>
          
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 tracking-tight">
            What Our Customers Say
          </h2>
          
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Real experiences from customers who trusted us with their insurance needs
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Navigation Arrows */}
            {reviewsWithUsers.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevReview}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextReview}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Review Card */}
            <Card className="bg-card border-border rounded-xl shadow-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Quote Icon */}
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Quote className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Policy Name */}
                  <Badge 
                    variant="secondary" 
                    className="bg-sidebar text-foreground border-border font-sans"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {currentReview.policyName}
                  </Badge>

                  {/* Review Text */}
                  <blockquote className="text-lg text-foreground font-sans leading-relaxed italic max-w-2xl mx-auto">
                    "{currentReview.feedback}"
                  </blockquote>

                  {/* Star Rating */}
                  <div className="flex justify-center gap-1">
                    {renderStars(currentReview.rating)}
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-shrink-0">
                      {currentReview.user?.photoURL ? (
                        <img
                          src={currentReview.user.photoURL}
                          alt={currentReview.user.name}
                          className="h-12 w-12 rounded-full object-cover border-2 border-border"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center border border-border">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-serif font-semibold text-foreground">
                        {currentReview.user?.name || currentReview.userEmail?.split('@')[0] || 'Customer'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(currentReview.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dots Indicator */}
            {reviewsWithUsers.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {reviewsWithUsers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToReview(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary'
                        : 'bg-border hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-6 bg-muted/50 rounded-full px-6 py-3 border border-border">
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-foreground">
                {reviewsWithUsers.length}
              </p>
              <p className="text-xs text-muted-foreground font-sans">Reviews</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-foreground">
                {Math.round(reviewsWithUsers.reduce((acc, review) => acc + review.rating, 0) / reviewsWithUsers.length * 10) / 10 || 0}
              </p>
              <p className="text-xs text-muted-foreground font-sans">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;