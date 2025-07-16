import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Check, Zap, Crown, Star, Infinity } from "lucide-react";

export default function Pricing() {
  const { data: subscriptionPlans = [] } = useQuery({
    queryKey: ["/api/subscription/plans"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    onError: () => null,
  });

  const formatPrice = (cents: number | null) => {
    if (!cents) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case "lifetime": return <Crown className="w-6 h-6 text-purple-500" />;
      case "pro": return <Star className="w-6 h-6 text-blue-500" />;
      case "basic": return <Zap className="w-6 h-6 text-green-500" />;
      default: return <Zap className="w-6 h-6 text-gray-500" />;
    }
  };

  const getPlanGradient = (tier: string) => {
    switch (tier) {
      case "lifetime": return "from-purple-500 to-pink-500";
      case "pro": return "from-blue-500 to-cyan-500";
      case "basic": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const isCurrentPlan = (tier: string) => {
    return user?.subscriptionTier === tier;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered comic creation with our flexible pricing options
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>All plans include AI-powered comic generation</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {subscriptionPlans.map((plan: any) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden ${
                plan.tier === "pro" ? "ring-2 ring-primary border-primary" : ""
              } ${isCurrentPlan(plan.tier) ? "ring-2 ring-green-500" : ""}`}
            >
              {plan.tier === "pro" && (
                <Badge className="absolute top-4 right-4 bg-primary text-white">
                  Most Popular
                </Badge>
              )}
              {isCurrentPlan(plan.tier) && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  Current Plan
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getPlanIcon(plan.tier)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-[3rem] flex items-center justify-center">
                  {plan.tier === "free" && "Perfect for getting started"}
                  {plan.tier === "basic" && "Great for hobbyists and students"}
                  {plan.tier === "pro" && "Ideal for professionals and creators"}
                  {plan.tier === "lifetime" && "One-time payment, lifetime access"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="text-center">
                  {plan.tier === "lifetime" ? (
                    <div>
                      <div className="text-3xl font-bold">{formatPrice(plan.priceLifetime)}</div>
                      <div className="text-sm text-muted-foreground">one-time payment</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold">{formatPrice(plan.priceMonthly)}</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                      {plan.priceYearly && (
                        <div className="text-xs text-green-600 mt-1">
                          Save 20% with yearly: {formatPrice(plan.priceYearly)}/year
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Credits */}
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">
                      {plan.tier === "lifetime" ? "2,000" : plan.monthlyCredits} 
                      {plan.tier === "lifetime" ? " credits/month" : " credits/month"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {plan.tier === "lifetime" ? "Generous monthly allocation" : "Monthly allocation"}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {isCurrentPlan(plan.tier) ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan.tier === "free" ? (
                    <Link href="/register">
                      <Button variant="outline" className="w-full">
                        Get Started Free
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/credits">
                      <Button 
                        className={`w-full bg-gradient-to-r ${getPlanGradient(plan.tier)} hover:opacity-90 text-white`}
                      >
                        {plan.tier === "lifetime" ? "Get Lifetime Access" : "Upgrade Now"}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do credits work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Credits are used for AI-powered features like story generation, character creation, and panel generation. 
                  Each operation typically costs 5 credits. Your monthly credits reset at the beginning of each billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate any billing differences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included with the Lifetime plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Lifetime plan includes all Pro features plus 2,000 credits per month for life, 
                  with no recurring payments. It's perfect for serious creators who want unlimited access.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do unused credits roll over?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Currently, unused credits do not roll over to the next month. We recommend using your 
                  credits within each billing cycle to get the most value from your subscription.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Creating?</h3>
            <p className="mb-6 opacity-90">
              Join thousands of creators who are already using ComicAI to bring their stories to life
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}