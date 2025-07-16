import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Book,
  Code,
  Zap,
  Settings,
  Database,
  Globe,
  Shield,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function Documentation() {
  const docSections = [
    {
      title: "Getting Started",
      icon: <Book className="w-6 h-6 text-blue-500" />,
      description: "Essential information for new users",
      articles: [
        { title: "Quick Start Guide", status: "Available" },
        { title: "Account Setup", status: "Available" },
        { title: "First Comic Creation", status: "Available" },
        { title: "Understanding Credits", status: "Available" }
      ]
    },
    {
      title: "API Reference",
      icon: <Code className="w-6 h-6 text-green-500" />,
      description: "Complete API documentation for developers",
      articles: [
        { title: "Authentication", status: "Coming Soon" },
        { title: "Comic Generation", status: "Coming Soon" },
        { title: "User Management", status: "Coming Soon" },
        { title: "Webhooks", status: "Coming Soon" }
      ]
    },
    {
      title: "Features & Tools",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      description: "Detailed guides for all platform features",
      articles: [
        { title: "Creator Studio", status: "Available" },
        { title: "Anime Studio", status: "Available" },
        { title: "Art Styles Guide", status: "Available" },
        { title: "Social Preview Generator", status: "Available" }
      ]
    },
    {
      title: "Account & Billing",
      icon: <Settings className="w-6 h-6 text-purple-500" />,
      description: "Manage your account and subscription",
      articles: [
        { title: "Subscription Plans", status: "Available" },
        { title: "Credit System", status: "Available" },
        { title: "Payment Methods", status: "Available" },
        { title: "Billing FAQs", status: "Available" }
      ]
    },
    {
      title: "Data & Privacy",
      icon: <Shield className="w-6 h-6 text-red-500" />,
      description: "Privacy policy and data handling",
      articles: [
        { title: "Privacy Policy", status: "Available" },
        { title: "Terms of Service", status: "Available" },
        { title: "Data Retention", status: "Available" },
        { title: "GDPR Compliance", status: "Available" }
      ]
    },
    {
      title: "Integrations",
      icon: <Globe className="w-6 h-6 text-cyan-500" />,
      description: "Third-party integrations and exports",
      articles: [
        { title: "Social Media Export", status: "Available" },
        { title: "Print Services", status: "Coming Soon" },
        { title: "Publishing Platforms", status: "Coming Soon" },
        { title: "Marketplace API", status: "Coming Soon" }
      ]
    }
  ];

  const quickLinks = [
    {
      title: "API Status",
      description: "Check current system status",
      icon: <Database className="w-5 h-5" />,
      href: "/support",
      external: false
    },
    {
      title: "GitHub Repository",
      description: "View source code and examples",
      icon: <Code className="w-5 h-5" />,
      href: "#",
      external: true
    },
    {
      title: "Community Forum",
      description: "Ask questions and get help",
      icon: <Globe className="w-5 h-5" />,
      href: "/community",
      external: false
    },
    {
      title: "Support Center",
      description: "Get help from our team",
      icon: <Shield className="w-5 h-5" />,
      href: "/support",
      external: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete guides, API references, and resources to help you make the most of ComicAI
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              type="text" 
              placeholder="Search documentation..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow group cursor-pointer">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  {link.icon}
                </div>
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription className="text-sm">{link.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" size="sm" className="w-full">
                  {link.external ? (
                    <>
                      View
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </>
                  ) : (
                    <>
                      Open
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {docSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  {section.icon}
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.articles.map((article, articleIndex) => (
                    <div key={articleIndex} className="flex items-center justify-between">
                      <span className="text-sm hover:text-primary cursor-pointer transition-colors">
                        {article.title}
                      </span>
                      <Badge 
                        variant={article.status === "Available" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {article.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Preview */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>API Reference (Coming Soon)</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                RESTful API for integrating ComicAI into your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950 rounded-lg p-4 mb-4">
                <code className="text-green-400 text-sm">
                  {`curl -X POST https://api.comicai.app/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A superhero saving the city",
    "style": "superhero",
    "panels": 3
  }'`}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  Full API documentation will be available soon
                </span>
                <Button variant="secondary" size="sm" disabled>
                  View API Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="w-5 h-5" />
                <span>Need More Help?</span>
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Search FAQ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Community Forum
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Stay Updated</span>
              </CardTitle>
              <CardDescription>
                Get notified about documentation updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter to receive updates about new features, 
                API changes, and documentation improvements.
              </p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button size="sm">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}