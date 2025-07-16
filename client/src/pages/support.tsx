import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Search,
  Book,
  MessageCircle,
  Mail,
  Video,
  FileText,
  HelpCircle,
  Zap,
  CreditCard,
  Bug,
  ArrowRight
} from "lucide-react";

export default function Support() {
  const helpCategories = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Getting Started",
      description: "Learn the basics of creating your first comic",
      articles: [
        "Creating Your First Comic",
        "Understanding Credit System",
        "Choosing Art Styles",
        "Character Creation Guide"
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
      title: "Billing & Credits",
      description: "Manage your subscription and credits",
      articles: [
        "How Credits Work",
        "Upgrading Your Plan",
        "Payment Methods",
        "Billing FAQs"
      ]
    },
    {
      icon: <Bug className="w-6 h-6 text-red-500" />,
      title: "Troubleshooting",
      description: "Fix common issues and errors",
      articles: [
        "Generation Not Working",
        "Login Issues",
        "Image Download Problems",
        "Browser Compatibility"
      ]
    },
    {
      icon: <Book className="w-6 h-6 text-blue-500" />,
      title: "Advanced Features",
      description: "Master advanced comic creation techniques",
      articles: [
        "Anime Studio Guide",
        "Social Media Previews",
        "Marketplace Publishing",
        "API Documentation"
      ]
    }
  ];

  const quickActions = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      href: "/contact",
      available: false
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      href: "/contact",
      available: true
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Community Forum",
      description: "Connect with other creators",
      action: "Join Discussion",
      href: "/community",
      available: true
    },
    {
      icon: <Video className="w-5 h-5" />,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      action: "Watch Now",
      href: "/learn",
      available: true
    }
  ];

  const faqs = [
    {
      question: "How do I create my first comic?",
      answer: "Go to the Creator Studio, describe your story idea, select an art style, and let our AI generate your comic panels. You can then edit, rearrange, and publish your creation."
    },
    {
      question: "What are credits and how do they work?",
      answer: "Credits are used for AI-powered features like story generation and panel creation. Each operation typically costs 5 credits. Your monthly credits reset at the beginning of each billing cycle."
    },
    {
      question: "Can I download my comics?",
      answer: "Yes! You can download your comics in high-resolution PDF format, individual panel images, or web-optimized formats from the comic editor."
    },
    {
      question: "How do I upgrade my subscription?",
      answer: "Visit the Pricing page or go to Credits & Billing in your account menu to upgrade your plan. Changes take effect immediately."
    },
    {
      question: "What art styles are available?",
      answer: "We offer 15+ professional art styles including Superhero, Manga, Studio Ghibli, Vintage, Anime styles, and more. New styles are added regularly."
    },
    {
      question: "Can I sell my comics on the marketplace?",
      answer: "Yes! Pro and Lifetime subscribers can publish and sell their comics on our marketplace with revenue sharing."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers, get help, and learn how to make the most of ComicAI
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              type="text" 
              placeholder="Search for help articles..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className={`text-center hover:shadow-lg transition-shadow ${!action.available ? 'opacity-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-2">
                  {action.icon}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {action.available ? (
                  <Link href={action.href}>
                    <Button size="sm" className="w-full">
                      {action.action}
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {category.icon}
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, idx) => (
                      <li key={idx} className="text-sm">
                        <Link href="/learn">
                          <span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                            • {article}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-start space-x-2">
                    <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Status & Resources */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>System Status</span>
              </CardTitle>
              <CardDescription>All systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>API Services</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex justify-between">
                  <span>AI Generation</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex justify-between">
                  <span>File Downloads</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Additional Resources</span>
              </CardTitle>
              <CardDescription>More ways to get help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/learn">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Video Tutorials
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Community Forum
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full justify-start" disabled>
                <Book className="w-4 h-4 mr-2" />
                API Documentation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
            <p className="mb-6 opacity-90">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-primary">
                Contact Support
                <Mail className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}