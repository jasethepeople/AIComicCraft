import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Zap, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CreditBalance {
  credits: number;
  subscriptionTier: string;
  subscriptionStatus: string;
}

interface CreditTransaction {
  id: number;
  amount: number;
  description: string;
  type: string;
  createdAt: string;
  stripePaymentIntentId?: string;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  tier: string;
  monthlyCredits: number;
  priceMonthly?: number;
  priceYearly?: number;
  priceLifetime?: number;
  features: string[];
  isActive: boolean;
}

const CreditPurchaseForm = ({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/credits",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Credits have been added to your account!",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || !elements} className="w-full">
        <CreditCard className="mr-2 h-4 w-4" />
        Complete Purchase
      </Button>
    </form>
  );
};

const SubscriptionPurchaseForm = ({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/credits",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been upgraded successfully!",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || !elements} className="w-full">
        <TrendingUp className="mr-2 h-4 w-4" />
        Upgrade Subscription
      </Button>
    </form>
  );
};

export default function Credits() {
  const { toast } = useToast();
  const [selectedCreditAmount, setSelectedCreditAmount] = useState<number>(50);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<string>("monthly");
  const [creditClientSecret, setCreditClientSecret] = useState("");
  const [subscriptionClientSecret, setSubscriptionClientSecret] = useState("");
  const [showCreditPurchase, setShowCreditPurchase] = useState(false);
  const [showSubscriptionUpgrade, setShowSubscriptionUpgrade] = useState(false);

  // Fetch credit balance and subscription info
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useQuery<CreditBalance>({
    queryKey: ["/api/credits/balance"],
    enabled: true
  });

  // Fetch credit transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<CreditTransaction[]>({
    queryKey: ["/api/credits/transactions"],
    enabled: true
  });

  // Fetch subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription/plans"],
    enabled: true
  });

  // Credit purchase mutation
  const creditPurchaseMutation = useMutation({
    mutationFn: async (creditAmount: number) => {
      const response = await apiRequest("POST", "/api/credits/purchase", { creditAmount });
      return response.json();
    },
    onSuccess: (data) => {
      setCreditClientSecret(data.clientSecret);
      setShowCreditPurchase(true);
    },
    onError: (error: any) => {
      console.error("Credit purchase error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate credit purchase",
        variant: "destructive",
      });
    }
  });

  // Subscription purchase mutation
  const subscriptionPurchaseMutation = useMutation({
    mutationFn: async ({ planTier, billingCycle }: { planTier: string, billingCycle: string }) => {
      const response = await apiRequest("POST", "/api/subscription/purchase", { planTier, billingCycle });
      return response.json();
    },
    onSuccess: (data) => {
      setSubscriptionClientSecret(data.clientSecret);
      setShowSubscriptionUpgrade(true);
    },
    onError: (error: any) => {
      console.error("Subscription purchase error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate subscription purchase",
        variant: "destructive",
      });
    }
  });

  const handleCreditPurchase = (amount: number) => {
    setSelectedCreditAmount(amount);
    creditPurchaseMutation.mutate(amount);
  };

  const handleSubscriptionUpgrade = (plan: SubscriptionPlan, billingCycle: string) => {
    setSelectedPlan(plan);
    setSelectedBillingCycle(billingCycle);
    subscriptionPurchaseMutation.mutate({ planTier: plan.tier, billingCycle });
  };

  const onPaymentSuccess = () => {
    setShowCreditPurchase(false);
    setShowSubscriptionUpgrade(false);
    setCreditClientSecret("");
    setSubscriptionClientSecret("");
    refetchBalance();
    queryClient.invalidateQueries({ queryKey: ["/api/credits/transactions"] });
  };

  if (balanceLoading || plansLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentPlan = plans.find(plan => plan.tier === balance?.subscriptionTier);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Credits & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your credits and subscription to unlock AI generation features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credit Balance */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {balance?.credits || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Available Credits
                  </div>
                  <Badge variant={balance?.subscriptionTier === "lifetime" ? "default" : "secondary"}>
                    {currentPlan?.name || "Free"} Plan
                  </Badge>
                  {currentPlan && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      {balance?.subscriptionTier === "lifetime" ? 
                        "Unlimited credits" : 
                        `${currentPlan.monthlyCredits} credits/month`
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Credit Purchase */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Buy More Credits</CardTitle>
                <CardDescription>
                  $0.10 per credit - use for any AI generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[25, 50, 100, 250].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => handleCreditPurchase(amount)}
                    disabled={creditPurchaseMutation.isPending}
                  >
                    <span>{amount} Credits</span>
                    <span>{formatCurrency(amount * 0.10)}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Subscription Plans */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Upgrade your plan for more monthly credits and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.filter(plan => plan.tier !== "free").map((plan) => (
                    <Card key={plan.id} className={`relative ${balance?.subscriptionTier === plan.tier ? 'ring-2 ring-primary' : ''}`}>
                      {balance?.subscriptionTier === plan.tier && (
                        <Badge className="absolute -top-2 -right-2">Current</Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {plan.name}
                          <Badge variant={plan.tier === "lifetime" ? "default" : "secondary"}>
                            {plan.tier === "lifetime" ? "Best Value" : "Popular"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {plan.tier === "lifetime" ? "Unlimited" : plan.monthlyCredits} credits per month
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {plan.priceMonthly && (
                              <div className="flex justify-between items-center">
                                <span>Monthly</span>
                                <div className="text-right">
                                  <div className="font-semibold">{formatCurrency(plan.priceMonthly / 100)}/mo</div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSubscriptionUpgrade(plan, "monthly")}
                                    disabled={subscriptionPurchaseMutation.isPending || balance?.subscriptionTier === plan.tier}
                                  >
                                    {balance?.subscriptionTier === plan.tier ? "Current" : "Select"}
                                  </Button>
                                </div>
                              </div>
                            )}
                            {plan.priceYearly && (
                              <div className="flex justify-between items-center">
                                <span>Yearly</span>
                                <div className="text-right">
                                  <div className="font-semibold">{formatCurrency(plan.priceYearly / 100)}/year</div>
                                  <div className="text-xs text-green-600">Save 17%</div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSubscriptionUpgrade(plan, "yearly")}
                                    disabled={subscriptionPurchaseMutation.isPending || balance?.subscriptionTier === plan.tier}
                                  >
                                    {balance?.subscriptionTier === plan.tier ? "Current" : "Select"}
                                  </Button>
                                </div>
                              </div>
                            )}
                            {plan.priceLifetime && (
                              <div className="flex justify-between items-center">
                                <span>Lifetime</span>
                                <div className="text-right">
                                  <div className="font-semibold">{formatCurrency(plan.priceLifetime / 100)}</div>
                                  <div className="text-xs text-green-600">One-time payment</div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSubscriptionUpgrade(plan, "lifetime")}
                                    disabled={subscriptionPurchaseMutation.isPending || balance?.subscriptionTier === plan.tier}
                                  >
                                    {balance?.subscriptionTier === plan.tier ? "Current" : "Select"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                          <Separator />
                          <div className="space-y-1">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credit Transactions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="text-center py-4">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No transactions yet</div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center">
                          {transaction.type === "credit" ? (
                            <TrendingUp className="mr-3 h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="mr-3 h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "credit" ? "+" : "-"}{Math.abs(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Credit Purchase Dialog */}
      <Dialog open={showCreditPurchase} onOpenChange={setShowCreditPurchase}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase Credits</DialogTitle>
            <DialogDescription>
              Complete your purchase of {selectedCreditAmount} credits for {formatCurrency(selectedCreditAmount * 0.10)}
            </DialogDescription>
          </DialogHeader>
          {creditClientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret: creditClientSecret }}>
              <CreditPurchaseForm clientSecret={creditClientSecret} onSuccess={onPaymentSuccess} />
            </Elements>
          )}
        </DialogContent>
      </Dialog>

      {/* Subscription Upgrade Dialog */}
      <Dialog open={showSubscriptionUpgrade} onOpenChange={setShowSubscriptionUpgrade}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && `Upgrade to ${selectedPlan.name} plan (${selectedBillingCycle})`}
            </DialogDescription>
          </DialogHeader>
          {subscriptionClientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret: subscriptionClientSecret }}>
              <SubscriptionPurchaseForm clientSecret={subscriptionClientSecret} onSuccess={onPaymentSuccess} />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}