import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  CreditCard, 
  Settings, 
  Crown,
  Zap 
} from "lucide-react";

export default function Profile() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    onError: () => null
  });

  const { data: creditBalance } = useQuery({
    queryKey: ["/api/credits/balance"],
    enabled: !!user,
    onError: () => null
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "lifetime": return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "pro": return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "basic": return "bg-gradient-to-r from-green-500 to-emerald-500";
      default: return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">My Profile</h1>
          <p className="text-muted-foreground text-center">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user.username}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </CardDescription>
                  </div>
                </div>
                {user.isAdmin && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Subscription</p>
                    <Badge className={getTierColor(user.subscriptionTier)}>
                      {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Balance */}
          {creditBalance && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Credit Balance</span>
                </CardTitle>
                <CardDescription>
                  Credits are used for AI-generated content creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{creditBalance.credits}</p>
                    <p className="text-sm text-muted-foreground">
                      Credits remaining
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Plan: {creditBalance.subscriptionTier}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {creditBalance.subscriptionStatus}
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex space-x-2">
                  <Link href="/credits">
                    <Button variant="outline" size="sm">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Credits
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="sm">
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user.username} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total-credits">Total Credits Used</Label>
                <Input id="total-credits" value={user.totalCreditsUsed || 0} disabled />
              </div>
              <div className="flex space-x-2">
                <Link href="/settings">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}