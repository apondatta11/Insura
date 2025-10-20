import { CheckCircle2, FileText, Phone, Clock, Shield } from 'lucide-react';
import { NavLink } from 'react-router';

const ClaimsGuideSection = () => {
  const steps = [
    {
      step: 1,
      title: "Report the Incident",
      description: "Contact us immediately to report your claim. You can call our 24/7 claims hotline or file online through our portal.",
      icon: Phone,
      details: ["Call 016758904321", "Online portal available 24/7", "Emergency services coordination"]
    },
    {
      step: 2,
      title: "Gather Documentation",
      description: "Collect all necessary documents and evidence related to your claim.",
      icon: FileText,
      details: ["Photos of damage", "Police reports (if applicable)", "Medical records", "Receipts and estimates"]
    },
    {
      step: 3,
      title: "Submit Your Claim",
      description: "Complete and submit your claim form with all supporting documentation.",
      icon: CheckCircle2,
      details: ["Online submission available", "Mobile app upload", "Email or fax options", "Agent assistance"]
    },
    {
      step: 4,
      title: "Claim Review",
      description: "Our team will review your claim and may contact you for additional information.",
      icon: Clock,
      details: ["Typically 3-5 business days", "Adjuster assignment", "Additional info requests", "Status updates provided"]
    },
    {
      step: 5,
      title: "Resolution & Payment",
      description: "Once approved, we'll process your payment and close your claim.",
      icon: Shield,
      details: ["Direct deposit available", "Check mailing option", "Repair coordination", "Follow-up support"]
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How to File a Claim
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these simple steps to file your insurance claim quickly and efficiently.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {steps.map((stepItem, index) => (
                <div key={stepItem.step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                    index === 0 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'bg-background border-border text-muted-foreground'
                  }`}>
                    {index === 0 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{stepItem.step}</span>
                    )}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground font-medium">
                    Step {stepItem.step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Details */}
          <div className="space-y-8">
            {steps.map((stepItem, index) => {
              const IconComponent = stepItem.icon;
              return (
                <div
                  key={stepItem.step}
                  className={`flex gap-6 p-6 rounded-lg border transition-all ${
                    index === 0
                      ? 'bg-primary/5 border-primary/20 shadow-sm'
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`text-xl font-semibold ${
                        index === 0 ? 'text-primary' : 'text-foreground'
                      }`}>
                        {stepItem.title}
                      </h3>
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full font-medium">
                          Current Step
                        </span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {stepItem.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {stepItem.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {index === 0 && (
                      <div className="mt-6 flex gap-4">
                        <NavLink to="/dashboard/claim-request" className="px-6 py-2 border border-border bg-background rounded-lg hover:bg-accent transition-colors font-medium">
                          Start Your Claim
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClaimsGuideSection;