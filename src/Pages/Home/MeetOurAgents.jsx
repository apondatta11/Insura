import { useQuery } from '@tanstack/react-query';
import useAxios from '@/Hooks/useAxios';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
  Users, 
  Award, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router';

const MeetOurAgents = () => {
  const axiosInstance = useAxios();

  const { data: agents = [], isLoading, error } = useQuery({
    queryKey: ['featured-agents'],
    queryFn: async () => {
      const response = await axiosInstance.get('/agents');
      return response.data;
    },
  });

  const getExperienceYears = (agent) => {
    if (agent.experience) return `${agent.experience}+ years`;
    
    try {
      const created = new Date(agent.createdAt || agent.lastLoggedAt);
      const now = new Date();
      const years = Math.floor((now - created) / (365 * 24 * 60 * 60 * 1000));
      return years > 0 ? `${years}+ years` : 'Recently joined';
    } catch {
      return 'Experienced';
    }
  };

  const getSpecialties = (agent) => {
    if (agent.specialties && agent.specialties.length > 0) {
      return agent.specialties.slice(0, 3);
    }
    return ['Life Insurance', 'Health Plans', 'Retirement'];
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Not provided';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
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
          
          {/* Agents Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-card border-border animate-pulse">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Avatar */}
                    <div className="flex justify-center">
                      <div className="h-20 w-20 bg-muted rounded-full"></div>
                    </div>
                    
                    {/* Name & Title */}
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-32 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                    </div>
                    
                    {/* Experience */}
                    <div className="h-4 bg-muted rounded w-28 mx-auto"></div>
                    
                    {/* Specialties */}
                    <div className="flex justify-center gap-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-40 mx-auto"></div>
                    </div>
                    
                    {/* Button */}
                    <div className="h-9 bg-muted rounded w-full"></div>
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
                Unable to Load Agents
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                We're having trouble loading our agent information. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (agents.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-muted border border-border rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                No Agents Available
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                Our agent team information will be available soon.
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
            <UserCheck className="h-3 w-3 mr-1" />
            Expert Team
          </Badge>
          
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 tracking-tight">
            Meet Our Insurance Experts
          </h2>
          
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Get personalized guidance from our certified insurance agents with years of experience in protecting your future
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {agents.map((agent) => {
            const specialties = getSpecialties(agent);
            
            return (
              <Card 
                key={agent._id}
                className="group bg-card border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Agent Avatar */}
                    <div className="flex justify-center">
                      <div className="relative">
                        {agent.photoURL ? (
                          <img
                            src={agent.photoURL}
                            alt={agent.name}
                            className="h-20 w-20 rounded-full object-cover border-2 border-border group-hover:border-primary/50 transition-colors"
                          />
                        ) : (
                          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-border group-hover:border-primary/50 transition-colors">
                            <UserCheck className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        {/* Online Status Indicator */}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                      </div>
                    </div>

                    {/* Agent Name & Title */}
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-foreground text-xl group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground font-sans text-sm">
                        <Shield className="h-3 w-3" />
                        <span>Certified Insurance Agent</span>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center justify-center gap-1 text-foreground font-sans text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{getExperienceYears(agent)} experience</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {specialties.map((specialty, index) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="bg-sidebar text-foreground border-border font-sans text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 text-sm">
                      {agent.phone && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground font-sans">
                          <Phone className="h-3 w-3" />
                          <span>{formatPhone(agent.phone)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 text-muted-foreground font-sans">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                    </div>

                    {/* Rating (if available) */}
                    {agent.rating && (
                      <div className="flex items-center justify-center gap-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= (agent.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-sans">
                          ({agent.reviewCount || '50+'} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default MeetOurAgents;