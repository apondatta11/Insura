import { Shield, Heart, Users, FileText, UserCheck, DollarSign, Calendar, TrendingUp } from "lucide-react";

const Loading = ({ message = "Securing your future...", subMessage = "Loading your desired Page",icon = "shield" }) => {
  
  const iconMap = {
    shield: Shield,
    heart: Heart,
    users: Users,
    file: FileText,
    userCheck: UserCheck,
    dollar: DollarSign,
    calendar: Calendar,
    trending: TrendingUp
  };

  const IconComponent = iconMap[icon] || Shield;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-center px-4 py-12">
      {/* Animated Icon Section */}
      <div className="relative mb-8">
        <div className="relative w-24 h-24">
          {/* Main Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="h-12 w-12 text-primary animate-pulse" />
          </div>
          
          {/* Rotating Background Element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="h-20 w-20 text-muted-foreground/20 animate-spin-slow" />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-2 left-4">
            <Heart className="h-5 w-5 text-accent animate-bounce" />
          </div>
          <div className="absolute bottom-2 right-4">
            <Users className="h-5 w-5 text-accent animate-bounce delay-300" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-3 max-w-md">
        <h2 className="text-2xl font-serif font-semibold text-foreground animate-pulse">
          {message}
        </h2>
        
        <p className="text-muted-foreground font-sans text-sm">
          {subMessage}
        </p>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      <div className="w-48 h-1 bg-muted rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-progress"></div>
      </div>
    </div>
  );
};
export default Loading;

export const ApplicationLoading = () => (
  <Loading 
    message="Processing your application..."
    subMessage="Reviewing your details for optimal coverage"
    icon="file"
  />
);

export const PaymentLoading = () => (
  <Loading 
    message="Securing your payment..."
    subMessage="Processing your transaction with bank-level security"
    icon="dollar"
  />
);

export const ClaimLoading = () => (
  <Loading 
    message="Reviewing your claim..."
    subMessage="Ensuring you get the support you deserve"
    icon="heart"
  />
);

export const ProfileLoading = () => (
  <Loading 
    message="Loading your profile..."
    subMessage="Getting your insurance portfolio ready"
    icon="userCheck"
  />
);

export const DashboardLoading = () => (
  <Loading 
    message="Preparing your dashboard..."
    subMessage="Loading your complete insurance overview"
    icon="trending"
  />
);

export const QuoteLoading = () => (
  <Loading 
    message="Calculating your premium..."
    subMessage="Analyzing your needs for the perfect quote"
    icon="dollar"
  />
);

