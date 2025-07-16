import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  Mail,
  Calendar
} from "lucide-react";

export default function Privacy() {
  const lastUpdated = "July 16, 2025";

  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="w-5 h-5" />,
      content: [
        {
          subtitle: "Account Information",
          details: "When you create an account, we collect your username, email address, and encrypted password."
        },
        {
          subtitle: "Usage Data",
          details: "We collect information about how you use our platform, including comics created, features used, and time spent on the platform."
        },
        {
          subtitle: "Content Data",
          details: "We store the comics, characters, and stories you create on our platform to provide our services."
        },
        {
          subtitle: "Payment Information",
          details: "Payment processing is handled by Stripe. We do not store your credit card information directly."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="w-5 h-5" />,
      content: [
        {
          subtitle: "Service Provision",
          details: "We use your information to provide, maintain, and improve our comic creation services."
        },
        {
          subtitle: "AI Training",
          details: "Your creative content may be used to improve our AI models, but only in anonymized form."
        },
        {
          subtitle: "Communication",
          details: "We may send you service updates, security alerts, and promotional communications (which you can opt out of)."
        },
        {
          subtitle: "Analytics",
          details: "We analyze usage patterns to understand how to improve our platform and develop new features."
        }
      ]
    },
    {
      title: "Information Sharing",
      icon: <Globe className="w-5 h-5" />,
      content: [
        {
          subtitle: "Public Content",
          details: "Comics you publish to the marketplace become publicly visible along with your username."
        },
        {
          subtitle: "Service Providers",
          details: "We share data with trusted service providers (like Stripe for payments) who help us operate our platform."
        },
        {
          subtitle: "Legal Requirements",
          details: "We may disclose information if required by law or to protect our rights and users' safety."
        },
        {
          subtitle: "No Sale of Data",
          details: "We do not sell, rent, or trade your personal information to third parties for marketing purposes."
        }
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="w-5 h-5" />,
      content: [
        {
          subtitle: "Encryption",
          details: "All data is encrypted in transit and at rest using industry-standard encryption."
        },
        {
          subtitle: "Access Controls",
          details: "We implement strict access controls and regularly audit who has access to user data."
        },
        {
          subtitle: "Regular Security Audits",
          details: "We conduct regular security assessments and vulnerability testing."
        },
        {
          subtitle: "Incident Response",
          details: "We have procedures in place to quickly respond to and mitigate security incidents."
        }
      ]
    },
    {
      title: "Your Rights",
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          subtitle: "Access",
          details: "You can request a copy of all personal data we have about you."
        },
        {
          subtitle: "Correction",
          details: "You can update your account information at any time through your settings."
        },
        {
          subtitle: "Deletion",
          details: "You can request deletion of your account and associated data (subject to legal retention requirements)."
        },
        {
          subtitle: "Portability",
          details: "You can export your comics and data in standard formats."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground mb-6">
            How we collect, use, and protect your information
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
                <Shield className="w-5 h-5 text-primary" />
                <span>Our Commitment to Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                At ComicAI, we believe privacy is a fundamental right. This policy explains how we collect, 
                use, and protect your personal information when you use our AI-powered comic creation platform. 
                We are committed to being transparent about our data practices and giving you control over your information.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h4 className="font-medium mb-2">{item.subtitle}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact Us About Privacy</span>
              </CardTitle>
              <CardDescription>
                Questions about this privacy policy or our data practices?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Privacy Officer</h4>
                  <p className="text-muted-foreground">
                    Email: privacy@comicai.app
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Protection Requests</h4>
                  <p className="text-muted-foreground">
                    For requests to access, correct, or delete your data, please contact us through your account settings 
                    or email data-protection@comicai.app with your request.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Response Time</h4>
                  <p className="text-muted-foreground">
                    We will respond to privacy-related inquiries within 30 days of receipt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Badges */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-4 mb-6">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              GDPR Compliant
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Lock className="w-3 h-3 mr-1" />
              SOC 2 Type II
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Database className="w-3 h-3 mr-1" />
              ISO 27001
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            ComicAI follows industry best practices and complies with applicable data protection regulations.
          </p>
        </div>

        {/* Policy Updates */}
        <div className="mt-12">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700">
                We may update this privacy policy from time to time to reflect changes in our practices or 
                applicable laws. We will notify you of material changes via email or through our platform. 
                Your continued use of ComicAI after such updates constitutes acceptance of the revised policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}