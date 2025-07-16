import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  Calendar,
  Mail
} from "lucide-react";

export default function Terms() {
  const lastUpdated = "July 16, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Legal terms and conditions for using ComicAI
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-primary" />
                <span>Agreement Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using ComicAI, you agree to be bound by these Terms of Service. 
                Please read them carefully. If you do not agree with any part of these terms, 
                you may not use our service.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>1. Service Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ComicAI is an AI-powered platform that enables users to create comics, anime, and visual stories. 
                Our service includes:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>AI-powered comic and story generation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Character creation and development tools</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Marketplace for publishing and selling comics</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Community features and educational resources</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>2. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Account Creation</h4>
                <p className="text-muted-foreground">
                  You must provide accurate information when creating an account. You are responsible 
                  for maintaining the security of your account credentials.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Age Requirements</h4>
                <p className="text-muted-foreground">
                  You must be at least 13 years old to use ComicAI. Users under 18 must have 
                  parental consent.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Account Responsibility</h4>
                <p className="text-muted-foreground">
                  You are responsible for all activities that occur under your account. Notify us 
                  immediately of any unauthorized use.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>3. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Your Content</h4>
                <p className="text-muted-foreground">
                  You retain ownership of the comics, stories, and characters you create using our platform. 
                  You grant ComicAI a license to host, display, and distribute your content as necessary 
                  to provide our services.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI-Generated Content</h4>
                <p className="text-muted-foreground">
                  Content generated by our AI systems is owned by you, subject to these terms and 
                  applicable laws. However, you acknowledge that similar content may be generated 
                  for other users.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Platform Rights</h4>
                <p className="text-muted-foreground">
                  ComicAI and its technology, including our AI models, software, and branding, 
                  remain our intellectual property.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>4. Acceptable Use Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You agree not to use ComicAI for:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Creating illegal, harmful, or offensive content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Infringing on others' intellectual property rights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Harassment, abuse, or harmful behavior toward other users</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Attempting to reverse engineer or exploit our AI systems</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Spamming or automated misuse of our platform</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle>5. Payment and Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Subscription Plans</h4>
                <p className="text-muted-foreground">
                  Paid plans are billed monthly or annually as selected. Lifetime plans are 
                  one-time purchases. All fees are non-refundable except as required by law.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Credit System</h4>
                <p className="text-muted-foreground">
                  Credits are used for AI-powered features. Credits reset monthly for subscription 
                  plans and do not roll over. Unused credits have no cash value.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cancellation</h4>
                <p className="text-muted-foreground">
                  You may cancel your subscription at any time. Cancellation takes effect at the 
                  end of your current billing period.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>6. Disclaimers and Limitations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Service Availability</h4>
                <p className="text-muted-foreground">
                  We strive for high availability but cannot guarantee uninterrupted service. 
                  We may perform maintenance or updates that temporarily affect service.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI Limitations</h4>
                <p className="text-muted-foreground">
                  AI-generated content may not always meet your expectations. We do not guarantee 
                  the quality, accuracy, or suitability of AI-generated content for any purpose.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Limitation of Liability</h4>
                <p className="text-muted-foreground">
                  ComicAI's liability is limited to the amount you paid for the service in the 
                  preceding 12 months. We are not liable for indirect, incidental, or consequential damages.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>7. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">By You</h4>
                <p className="text-muted-foreground">
                  You may terminate your account at any time through your account settings.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">By ComicAI</h4>
                <p className="text-muted-foreground">
                  We may suspend or terminate accounts that violate these terms or for other 
                  legitimate business reasons, with appropriate notice where possible.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Effect of Termination</h4>
                <p className="text-muted-foreground">
                  Upon termination, your access to the service ends. We may retain some data 
                  for legal or operational purposes as described in our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These terms are governed by the laws of [Jurisdiction]. Any disputes will be 
                resolved through binding arbitration in [Location], except for claims that may 
                be resolved in small claims court.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update these terms from time to time. We will notify you of material 
                changes via email or through our platform. Your continued use after such 
                updates constitutes acceptance of the revised terms.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>
                Questions about these terms?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> legal@comicai.app
                </p>
                <p className="text-muted-foreground">
                  <strong>Address:</strong> [Company Address]
                </p>
                <p className="text-muted-foreground">
                  <strong>Response Time:</strong> We will respond to legal inquiries within 5 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acknowledgment */}
        <div className="mt-12 text-center">
          <Badge className="bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            Terms Updated July 16, 2025
          </Badge>
          <p className="text-sm text-muted-foreground mt-4">
            By using ComicAI, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}