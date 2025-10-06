import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useAxios from '@/Hooks/useAxios';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  Users,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const Newsletter = () => {
  const axiosInstance = useAxios();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const subscribeMutation = useMutation({
    mutationFn: async (subscriptionData) => {
      const response = await axiosInstance.post('/newsletter', subscriptionData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Successfully subscribed to newsletter!', {
        description: 'You will receive updates on insurance tips and offers.'
      });
      setFormData({ name: '', email: '' });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error('Subscription Failed', {
        description: errorMessage
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    subscribeMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim()
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                  <div>
                    <Badge 
                      variant="outline" 
                      className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2 font-sans"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Stay Updated
                    </Badge>
                    
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-4 tracking-tight">
                      Insurance Insights Delivered
                    </h2>
                    
                    <p className="text-muted-foreground font-sans leading-relaxed">
                      Get expert insurance tips, policy updates, and financial insights directly to your inbox. 
                      Join thousands of informed customers making better insurance decisions.
                    </p>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-sans text-foreground">Weekly insurance tips</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-sans text-foreground">Policy updates & offers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-sans text-foreground">No spam, unsubscribe anytime</span>
                    </div>
                  </div>
                </div>

                {/* Right Form */}
                <div className="bg-sidebar border border-border rounded-lg p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-sans font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 border-input bg-background font-sans"
                          required
                          disabled={subscribeMutation.isPending}
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-sans font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 border-input bg-background font-sans"
                          required
                          disabled={subscribeMutation.isPending}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full font-sans bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                      disabled={subscribeMutation.isPending}
                    >
                      {subscribeMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Subscribe to Newsletter
                        </>
                      )}
                    </Button>

                    {/* Privacy Note */}
                    <p className="text-xs text-muted-foreground font-sans text-center">
                      We respect your privacy. Your information is secure with us.
                    </p>
                  </form>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-serif font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground font-sans">Subscribers</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-serif font-bold text-primary">Weekly</div>
                    <div className="text-sm text-muted-foreground font-sans">Updates</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-serif font-bold text-primary">Zero</div>
                    <div className="text-sm text-muted-foreground font-sans">Spam</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;