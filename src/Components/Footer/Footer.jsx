import React from 'react';
import { Link } from 'react-router';
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowRight,
  Heart,
  Users,
  Clock,
  Award
} from 'lucide-react';

const Footer = () => {
    return (
        <div className='mt-24'>
            <footer className="bg-background border-t border-border">
                {/* Main Footer Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-foreground">Insura</h3>
                                    <p className="text-sm text-muted-foreground font-sans">Life Insurance</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                                Protecting families and securing futures with comprehensive insurance solutions. 
                                Trusted by thousands for reliable coverage and exceptional service.
                            </p>
                            
                            {/* Trust Badges */}
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                                    <Award className="h-3 w-3" />
                                    <span className="text-xs font-sans font-medium">Certified</span>
                                </div>
                                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                                    <Users className="h-3 w-3" />
                                    <span className="text-xs font-sans font-medium">50K+ Clients</span>
                                </div>
                            </div>
                        </div>

                        {/* Insurance Products */}
                        <div className="space-y-4">
                            <h6 className="font-serif font-semibold text-foreground text-lg">Insurance Plans</h6>
                            <nav className="space-y-2">
                                <Link to="/policies?category=life-insurance" className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Life Insurance
                                </Link>
                                <Link to="/policies?category=health-insurance" className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Health Insurance
                                </Link>
                                <Link to="/policies?category=retirement" className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Retirement Plans
                                </Link>
                                <Link to="/policies?category=child-plan" className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Child Education
                                </Link>
                                <Link to="/policies" className="flex items-center gap-2 text-primary font-sans text-sm font-medium hover:text-primary/80 transition-colors group">
                                    <ArrowRight className="h-3 w-3" />
                                    View All Policies
                                </Link>
                            </nav>
                        </div>

                        {/* Customer Support */}
                        <div className="space-y-4">
                            <h6 className="font-serif font-semibold text-foreground text-lg">Support</h6>
                            <nav className="space-y-2">
                                <Link to="/dashboard/claim-request" className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    File a Claim
                                </Link>
                                <Link  className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Contact Support
                                </Link>
                                <Link className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    FAQ & Help
                                </Link>
                                <Link to="/blog" className="flex items-center gap-2 text-muted-foreground font-sans text-sm hover:text-primary transition-colors group">
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Insurance Tips
                                </Link>
                            </nav>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h6 className="font-serif font-semibold text-foreground text-lg">Contact Us</h6>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-sans text-foreground font-medium">+1 (555) 123-4567</p>
                                        <p className="text-xs text-muted-foreground font-sans">Mon-Fri, 9AM-6PM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-sans text-foreground font-medium">support@insura.com</p>
                                        <p className="text-xs text-muted-foreground font-sans">24/7 Email Support</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-sans text-foreground font-medium">123 Insurance Ave</p>
                                        <p className="text-xs text-muted-foreground font-sans">New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3 pt-2">
                                <a 
                                    href="#" 
                                    className="w-9 h-9 bg-sidebar border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 bg-sidebar border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 bg-sidebar border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border bg-sidebar/50">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-muted-foreground font-sans">
                                    © 2024 <span className="text-foreground font-medium">Insura Life Insurance</span>. All rights reserved.
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-6 text-sm">
                                <Link  className="text-muted-foreground font-sans hover:text-foreground transition-colors text-xs">
                                    Privacy Policy
                                </Link>
                                <Link  className="text-muted-foreground font-sans hover:text-foreground transition-colors text-xs">
                                    Terms of Service
                                </Link>
                                <Link  className="text-muted-foreground font-sans hover:text-foreground transition-colors text-xs">
                                    Cookie Policy
                                </Link>
                                <Link  className="text-muted-foreground font-sans hover:text-foreground transition-colors text-xs">
                                    Disclaimer
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Message */}
                <div className="bg-primary/5 border-t border-border/50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                                <Shield className="h-3 w-3 text-primary" />
                                <span>Licensed Insurance Provider</span>
                            </div>
                            <div className="hidden sm:block text-muted-foreground">•</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                                <Clock className="h-3 w-3 text-primary" />
                                <span>24/7 Claims Support</span>
                            </div>
                            <div className="hidden sm:block text-muted-foreground">•</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                                <Heart className="h-3 w-3 text-primary" />
                                <span>Family-Focused Protection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;