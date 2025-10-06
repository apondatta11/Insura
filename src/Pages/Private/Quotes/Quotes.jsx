import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calculator,
  ArrowLeft,
  Shield,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import useAxios from "@/Hooks/useAxios";
import { QuoteLoading } from "@/Components/Loading/Loading";

const Quotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [quoteData, setQuoteData] = useState({
    age: "",
    gender: "male",
    coverageAmount: "",
    duration: "",
    isSmoker: "no",
  });
  const [estimatedPremium, setEstimatedPremium] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [ageError, setAgeError] = useState("");

  const {
    data: policy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["policy", id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/policies/${id}`);
        return res.data;
      } catch (err) {
        console.error("Error fetching policy:", err);
        throw err;
      }
    },
    enabled: !!id,
  });

  const validateAge = (age) => {
    if (!age) return "";

    const ageNum = parseInt(age);
    const minAge = policy?.minAge || 18;
    const maxAge = policy?.maxAge || 65;

    if (ageNum < minAge) {
      return `Minimum age for this policy is ${minAge} years`;
    }
    if (ageNum > maxAge) {
      return `Maximum age for this policy is ${maxAge} years`;
    }
    return "";
  };

  const calculatePremium = () => {
    if (!quoteData.age || !quoteData.coverageAmount || !quoteData.duration) {
      return;
    }

    const ageValidationError = validateAge(quoteData.age);
    if (ageValidationError) {
      setAgeError(ageValidationError);
      setEstimatedPremium(null);
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const baseRate = policy?.premiumDetails?.baseRate || 0.5;
      const age = parseInt(quoteData.age);
      const coverageAmount = parseInt(quoteData.coverageAmount);
      const duration = parseInt(quoteData.duration);

      let annualPremium = (coverageAmount * baseRate) / 100;

      const ageFactor = 1 + Math.max(0, age - 30) * 0.02;
      annualPremium *= ageFactor;

      if (quoteData.gender === "male") {
        annualPremium *= 1.1;
      }

      if (quoteData.isSmoker === "yes") {
        annualPremium *= 1.5;
      }

      const durationDiscount = duration > 20 ? 0.9 : 1;
      annualPremium *= durationDiscount;

      const monthlyPremium = Math.round(annualPremium / 12);
      const totalPremium = Math.round(annualPremium * duration);

      setEstimatedPremium({
        monthly: monthlyPremium,
        annual: Math.round(annualPremium),
        total: totalPremium,
        duration: duration,
      });
      setIsCalculating(false);
    }, 1000);
  };

  useEffect(() => {
    calculatePremium();
  }, [quoteData]);

  const handleInputChange = (field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "age") {
      setAgeError("");
    }
  };

  const handleAgeBlur = (e) => {
    const age = e.target.value;
    const error = validateAge(age);
    setAgeError(error);

    if (!error && age && quoteData.coverageAmount && quoteData.duration) {
      calculatePremium();
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount?.toLocaleString()}`;
  };

  const isFormValid =
    estimatedPremium &&
    !ageError &&
    quoteData.age &&
    quoteData.coverageAmount &&
    quoteData.duration;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4 border-border">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Policy Not Found
            </h3>
            <p className="text-muted-foreground mb-4">
              The requested policy could not be found.
            </p>
            <Button
              onClick={() => navigate("/policies")}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Policies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <QuoteLoading></QuoteLoading>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10 py-8">
      <div className="container mx-auto px-4">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/policies/${id}`)}
            className="border-border hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Policy
          </Button>
          <Badge
            variant="secondary"
            className="bg-primary/20 text-primary border-primary/30"
          >
            <Calculator className="w-3 h-3 mr-1" />
            Premium Calculator
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calculator className="w-6 h-6 text-primary" />
                  Get Your Personalized Quote
                </CardTitle>
                <CardDescription>
                  Fill in your details to get an accurate premium estimate for{" "}
                  {policy?.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Age */}
                <div className="space-y-4">
                  <Label htmlFor="age" className="text-base font-semibold">
                    Your Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min={policy?.minAge || 18}
                    max={policy?.maxAge || 65}
                    value={quoteData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    onBlur={handleAgeBlur}
                    placeholder={`Enter age (${policy?.minAge}-${policy?.maxAge} years)`}
                    className={`w-full mt-2 ${
                      ageError ? "border-destructive" : ""
                    }`}
                  />
                  {ageError && (
                    <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {ageError}
                    </div>
                  )}
                </div>

                {/* Rest of the form remains the same */}
                {/* Gender */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Gender</Label>
                  <RadioGroup
                    value={quoteData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                    className="flex gap-6 mt-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="male" id="male" />
                      <Label
                        htmlFor="male"
                        className="cursor-pointer text-base"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="female" id="female" />
                      <Label
                        htmlFor="female"
                        className="cursor-pointer text-base"
                      >
                        Female
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Coverage Amount */}
                <div className="space-y-4">
                  <Label
                    htmlFor="coverageAmount"
                    className="text-base font-semibold"
                  >
                    Coverage Amount *
                  </Label>
                  <Select
                    value={quoteData.coverageAmount}
                    onValueChange={(value) =>
                      handleInputChange("coverageAmount", value)
                    }
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select coverage amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100000">$100,000</SelectItem>
                      <SelectItem value="250000">$250,000</SelectItem>
                      <SelectItem value="500000">$500,000</SelectItem>
                      <SelectItem value="1000000">$1,000,000</SelectItem>
                      <SelectItem value="2000000">$2,000,000</SelectItem>
                      <SelectItem value="5000000">$5,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Available range:{" "}
                    {formatCurrency(policy?.coverage?.minAmount)} -{" "}
                    {formatCurrency(policy?.coverage?.maxAmount)}
                  </p>
                </div>

                {/* Duration */}
                <div className="space-y-4">
                  <Label htmlFor="duration" className="text-base font-semibold">
                    Policy Duration *
                  </Label>
                  <Select
                    value={quoteData.duration}
                    onValueChange={(value) =>
                      handleInputChange("duration", value)
                    }
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select policy duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {policy?.duration?.options?.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option} years
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Smoker Status */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Do you smoke?
                  </Label>
                  <RadioGroup
                    value={quoteData.isSmoker}
                    onValueChange={(value) =>
                      handleInputChange("isSmoker", value)
                    }
                    className="flex gap-6 mt-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="no" id="non-smoker" />
                      <Label
                        htmlFor="non-smoker"
                        className="cursor-pointer text-base"
                      >
                        Non-smoker
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="yes" id="smoker" />
                      <Label
                        htmlFor="smoker"
                        className="cursor-pointer text-base"
                      >
                        Smoker
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {isCalculating && (
                  <div className="flex items-center gap-2 text-primary mt-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Calculating your premium...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* Premium Results */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Premium Estimate
                </CardTitle>
                <CardDescription>Based on your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {estimatedPremium && !ageError ? (
                  <>
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-primary">
                        ${estimatedPremium.monthly}/month
                      </p>
                      <p className="text-lg text-muted-foreground">
                        or ${estimatedPremium.annual} annually
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Coverage Amount
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(quoteData.coverageAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Policy Term
                        </span>
                        <span className="font-semibold">
                          {quoteData.duration} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Premium
                        </span>
                        <span className="font-semibold">
                          ${estimatedPremium.total}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Age</span>
                        <span className="font-semibold">
                          {quoteData.age} years
                        </span>
                      </div>
                    </div>

                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        Great news! You qualify for this policy based on your
                        information.
                      </AlertDescription>
                    </Alert>
                  </>
                ) : ageError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive font-medium">{ageError}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please adjust your age to proceed
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Fill in your details to see your personalized premium
                      estimate
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6"
                  disabled={!isFormValid}
                  onClick={() =>
                    navigate(`/apply/${id}`, {
                      state: {
                        quoteData,
                        estimatedPremium,
                        policy,
                      },
                    })
                  }
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Apply for Policy
                </Button>
              </CardFooter>
            </Card>

            {/* Policy Summary - Same as before */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Policy Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Policy</span>
                  <span className="font-semibold text-foreground">
                    {policy?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground">
                    {policy?.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Rate</span>
                  <span className="font-semibold text-foreground">
                    {policy?.premiumDetails?.baseRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age Range</span>
                  <span className="font-semibold text-foreground">
                    {policy?.minAge} - {policy?.maxAge} years
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
