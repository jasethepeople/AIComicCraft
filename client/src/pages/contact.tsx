import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin,
  Send,
  Clock,
  HelpCircle,
  Bug,
  Lightbulb,
  Star
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@comicai.app",
      action: "mailto:support@comicai.app"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      title: "Community Forum",
      description: "Connect with other creators",
      contact: "Community Discussion",
      action: "/community"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: "Response Time",
      description: "We typically respond within",
      contact: "24 hours",
      action: null
    }
  ];

  const categories = [
    { value: "general", label: "General Inquiry", icon: <HelpCircle className="w-4 h-4" /> },
    { value: "technical", label: "Technical Support", icon: <Bug className="w-4 h-4" /> },
    { value: "billing", label: "Billing & Payments", icon: <Star className="w-4 h-4" /> },
    { value: "feature", label: "Feature Request", icon: <Lightbulb className="w-4 h-4" /> },
    { value: "partnership", label: "Partnership", icon: <Mail className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need help? We're here to assist you. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Send us a Message</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-2">
                              {category.icon}
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {method.icon}
                    <div className="flex-1">
                      <h3 className="font-medium">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                      {method.action ? (
                        method.action.startsWith("mailto:") ? (
                          <a 
                            href={method.action}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            {method.contact}
                          </a>
                        ) : (
                          <a 
                            href={method.action}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            {method.contact}
                          </a>
                        )
                      ) : (
                        <span className="text-sm font-medium">{method.contact}</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">How do I reset my password?</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the "Forgot Password" link on the login page to reset your password.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">How do credits work?</h4>
                  <p className="text-sm text-muted-foreground">
                    Credits are used for AI features. Each generation typically costs 5 credits.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Can I cancel my subscription?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel anytime from your account settings.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Support Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-muted-foreground">9 AM - 6 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-muted-foreground">10 AM - 4 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Emergency technical issues are monitored 24/7
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}