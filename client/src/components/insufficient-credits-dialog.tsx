import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, CreditCard, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";

interface InsufficientCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredCredits: number;
  currentCredits: number;
  actionType: string; // e.g., "story generation", "panel creation"
}

export default function InsufficientCreditsDialog({
  open,
  onOpenChange,
  requiredCredits,
  currentCredits,
  actionType
}: InsufficientCreditsDialogProps) {
  const creditsNeeded = requiredCredits - currentCredits;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Insufficient Credits
          </DialogTitle>
          <DialogDescription>
            You need {requiredCredits} credits for {actionType}, but you only have {currentCredits} credits available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Current Balance</span>
                </div>
                <Badge variant="secondary">{currentCredits} credits</Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Credits Needed</span>
                <Badge variant="destructive">{creditsNeeded} more</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Solutions */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-900">Choose your solution:</h4>
            
            {/* Quick Credit Purchase */}
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Credits
                </CardTitle>
                <CardDescription className="text-sm">
                  Quick purchase - $0.10 per credit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{Math.max(creditsNeeded, 25)} credits</span>
                  <span className="font-medium">{formatCurrency(Math.max(creditsNeeded, 25) * 0.10)}</span>
                </div>
                <Link href="/credits">
                  <Button className="w-full" size="sm">
                    <CreditCard className="mr-2 h-3 w-3" />
                    Buy Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Subscription Upgrade */}
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                  Upgrade Plan
                </CardTitle>
                <CardDescription className="text-sm">
                  Get monthly credits + unlimited features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                    Basic: 50 credits/month for $9.99
                  </div>
                  <div className="flex items-center text-xs">
                    <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                    Pro: 200 credits/month for $29.99
                  </div>
                </div>
                <Link href="/credits">
                  <Button variant="outline" className="w-full" size="sm">
                    <TrendingUp className="mr-2 h-3 w-3" />
                    View Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Alternative Actions */}
          <div className="pt-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full" 
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel and Continue Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}