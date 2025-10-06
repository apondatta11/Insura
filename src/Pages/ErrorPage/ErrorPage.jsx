import { Link } from 'react-router';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  Home, 
  ArrowLeft, 
  Search,
  FileText,
  Shield,
  Users,
  BookOpen,
  Compass
} from 'lucide-react';

const ErrorPage = () => {
  const quickLinks = [
    { href: '/', icon: Home, label: 'Home', description: 'Return to homepage' },
    { href: '/policies', icon: Shield, label: 'Policies', description: 'Browse insurance plans' },
    { href: '/blog', icon: BookOpen, label: 'Articles', description: 'Read latest insights' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Decorative Elements */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative">
              <Badge 
                variant="outline" 
                className="mb-6 bg-destructive/10 text-destructive border-destructive/20 px-4 py-2 font-sans text-sm"
              >
                <Compass className="h-3 w-3 mr-1" />
                Page Not Found
              </Badge>
              
              <h1 className="text-8xl font-serif font-bold text-foreground mb-4 tracking-tighter">
                404
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-semibold text-foreground">
                  Lost in the Insurance Maze?
                </h2>
                
                <p className="text-lg text-muted-foreground font-sans max-w-xl mx-auto leading-relaxed">
                  The page you're looking for seems to have wandered off. 
                  Don't worry - even the best-laid insurance plans sometimes need redirection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-card border-border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-lg mb-2">
                    Search Our Site
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Use the search bar to find specific policies, articles, or information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-lg mb-2">
                    Report Issue
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Found a broken link? Let us know so we can fix it for everyone
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Button
                key={index}
                asChild
                variant="outline"
                className="h-auto p-4 bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group"
              >
                <Link to={link.href} className="flex flex-col items-center text-center space-y-2">
                  <IconComponent className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  <span className="font-serif font-semibold text-sm">{link.label}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 font-sans">
                    {link.description}
                  </span>
                </Link>
              </Button>
            );
          })}
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
              Back to Homepage
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground px-8"
            onClick={() => window.history.back()}
          >
            <span className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </span>
          </Button>
        </div>


      </div>
    </div>
  );
};

export default ErrorPage;