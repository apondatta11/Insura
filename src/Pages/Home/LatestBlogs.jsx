// src/Components/LatestBlogs/LatestBlogs.jsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '@/Hooks/useAxios';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Eye, 
  User, 
  ArrowRight,
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';

const LatestBlogs = () => {
  const axiosInstance = useAxios();

  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['latest-blogs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/blogs');
      const allBlogs = response.data || [];
      const publishedBlogs = allBlogs
        .filter(blog => blog.status === 'published')
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 4);
      return publishedBlogs;
    },
  });

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recent';
    }
  };

  const truncateContent = (content, wordLimit = 20) => {
    if (!content) return '';
    const words = content.split(' ');
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatCategory = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
          
          {/* Blog Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="bg-card border-border animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Category & Image */}
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="aspect-video bg-muted rounded-lg"></div>
                    </div>
                    
                    {/* Title & Meta */}
                    <div className="space-y-3">
                      <div className="h-5 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                    
                    {/* Author & Date */}
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-muted rounded-full"></div>
                        <div className="space-y-1">
                          <div className="h-3 bg-muted rounded w-16"></div>
                          <div className="h-2 bg-muted rounded w-12"></div>
                        </div>
                      </div>
                      <div className="h-8 bg-muted rounded w-20"></div>
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
                Unable to Load Articles
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                We're having trouble loading the latest articles. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-muted border border-border rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                No Articles Published Yet
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                Check back soon for insightful insurance articles and tips.
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
            <BookOpen className="h-3 w-3 mr-1" />
            Latest Insights
          </Badge>
          
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 tracking-tight">
            Insurance Articles & Tips
          </h2>
          
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Stay informed with our latest insurance insights, tips, and expert advice
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {blogs.map((blog) => (
            <Card 
              key={blog._id}
              className="group bg-card border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 overflow-hidden flex flex-col h-full"
            >
              <CardContent className="p-6 flex flex-col flex-grow">
                {/* Category Badge */}
                <div className="mb-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-sidebar text-foreground border-border font-sans text-xs"
                  >
                    {formatCategory(blog.category)}
                  </Badge>
                </div>

                {/* Blog Image/Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-primary/40" />
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-foreground text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                  {blog.title}
                </h3>

                {/* Content Summary */}
                <div className="flex-grow mb-4">
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed line-clamp-3">
                    {truncateContent(blog.content, 25)}
                  </p>
                </div>

                {/* Author & Meta Information */}
                <div className="space-y-3 pt-3 border-t border-border">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-medium text-foreground truncate">
                        {blog.author?.split('@')[0] || 'Admin'}
                      </p>
                    </div>
                  </div>

                  {/* Date & Views */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-sans">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(blog.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{blog.totalVisits || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Read More Button */}
                <Button 
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full mt-4 font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                >
                  <Link 
                    to={`/blog/${blog._id}`}
                    className="flex items-center justify-center gap-1"
                  >
                    Read More
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Blogs Button */}
        <div className="text-center">
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-8"
          >
            <Link to="/blog" className="flex items-center gap-2">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;