import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    ArrowLeft, 
    User, 
    Shield, 
    FileText,
    Heart,
    Home,
    IdCard,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import useAxios from '@/Hooks/useAxios';
import Swal from 'sweetalert2';

const ApplicationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosInstance = useAxios();
    const { quoteData, estimatedPremium, policy } = location.state || {};

    const [applicationData, setApplicationData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        nidNumber: '',
        address: '',
        city: '',
        postalCode: '',
        occupation: '',
        annualIncome: '',
        
        // Nominee Information
        nomineeName: '',
        nomineeRelationship: '',
        nomineePhone: '',
        
        // Health Disclosure
        healthConditions: [],
        hasSmokingHistory: false,
        hasAlcoholHistory: false,
        hasFamilyHistory: false,
        hasChronicDisease: false,
        
        // Additional Information
        height: '',
        weight: ''
    });

    const healthConditionsList = [
        'Diabetes',
        'High Blood Pressure',
        'Heart Disease',
        'Cancer',
        'Asthma',
        'Kidney Disease',
        'Liver Disease',
        'Mental Health Condition',
        'Other Chronic Condition'
    ];

    // Submit application mutation
    const submitApplication = useMutation({
        mutationFn: async (formData) => {
            const application = {
                policyId: id,
                ...formData,
                status: 'pending',
                appliedAt: new Date().toISOString(),
                quoteData: quoteData,
                estimatedPremium: estimatedPremium
            };
            
            const res = await axiosInstance.post('/applications', application);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Application Submitted!',
                text: 'Your insurance application has been submitted successfully. We will review it and get back to you soon.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'View Applications'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dashboard/my-policies');
                }
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Submission Failed',
                text: 'There was an error submitting your application. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    const handleInputChange = (field, value) => {
        setApplicationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleHealthConditionChange = (condition, checked) => {
        setApplicationData(prev => ({
            ...prev,
            healthConditions: checked 
                ? [...prev.healthConditions, condition]
                : prev.healthConditions.filter(c => c !== condition)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!applicationData.fullName || !applicationData.email || !applicationData.nidNumber || !applicationData.annualIncome) {
            Swal.fire({
                title: 'Missing Information',
                text: 'Please fill in all required fields.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        Swal.fire({
            title: 'Submit Application?',
            text: 'Please review your information before submitting. You cannot make changes after submission.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Submit!',
            cancelButtonText: 'Review'
        }).then((result) => {
            if (result.isConfirmed) {
                submitApplication.mutate(applicationData);
            }
        });
    };

    if (!quoteData || !policy) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md mx-4 border-border">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Invalid Application</h3>
                        <p className="text-muted-foreground mb-4">Please start from the quote page to begin your application.</p>
                        <Button onClick={() => navigate(`/quotes/${id}`)} className="bg-primary hover:bg-primary/90">
                            Get Quote First
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10 py-8">
            <div className="container mx-auto px-4">
                {/* Header Navigation */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/quotes/${id}`, { state: { quoteData, estimatedPremium, policy } })}
                        className="border-border hover:bg-accent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Quote
                    </Button>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        <FileText className="w-3 h-3 mr-1" />
                        Application Form
                    </Badge>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Application Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription>
                                        Please provide your accurate personal details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap from gap-4 to gap-6 */}
                                        <div className="space-y-3">
                                            <Label htmlFor="fullName" className="text-sm font-semibold mb-2 block"> {/* Added mb-2 */}
                                                Full Name *
                                            </Label>
                                            <Input
                                                id="fullName"
                                                value={applicationData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-sm font-semibold mb-2 block">
                                                Email Address *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={applicationData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={applicationData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+880 1XXXXXXXXX"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="dateOfBirth" className="text-sm font-semibold mb-2 block">
                                                Date of Birth *
                                            </Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={applicationData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="nidNumber" className="text-sm font-semibold mb-2 block">
                                                NID/Passport Number *
                                            </Label>
                                            <Input
                                                id="nidNumber"
                                                value={applicationData.nidNumber}
                                                onChange={(e) => handleInputChange('nidNumber', e.target.value)}
                                                placeholder="Enter NID or Passport number"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="occupation" className="text-sm font-semibold mb-2 block">
                                                Occupation *
                                            </Label>
                                            <Input
                                                id="occupation"
                                                value={applicationData.occupation}
                                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                                placeholder="Your profession"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="annualIncome" className="text-sm font-semibold mb-2 block">
                                                Annual Income ($) *
                                            </Label>
                                            <Input
                                                id="annualIncome"
                                                type="number"
                                                value={applicationData.annualIncome}
                                                onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                                                placeholder="Your annual income"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="address" className="text-sm font-semibold mb-2 block">
                                            Address *
                                        </Label>
                                        <Textarea
                                            id="address"
                                            value={applicationData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter your complete address"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="city" className="text-sm font-semibold mb-2 block">
                                                City *
                                            </Label>
                                            <Input
                                                id="city"
                                                value={applicationData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                placeholder="Your city"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="postalCode" className="text-sm font-semibold mb-2 block">
                                                Postal Code *
                                            </Label>
                                            <Input
                                                id="postalCode"
                                                value={applicationData.postalCode}
                                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                                placeholder="Postal code"
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Nominee Information */}
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-primary" />
                                        Nominee Information
                                    </CardTitle>
                                    <CardDescription>
                                        Details of the person who will receive the policy benefits
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="nomineeName" className="text-sm font-semibold mb-2 block">
                                                Nominee Name *
                                            </Label>
                                            <Input
                                                id="nomineeName"
                                                value={applicationData.nomineeName}
                                                onChange={(e) => handleInputChange('nomineeName', e.target.value)}
                                                placeholder="Nominee's full name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="nomineeRelationship" className="text-sm font-semibold mb-2 block">
                                                Relationship *
                                            </Label>
                                            <Select 
                                                value={applicationData.nomineeRelationship} 
                                                onValueChange={(value) => handleInputChange('nomineeRelationship', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="spouse">Spouse</SelectItem>
                                                    <SelectItem value="child">Child</SelectItem>
                                                    <SelectItem value="parent">Parent</SelectItem>
                                                    <SelectItem value="sibling">Sibling</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="nomineePhone" className="text-sm font-semibold mb-2 block">
                                                Nominee Phone *
                                            </Label>
                                            <Input
                                                id="nomineePhone"
                                                type="tel"
                                                value={applicationData.nomineePhone}
                                                onChange={(e) => handleInputChange('nomineePhone', e.target.value)}
                                                placeholder="Nominee's phone number"
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Health Disclosure */}
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        Health Disclosure
                                    </CardTitle>
                                    <CardDescription>
                                        Please disclose any health conditions for accurate underwriting
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-sm font-semibold mb-3 block">Health Conditions</Label> {/* Added mb-3 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Increased gap from gap-3 to gap-4 */}
                                            {healthConditionsList.map((condition) => (
                                                <div key={condition} className="flex items-center space-x-3"> {/* Increased space-x-2 to space-x-3 */}
                                                    <Checkbox
                                                        id={condition}
                                                        checked={applicationData.healthConditions.includes(condition)}
                                                        onCheckedChange={(checked) => 
                                                            handleHealthConditionChange(condition, checked)
                                                        }
                                                    />
                                                    <Label htmlFor={condition} className="text-sm cursor-pointer">
                                                        {condition}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <Label className="text-sm font-semibold mb-3 block">Lifestyle Information</Label> {/* Added mb-3 */}
                                        <div className="space-y-4"> {/* Increased space-y-3 to space-y-4 */}
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="hasSmokingHistory"
                                                    checked={applicationData.hasSmokingHistory}
                                                    onCheckedChange={(checked) => 
                                                        handleInputChange('hasSmokingHistory', checked)
                                                    }
                                                />
                                                <Label htmlFor="hasSmokingHistory" className="cursor-pointer">
                                                    I have a history of smoking
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="hasAlcoholHistory"
                                                    checked={applicationData.hasAlcoholHistory}
                                                    onCheckedChange={(checked) => 
                                                        handleInputChange('hasAlcoholHistory', checked)
                                                    }
                                                />
                                                <Label htmlFor="hasAlcoholHistory" className="cursor-pointer">
                                                    I consume alcohol regularly
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="hasFamilyHistory"
                                                    checked={applicationData.hasFamilyHistory}
                                                    onCheckedChange={(checked) => 
                                                        handleInputChange('hasFamilyHistory', checked)
                                                    }
                                                />
                                                <Label htmlFor="hasFamilyHistory" className="cursor-pointer">
                                                    Family history of critical illnesses
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="hasChronicDisease"
                                                    checked={applicationData.hasChronicDisease}
                                                    onCheckedChange={(checked) => 
                                                        handleInputChange('hasChronicDisease', checked)
                                                    }
                                                />
                                                <Label htmlFor="hasChronicDisease" className="cursor-pointer">
                                                    History of chronic diseases
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="height" className="text-sm font-semibold mb-2 block">
                                                Height (cm)
                                            </Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                value={applicationData.height}
                                                onChange={(e) => handleInputChange('height', e.target.value)}
                                                placeholder="Height in cm"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="weight" className="text-sm font-semibold mb-2 block">
                                                Weight (kg)
                                            </Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                value={applicationData.weight}
                                                onChange={(e) => handleInputChange('weight', e.target.value)}
                                                placeholder="Weight in kg"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Section */}
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <Alert className="bg-blue-500/10 border-blue-500/20 mb-4">
                                        <AlertCircle className="w-4 h-4 text-blue-600" />
                                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                                            By submitting this application, you confirm that all information provided is accurate and complete.
                                        </AlertDescription>
                                    </Alert>
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => navigate(`/quotes/${id}`, { state: { quoteData, estimatedPremium, policy } })}
                                            className="flex-1 border-border hover:bg-accent py-3" // Added py-3 for equal height
                                        >
                                            Back to Quote
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3" // Changed from py-6 to py-3 for equal height
                                            disabled={submitApplication.isLoading}
                                        >
                                            {submitApplication.isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Submit Application
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Summary Sidebar - REMOVED sticky positioning */}
                        <div className="space-y-6">
                            {/* Application Summary */}
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl"> {/* Removed sticky top-6 */}
                                <CardHeader>
                                    <CardTitle className="text-lg">Application Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Policy</span>
                                            <span className="font-semibold text-foreground">{policy?.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Coverage</span>
                                            <span className="font-semibold text-foreground">
                                                ${parseInt(quoteData.coverageAmount).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Duration</span>
                                            <span className="font-semibold text-foreground">{quoteData.duration} years</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Monthly Premium</span>
                                            <span className="font-semibold text-primary">${estimatedPremium?.monthly}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-foreground">What happens next?</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Application review (2-3 business days)</li>
                                            <li>• Medical underwriting if required</li>
                                            <li>• Policy issuance</li>
                                            <li>• Premium payment setup</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Required Documents */}
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm"> {/* Removed sticky positioning */}
                                <CardHeader>
                                    <CardTitle className="text-lg">Required Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <IdCard className="w-4 h-4 text-primary" />
                                        <span className="text-sm">NID/Passport Copy</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Home className="w-4 h-4 text-primary" />
                                        <span className="text-sm">Proof of Address</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-primary" />
                                        <span className="text-sm">Recent Photograph</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="text-sm">Income Proof (if applicable)</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;